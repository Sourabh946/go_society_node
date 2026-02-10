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
		comm.POST("/create", middleware.AuthRequired(), controllers.CreateCommunity)

		comm.GET("/edit/:id", middleware.AuthRequired(), controllers.ShowCommunityAddDetailPage)
		comm.POST("/update/:id", middleware.AuthRequired(), controllers.UpdateCommunity)

		comm.GET("/view", middleware.AuthRequired(), controllers.ShowCommunityListing)

		comm.GET("/switch/:id", middleware.AuthRequired(), controllers.SwitchCommunity)

		comm.GET("/add_block_unit", middleware.AuthRequired(), controllers.ShowBlockUnitAddPage)
		comm.POST("/create_block_unit", middleware.AuthRequired(), controllers.CreateBlockUnit)
	}

	user := r.Group("/user")
	{
		user.GET("/add", middleware.AuthRequired(), controllers.ShowUserAddPage)
		// user.POST("/create", middleware.AuthRequired(), controllers.CreateUser)

		// user.GET("/edit/:id", middleware.AuthRequired(), controllers.ShowUserAddPage)
		// user.POST("/update/:id", middleware.AuthRequired(), controllers.UpdateUser)

		// user.GET("/view", middleware.AuthRequired(), controllers.ShowUserListing)

	}

}
