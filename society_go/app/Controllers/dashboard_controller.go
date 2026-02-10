package controllers

import (
	helpers "go_society_node/society_go/app/Helpers"
	"go_society_node/society_go/app/Repositories"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ShowDashboard renders the dashboard page with users list
func ShowDashboard(c *gin.Context) {

	userSession := helpers.GetSessionData(c)
	menu := helpers.BuildSidebarMenu(userSession.CurrentRoleID)

	communities, err := Repositories.GetAllCommunities()
	if err != nil {
		log.Println("Error fetching communities:", err)
		c.String(500, "Internal Server Error")
		return
	}

	c.HTML(http.StatusOK, "layout", gin.H{
		"title":        "Dashboard",
		"Page":         "pages/dashboard",
		"session_data": userSession,
		"Communities":  communities,
		"Menu":         menu,
	})
}
