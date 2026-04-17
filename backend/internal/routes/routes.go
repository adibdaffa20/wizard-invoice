package routes

import (
	"invoice-app/internal/config"
	"invoice-app/internal/database"
	"invoice-app/internal/handlers"
	"invoice-app/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func Register(app *fiber.App, cfg config.Config) {
	authHandler := handlers.AuthHandler{
		JWTSecret: cfg.JWTSecret,
	}
	itemHandler := handlers.ItemHandler{
		DB: database.DB,
	}
	invoiceHandler := handlers.InvoiceHandler{
		DB:         database.DB,
		WebhookURL: cfg.WebhookURL,
	}

	api := app.Group("/api")

	api.Post("/login", authHandler.Login)
	api.Get("/items", itemHandler.GetItemByCode)
	api.Post("/invoices", middleware.JWTProtected(cfg.JWTSecret), invoiceHandler.CreateInvoice)
}