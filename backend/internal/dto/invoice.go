package dto

type CreateInvoiceItemRequest struct {
	ItemID   *uint  `json:"item_id"`
	Code     string `json:"code"`
	Quantity int    `json:"quantity"`
	Price    *int64 `json:"price,omitempty"`
	Subtotal *int64 `json:"subtotal,omitempty"`
}

type CreateInvoiceRequest struct {
	SenderName      string                     `json:"sender_name"`
	SenderAddress   string                     `json:"sender_address"`
	ReceiverName    string                     `json:"receiver_name"`
	ReceiverAddress string                     `json:"receiver_address"`
	Items           []CreateInvoiceItemRequest `json:"items"`
}