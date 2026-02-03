package repositories

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
