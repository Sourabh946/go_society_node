package controllers

import (
	helpers "go_society_node/society_go/app/Helpers"

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
