package dto

type ItemResponse struct {
	ID    uint   `json:"id"`
	Code  string `json:"code"`
	Name  string `json:"name"`
	Price int64  `json:"price"`
}