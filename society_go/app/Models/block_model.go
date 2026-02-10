package models

type Block struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	SocietyID uint   `gorm:"not null" json:"society_id"`
	Name      string `gorm:"size:100;not null" json:"name"`
}
