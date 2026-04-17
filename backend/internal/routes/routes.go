package routes

import (
	"invoice-app/internal/config"
	"invoice-app/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

func Register(app *fiber.App, cfg config.Config) {
	authHandler := handlers.AuthHandler{
		JWTSecret: cfg.JWTSecret,
	}

	api := app.Group("/api")

	api.Post("/login", authHandler.Login)
}