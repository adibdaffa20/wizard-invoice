package utils

import (
	"fmt"
	"time"
)

func GenerateInvoiceNumber() string {
	now := time.Now()
	return fmt.Sprintf(
		"INV-%04d%02d%02d-%d",
		now.Year(),
		now.Month(),
		now.Day(),
		now.UnixNano(),
	)
}