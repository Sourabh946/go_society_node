package models

type UserProfile struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	UserID       uint   `gorm:"not null" json:"user_id"`
	SocietyID    uint   `gorm:"not null" json:"society_id"`
	BlockID      uint   `gorm:"not null" json:"block_id"`
	FlatID       uint   `gorm:"not null" json:"flat_id"`
	FirstName    string `gorm:"size:100;not null" json:"first_name"`
	LastName     string `gorm:"size:100;not null" json:"last_name"`
	Phone        string `gorm:"size:20;not null" json:"phone"`
	ProfilePhoto string `gorm:"size:255" json:"profile_photo"`
	Gender       string `gorm:"size:10" json:"gender"`
	DateOfBirth  string `gorm:"size:20" json:"date_of_birth"`
}
