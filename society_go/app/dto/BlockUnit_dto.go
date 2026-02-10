package dto

type BlockRequest struct {
	Id        uint   `form:"id" json:"id"`
	SocietyID uint   `form:"society_id" json:"society_id" binding:"required"`
	Blockname string `form:"block_name" json:"name" binding:"required"`
}

type UnitRequest struct {
	Id         uint   `form:"id" json:"id"`
	Flatnumber string `form:"unit_name" json:"flat_number" binding:"required"`
}
