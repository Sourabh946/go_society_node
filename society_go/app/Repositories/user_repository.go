package Repositories

import (
	models "go_society_node/society_go/app/Models"
	"go_society_node/society_go/config"
)

func CreateUser(user *models.User) error {
	result := config.DB.Create(user)
	return result.Error
}

func GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	result := config.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func GetUserWithRole(email string) (*models.User, error) {
	var user models.User
	// Fetch user base info
	err := config.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}

	// Fetch all roles for the user
	var roles []models.UserRoleInfo
	err = config.DB.Table("user_roles").
		// Debug().
		Select("roles.id as role_id, roles.name as role_name").
		Joins("LEFT JOIN roles ON user_roles.role_id = roles.id").
		Where("user_roles.user_id = ?", user.ID).
		Scan(&roles).Error
	if err != nil {
		return nil, err
	}
	user.Roles = roles
	return &user, nil
}
