package controllers

import (
	helpers "go_society_node/society_go/app/Helpers"
	models "go_society_node/society_go/app/Models"
	"go_society_node/society_go/app/Repositories"
	"go_society_node/society_go/app/dto"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ShowCommunityAddDetailPage(c *gin.Context) {

	userSession := helpers.GetSessionData(c)
	c.HTML(200, "layout", gin.H{
		"title":        "Add Community Details",
		"Page":         "pages/community_add",
		"session_data": userSession,
	})
}

func CreateCommunity(c *gin.Context) {
	// Handle form submission for adding community details
	var req dto.CommunityDetailsRequest

	// Bind FORM data (not JSON)
	if err := c.ShouldBind(&req); err != nil {
		c.String(400, "Validation Error: %s", err.Error())
		return
	}

	community := models.Society{
		Name:        req.CommunityName,
		Address:     req.Address,
		City:        req.City,
		State:       req.State,
		PinCode:     req.PinCode,
		TotalBlocks: req.TotalBlocks,
		TotalFlats:  req.TotalFlats,
		Status:      1, // Assuming '1' means active",
	}

	err := Repositories.CreateCommunity(&community)
	if err != nil {
		log.Println("Error saving community details:", err)
		c.String(500, "Internal Server Error")
		return
	}

	c.Redirect(http.StatusFound, "/community/view")
	// c.String(200, "community details added successfully")

}

func ShowCommunityListing(c *gin.Context) {
	userSession := helpers.GetSessionData(c)

	communities, err := Repositories.GetAllCommunities()
	if err != nil {
		log.Println("Error fetching communities:", err)
		c.String(500, "Internal Server Error")
		return
	}

	c.HTML(200, "layout", gin.H{
		"title":        "Community Listing",
		"Page":         "pages/community_listing",
		"session_data": userSession,
		"communities":  communities,
	})
}
