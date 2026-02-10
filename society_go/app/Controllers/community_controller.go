package controllers

import (
	helpers "go_society_node/society_go/app/Helpers"
	models "go_society_node/society_go/app/Models"
	"go_society_node/society_go/app/Repositories"
	"go_society_node/society_go/app/dto"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func ShowCommunityAddDetailPage(c *gin.Context) {

	userSession := helpers.GetSessionData(c)
	menu := helpers.BuildSidebarMenu(userSession.CurrentRoleID)
	communities, err := Repositories.GetAllCommunities()
	if err != nil {
		log.Println("Error fetching communities:", err)
		c.String(500, "Internal Server Error")
		return
	}
	id := c.Param("id")

	// EDIT MODE
	if id != "" {
		community, err := Repositories.GetCommunityByID(id)
		if err != nil {
			c.String(404, "Community not found")
			return
		}

		c.HTML(200, "layout", gin.H{
			"title":        "Edit Community Details",
			"Page":         "pages/community_add",
			"form_action":  "/community/update/" + id,
			"community":    community,
			"session_data": userSession,
			"Communities":  communities,
			"Menu":         menu,
		})
		return
	}

	// ADD MODE
	c.HTML(200, "layout", gin.H{
		"title":        "Add Community Details",
		"Page":         "pages/community_add",
		"form_action":  "/community/create",
		"session_data": userSession,
		"Communities":  communities,
		"Menu":         menu,
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
		PinCode:     req.Pincode,
		TotalBlocks: req.TotalBlocks,
		TotalFlats:  req.TotalFlats,
		Status:      req.Status, // Assuming '1' means active",
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
	menu := helpers.BuildSidebarMenu(userSession.CurrentRoleID)

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
		"Menu":         menu,
	})
}

func UpdateCommunity(c *gin.Context) {

	id := c.Param("id")

	var req dto.CommunityDetailsRequest

	if err := c.ShouldBind(&req); err != nil {
		c.String(400, "Validation Error: %s", err.Error())
		return
	}

	community := models.Society{
		Name:        req.CommunityName,
		Address:     req.Address,
		City:        req.City,
		State:       req.State,
		PinCode:     req.Pincode,
		TotalBlocks: req.TotalBlocks,
		TotalFlats:  req.TotalFlats,
		Status:      req.Status,
	}

	// log.Printf("Updating community with ID %s: %+v\n", id, community)

	err := Repositories.UpdateCommunity(id, &community)
	if err != nil {
		log.Println("Error updating community:", err)
		c.String(500, "Internal Server Error")
		return
	}

	c.Redirect(http.StatusFound, "/community/view")
}

func SwitchCommunity(c *gin.Context) {
	id := c.Param("id")
	community, err := Repositories.GetCommunityByID(id)
	if err != nil {
		log.Printf("Error fetching community with ID %s: %v\n", id, err)
		c.String(404, "Community not found")
		return
	}

	// Update user's default community in the database
	err = Repositories.UpdateUserDefaultCommunity(uint(helpers.GetSessionData(c).UserID), community.ID)
	if err != nil {
		log.Printf("Error updating user's default community: %v\n", err)
		c.String(500, "Internal Server Error")
		return
	}

	// Update session data with new default community
	session := sessions.Default(c)
	session.Set("user_default_community", community.Name)
	session.Set("user_default_community_id", community.ID)
	err = session.Save()
	if err != nil {
		log.Printf("Error saving session: %v\n", err)
		c.String(500, "Internal Server Error")
		return
	}

	// Redirect back to the dashboard or community listing page
	c.Redirect(http.StatusFound, "/dashboard")
}

func ShowBlockUnitAddPage(c *gin.Context) {

	userSession := helpers.GetSessionData(c)
	menu := helpers.BuildSidebarMenu(userSession.CurrentRoleID)

	communities, err := Repositories.GetAllCommunities()
	if err != nil {
		log.Println("Error fetching communities:", err)
		c.String(500, "Internal Server Error")
		return
	}

	c.HTML(200, "layout", gin.H{
		"title":        "Add Block & Unit",
		"Page":         "pages/community/block_unit_add",
		"form_action":  "/community/create_block_unit",
		"session_data": userSession,
		"Communities":  communities,
		"Menu":         menu,
	})
}

func CreateBlockUnit(c *gin.Context) {
	var blockReq dto.BlockRequest
	var unitReq dto.UnitRequest

	// Bind Block Request
	if err := c.ShouldBind(&blockReq); err != nil {
		c.String(400, "Validation Error: %s", err.Error())
		return
	}

	// Bind Unit Request
	if err := c.ShouldBind(&unitReq); err != nil {
		c.String(400, "Validation Error: %s", err.Error())
		return
	}

	// Call Repository
	err := Repositories.CreateBlockWithUnits(blockReq, unitReq)
	if err != nil {
		c.String(500, "Internal Server Error")
		return
	}

	c.Redirect(http.StatusFound, "/community/view")
	// c.String(200, "Block/Unit added successfully")
}
