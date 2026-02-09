package dto

type CommunityDetailsRequest struct {
	CommunityName string `form:"name" json:"name" binding:"required"`
	Address       string `form:"address" json:"address" binding:"required"`
	City          string `form:"city" json:"city" binding:"required"`
	State         string `form:"state" json:"state" binding:"required"`
	PinCode       int    `form:"pincode" json:"pincode" binding:"required"`
	TotalBlocks   int    `form:"total_blocks" json:"total_blocks" binding:"required"`
	TotalFlats    int    `form:"total_flats" json:"total_flats" binding:"required"`
	Status        string `form:"status" json:"status" binding:"required"`
}
