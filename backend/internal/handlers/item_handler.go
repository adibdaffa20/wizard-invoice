package handlers

import (
	"strings"

	"invoice-app/internal/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type ItemHandler struct {
	DB *gorm.DB
}

func (h *ItemHandler) GetItemByCode(c *fiber.Ctx) error {
	code := strings.TrimSpace(c.Query("code"))

	if code == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "code is required",
		})
	}

	var item models.Item

	// 🔥 Flexible search
	err := h.DB.
		Where("code ILIKE ?", "%"+code+"%").
		First(&item).Error

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "item not found",
		})
	}

	return c.JSON(item)
}