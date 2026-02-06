package routes

import (
	controllers "go_society_node/society_go/app/Controllers"
	middleware "go_society_node/society_go/app/Middleware"

	"github.com/gin-gonic/gin"
)

func SetupWebRoutes(r *gin.Engine) {
	auth := r.Group("/auth")
	{
		auth.GET("/login", controllers.ShowLoginPage)
		// r.GET("/register", controllers.ShowRegisterPage)

		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
		auth.GET("/logout", controllers.Logout)
	}

	// Dashboard (after login)
	r.GET("/dashboard", middleware.AuthRequired(), controllers.ShowDashboard)

	comm := r.Group("/community")
	{
		comm.GET("/add_details", middleware.AuthRequired(), controllers.ShowCommunityAddDetailPage)
	}

}
