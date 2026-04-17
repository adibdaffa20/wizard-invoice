package database

import "invoice-app/internal/models"

func AutoMigrate() error {
	return DB.AutoMigrate(
		&models.Item{},
		&models.Invoice{},
		&models.InvoiceDetail{},
	)
}