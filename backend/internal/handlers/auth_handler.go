package handlers

import (
	"invoice-app/internal/dto"
	"invoice-app/internal/utils"

	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	JWTSecret string
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req dto.LoginRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid request body",
		})
	}

	var userID uint
	var role string

	switch {
	case req.Username == "admin" && req.Password == "admin123":
		userID = 1
		role = "admin"
	case req.Username == "kerani" && req.Password == "kerani123":
		userID = 2
		role = "kerani"
	default:
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "invalid credentials",
		})
	}

	token, err := utils.GenerateToken(userID, role, h.JWTSecret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "failed to generate token",
		})
	}

	return c.JSON(dto.LoginResponse{
		Token: token,
	})
}