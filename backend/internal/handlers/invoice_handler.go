package handlers

import (
	"invoice-app/internal/dto"
	"invoice-app/internal/models"
	"invoice-app/internal/utils"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type InvoiceHandler struct {
	DB         *gorm.DB
	WebhookURL string
}

func (h *InvoiceHandler) CreateInvoice(c *fiber.Ctx) error {
	var req dto.CreateInvoiceRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid request body",
		})
	}

	if req.SenderName == "" || req.SenderAddress == "" || req.ReceiverName == "" || req.ReceiverAddress == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "header data is incomplete",
		})
	}

	if len(req.Items) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "items cannot be empty",
		})
	}

	createdBy, ok := c.Locals("user_id").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "invalid user context",
		})
	}

	var savedInvoice models.Invoice

	err := h.DB.Transaction(func(tx *gorm.DB) error {
		invoice := models.Invoice{
			InvoiceNumber:   utils.GenerateInvoiceNumber(),
			SenderName:      req.SenderName,
			SenderAddress:   req.SenderAddress,
			ReceiverName:    req.ReceiverName,
			ReceiverAddress: req.ReceiverAddress,
			CreatedBy:       createdBy,
			TotalAmount:     0,
		}

		if err := tx.Create(&invoice).Error; err != nil {
			return err
		}

		var grandTotal int64 = 0

		for _, input := range req.Items {
			if input.Quantity <= 0 {
				return fiber.NewError(fiber.StatusBadRequest, "quantity must be greater than zero")
			}

			var item models.Item
			query := tx.Model(&models.Item{})

			if input.ItemID != nil {
				query = query.Where("id = ?", *input.ItemID)
			} else {
				query = query.Where("code = ?", input.Code)
			}

			if err := query.First(&item).Error; err != nil {
				return fiber.NewError(fiber.StatusBadRequest, "item not found")
			}

			price := item.Price
			subtotal := price * int64(input.Quantity)
			grandTotal += subtotal

			detail := models.InvoiceDetail{
				InvoiceID: invoice.ID,
				ItemID:    item.ID,
				Quantity:  input.Quantity,
				Price:     price,
				Subtotal:  subtotal,
			}

			if err := tx.Create(&detail).Error; err != nil {
				return err
			}
		}

		if err := tx.Model(&invoice).Update("total_amount", grandTotal).Error; err != nil {
			return err
		}

		if err := tx.Preload("Details.Item").First(&savedInvoice, invoice.ID).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		if fiberErr, ok := err.(*fiber.Error); ok {
			return c.Status(fiberErr.Code).JSON(fiber.Map{
				"message": fiberErr.Message,
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed create invoice",
		})
	}

	go utils.SendInvoiceCreatedWebhook(h.WebhookURL, savedInvoice)

	return c.Status(fiber.StatusCreated).JSON(savedInvoice)
}