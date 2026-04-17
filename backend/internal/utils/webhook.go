package utils

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"invoice-app/internal/models"
)

type InvoiceWebhookPayload struct {
	Event         string                  `json:"event"`
	InvoiceID     uint                    `json:"invoice_id"`
	InvoiceNumber string                  `json:"invoice_number"`
	CreatedBy     uint                    `json:"created_by"`
	TotalAmount   int64                   `json:"total_amount"`
	CreatedAt     time.Time               `json:"created_at"`
	Details       []InvoiceWebhookDetail  `json:"details"`
}

type InvoiceWebhookDetail struct {
	ItemID   uint   `json:"item_id"`
	ItemCode string `json:"item_code"`
	ItemName string `json:"item_name"`
	Quantity int    `json:"quantity"`
	Price    int64  `json:"price"`
	Subtotal int64  `json:"subtotal"`
}

func SendInvoiceCreatedWebhook(webhookURL string, invoice models.Invoice) {
	if webhookURL == "" {
		return
	}

	payload := InvoiceWebhookPayload{
		Event:         "invoice.created",
		InvoiceID:     invoice.ID,
		InvoiceNumber: invoice.InvoiceNumber,
		CreatedBy:     invoice.CreatedBy,
		TotalAmount:   invoice.TotalAmount,
		CreatedAt:     invoice.CreatedAt,
		Details:       make([]InvoiceWebhookDetail, 0, len(invoice.Details)),
	}

	for _, detail := range invoice.Details {
		payload.Details = append(payload.Details, InvoiceWebhookDetail{
			ItemID:   detail.ItemID,
			ItemCode: detail.Item.Code,
			ItemName: detail.Item.Name,
			Quantity: detail.Quantity,
			Price:    detail.Price,
			Subtotal: detail.Subtotal,
		})
	}

	body, err := json.Marshal(payload)
	if err != nil {
		log.Println("webhook marshal error:", err)
		return
	}

	req, err := http.NewRequest(http.MethodPost, webhookURL, bytes.NewBuffer(body))
	if err != nil {
		log.Println("webhook request error:", err)
		return
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		log.Println("webhook send error:", err)
		return
	}
	defer resp.Body.Close()

	log.Println("webhook sent with status:", resp.Status)
}