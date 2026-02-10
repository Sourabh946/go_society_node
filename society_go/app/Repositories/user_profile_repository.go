package Repositories

import (
	models "go_society_node/society_go/app/Models"
	"go_society_node/society_go/config"
)

func GetUserProfileByUserID(id string) (models.UserProfile, error) {
	var profile models.UserProfile
	err := config.DB.Where("user_id = ?", id).First(&profile).Error
	return profile, err
}

func CreateUserProfile(profile *models.UserProfile) error {
	return config.DB.Create(profile).Error
}

func UpdateUserProfile(id string, profile *models.UserProfile) error {
	return config.DB.Model(&models.UserProfile{}).
		Where("user_id = ?", id).
		Select("SocietyID", "BlockID", "FlatID", "FirstName", "LastName", "Phone", "ProfilePhoto", "Gender", "DateOfBirth").
		Updates(profile).Error
}

func GetUserDefaultCommunity(userID uint) (models.Society, error) {
	var community models.Society
	err := config.DB.Table("society").
		Joins("JOIN users on users.default_community_id = society.id").
		Where("users.id = ?", userID).
		Select("society.id, society.name").
		First(&community).Error
	return community, err
}
