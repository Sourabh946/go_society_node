package models

type Society struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `gorm:"size:100;not null" json:"name"`
	Address     string `gorm:"size:255;not null" json:"address"`
	City        string `gorm:"size:100;not null" json:"city"`
	State       string `gorm:"size:100;not null" json:"state"`
	PinCode     int    `gorm:"column:pincode;not null" json:"pincode"`
	TotalBlocks int    `gorm:"not null" json:"total_blocks"`
	TotalFlats  int    `gorm:"not null" json:"total_flats"`
	Status      int    `gorm:"not null" json:"status"`
}

// TableName specifies the table name for Society model
func (Society) TableName() string {
	return "society"
}
