package models

type InvoiceDetail struct {
	ID        uint `gorm:"primaryKey" json:"id"`
	InvoiceID uint `gorm:"not null;index" json:"invoice_id"`
	ItemID    uint `gorm:"not null" json:"item_id"`
	Quantity  int  `gorm:"not null" json:"quantity"`
	Price     int64 `gorm:"not null" json:"price"`
	Subtotal  int64 `gorm:"not null" json:"subtotal"`
	Item      Item  `gorm:"foreignKey:ItemID" json:"item"`
}