package main

import (
	"log"
	"os"
	"text/template"

	helpers "go_society_node/society_go/app/Helpers"
	middleware "go_society_node/society_go/app/Middleware"
	"go_society_node/society_go/config" // Add this
	"go_society_node/society_go/routes"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	// Load .env (optional - database.go will load .env.local)
	err := godotenv.Load()
	if err != nil {
		log.Printf("[DEBUG] main.go: .env file not found (optional): %v\n", err)
	} else {
		log.Println("[DEBUG] main.go: .env file loaded successfully")
	}

	// Connect to database
	config.ConnectDatabase()

	// Setup Gin router
	r := gin.Default()

	// Setting Base_URL for templates
	r.SetFuncMap(template.FuncMap{
		"baseURL": func() string {
			return os.Getenv("BASE_URL")
		},
	})

	// Load HTML templates
	// r.LoadHTMLGlob("app/resources/views/**/*.html")
	helpers.LoadTemplates(r)

	// Serve static assets (CSS/JS/images) referenced by templates
	r.Static("/css", "./app/resources/css")
	r.Static("/js", "./app/resources/js")
	r.Static("/images", "./app/resources/images")

	wd, _ := os.Getwd()
	log.Println("Working Directory:", wd)

	// Setup session middleware
	store := cookie.NewStore([]byte("ABCDERFG"))
	r.Use(sessions.Sessions("user_session", store))

	r.Use(middleware.ResponseFormatter())
	// Setup routes
	routes.SetupWebRoutes(r)
	// routes.SetupapiRoutes(r)

	// Run server
	port := os.Getenv("APP_PORT")
	log.Printf("[DEBUG] main.go: Starting server on port %s\n", port)
	r.Run(":" + port)

}
