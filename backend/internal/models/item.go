package models

type Item struct {
	ID    uint   `gorm:"primaryKey" json:"id"`
	Code  string `gorm:"uniqueIndex;size:50;not null" json:"code"`
	Name  string `gorm:"size:150;not null" json:"name"`
	Price int64  `gorm:"not null" json:"price"`
}