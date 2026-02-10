package models

type Flat struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	BlockID    uint   `gorm:"not null" json:"block_id"`
	FlatNumber string `gorm:"size:100;not null" json:"flat_number"`
}
