package routes

import (
	controllers "go_society_node/society_go/app/Controllers"

	"github.com/gin-gonic/gin"
)

func SetupWebRoutes(r *gin.Engine) {
	auth := r.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
	}
}
