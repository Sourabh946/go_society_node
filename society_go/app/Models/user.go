package models

import "time"

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"size:100;not null" json:"name"`
	Email     string         `gorm:"size:150;not null;unique" json:"email"`
	Password  string         `gorm:"size:255;not null" json:"-"`
	Roles     []UserRoleInfo `json:"roles" gorm:"-"`
	created_at time.Time      `gorm:"autoCreateTime" json:"created_at"`
	updated_at time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
}
