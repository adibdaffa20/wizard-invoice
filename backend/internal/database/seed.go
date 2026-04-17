package database

import "invoice-app/internal/models"

func SeedItems() error {
	items := []models.Item{
		{Code: "BRG-001", Name: "Kertas A4", Price: 50000},
		{Code: "BRG-002", Name: "Printer Ink", Price: 150000},
		{Code: "BRG-003", Name: "Stapler", Price: 35000},
		{Code: "BRG-004", Name: "Mouse Wireless", Price: 120000},
		{Code: "BRG-005", Name: "Keyboard Mechanical", Price: 450000},
	}

	for _, item := range items {
		var existing models.Item
		err := DB.Where("code = ?", item.Code).First(&existing).Error
		if err != nil {
			if err := DB.Create(&item).Error; err != nil {
				return err
			}
		}
	}

	return nil
}