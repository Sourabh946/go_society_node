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

func GetCommunityByID(id string) (models.Society, error) {
	var community models.Society
	err := config.DB.First(&community, id).Error
	return community, err
}

func UpdateCommunity(id string, community *models.Society) error {

	// log.Printf("Updatings communitys with ID %s: %+v\n", id, community)
	// NOTE:
	// We are using Select() while updating because GORM ignores zero values
	// (like 0, "", false) when using Updates(struct).
	// Since Status can be 0 (inactive), without Select() GORM will skip updating it.
	// By explicitly selecting fields, we ensure all listed fields (including zero values)
	// are included in the UPDATE query.
	return config.DB.Model(&models.Society{}).
		Where("id = ?", id).
		Select("Name", "Address", "City", "State", "PinCode", "TotalBlocks", "TotalFlats", "Status").
		Updates(community).Error

}

func CreateBlock(block *models.Block) (uint, error) {
	err := config.DB.Create(block).Error
	if err != nil {
		return 0, err
	}
	return block.ID, nil
}

func CreateFlat(flatUnit *models.Flat) error {
	return config.DB.Create(flatUnit).Error
}
