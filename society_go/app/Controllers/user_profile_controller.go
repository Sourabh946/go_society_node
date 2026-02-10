package controllers

import (
	helpers "go_society_node/society_go/app/Helpers"
	"go_society_node/society_go/app/Repositories"
	"log"

	"github.com/gin-gonic/gin"
)

func ShowUserAddPage(c *gin.Context) {
	userSession := helpers.GetSessionData(c)
	menu := helpers.BuildSidebarMenu(userSession.CurrentRoleID)
	society, err := Repositories.GetAllCommunities()
	if err != nil {
		log.Println("Error fetching communities:", err)
		c.String(500, "Internal Server Error")
		return
	}

	c.HTML(200, "layout", gin.H{
		"title":        "Add User Profile",
		"Page":         "pages/users/user_profile_add",
		"form_action":  "/user/create",
		"session_data": userSession,
		"Societies":    society,
		"Menu":         menu,
	})
}
