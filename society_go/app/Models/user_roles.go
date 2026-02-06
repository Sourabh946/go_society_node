package models

type UserRole struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	UserID string `gorm:"size:100;not null" json:"user_id"`
	RoleID string `gorm:"size:150;not null;unique" json:"role_id"`
}

type UserRoleInfo struct {
	RoleID   uint   `json:"role_id"`
	RoleName string `json:"role_name"`
}
