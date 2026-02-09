package Repositories

import (
	models "go_society_node/society_go/app/Models"
	"go_society_node/society_go/config"
)

func CreateCommunity(community *models.Society) error {
	return config.DB.Create(community).Error
}

func GetAllCommunities() ([]models.Society, error) {
	var communities []models.Society
	err := config.DB.
		Order("id DESC").
		Find(&communities).Error
	return communities, err
}
