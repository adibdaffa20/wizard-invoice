package handlers

import (
	"invoice-app/internal/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type ItemHandler struct {
	DB *gorm.DB
}

func (h *ItemHandler) GetItemByCode(c *fiber.Ctx) error {
	code := c.Query("code")
	if code == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "code is required",
		})
	}

	var item models.Item
	if err := h.DB.Where("code = ?", code).First(&item).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "item not found",
		})
	}

	return c.JSON(item)
}