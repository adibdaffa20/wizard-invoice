package main

import (
	"log"

	"invoice-app/internal/config"
	"invoice-app/internal/database"
	"invoice-app/internal/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	cfg := config.Load()

	database.Connect(cfg.DatabaseURL)

	if err := database.AutoMigrate(); err != nil {
		log.Fatal(err)
	}

	if err := database.SeedItems(); err != nil {
		log.Fatal(err)
	}

	app := fiber.New()

	app.Use(cors.New())

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "backend running",
		})
	})

	routes.Register(app, cfg)

	log.Printf("Server running on http://localhost:%s", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}