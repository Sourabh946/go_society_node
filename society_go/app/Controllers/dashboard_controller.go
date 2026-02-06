package controllers

import (
	helpers "go_society_node/society_go/app/Helpers"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ShowDashboard renders the dashboard page with users list
func ShowDashboard(c *gin.Context) {

	userSession := helpers.GetSessionData(c)

	c.HTML(http.StatusOK, "layout", gin.H{
		"title":        "Dashboard",
		"Page":         "pages/dashboard",
		"session_data": userSession,
	})
}
