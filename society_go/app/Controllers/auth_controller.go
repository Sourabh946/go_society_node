package controllers

import (
	"encoding/json"
	"fmt"
	"go_society_node/society_go/app/Repositories"
	services "go_society_node/society_go/app/Services"
	"go_society_node/society_go/app/dto"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// Register handles user registration HTTP request
func Register(c *gin.Context) {

	var req dto.Registraton_request
	if err := c.ShouldBindJSON(&req); err != nil {
		// Instead of c.JSON directly, set error in context for middleware
		c.Set("response", gin.H{
			"status":  400,
			"error":   "Invalid request",
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	// Call service layer
	err := services.Register(req.Name, req.Email, req.Password)
	if err != nil {
		c.Set("response", gin.H{
			"status":  500,
			"error":   "Registration failed",
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	// Set successful response in context
	c.Set("response", gin.H{
		"status":  200,
		"message": "Registration successful",
	})
}

// Login handles user login HTTP request
func Login(c *gin.Context) {

	var req dto.Login_request
	// Accept both JSON (API) and form submissions from the web login form
	if err := c.ShouldBind(&req); err != nil {
		c.Set("response", gin.H{
			"status":  400,
			"error":   "Invalid request",
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	// Call service layer to authenticate
	user, token, err := services.Login(req.Email, req.Password)
	if err != nil {
		// For web requests render login with flash
		resp := gin.H{
			"status":   401,
			"error":    "Invalid credentials",
			"message":  err.Error(),
			"template": "login.html",
		}
		c.Set("response", resp)
		c.Abort()
		return
	}

	log.Printf("Login successful for user: %s\n", user.Email)

	// If client expects JSON (API), return token
	if c.GetHeader("Accept") == "application/json" {
		c.Set("response", gin.H{"status": 200, "token": token})
		return
	}

	// For web clients: Set user data in session
	session := sessions.Default(c)
	session.Set("user_id", user.ID)
	session.Set("user_name", user.Name)
	session.Set("user_email", user.Email)
	session.Set("current_role_id", '1')

	// Try to fetch user role information from repository and store in session
	userWithRole, repoErr := Repositories.GetUserWithRole(user.Email)
	jsonData, _ := json.MarshalIndent(userWithRole, "", "  ")
	fmt.Println(string(jsonData))
	if repoErr != nil {
		log.Printf("GetUserWithRole error: %v\n", repoErr)
	} else {
		if len(userWithRole.Roles) > 0 {
			session.Set("user_role_id", userWithRole.Roles[0].RoleID)
		}
		// Store all roles as JSON in session
		rolesJson, _ := json.Marshal(userWithRole.Roles)
		session.Set("user_roles", string(rolesJson))
	}

	err = session.Save()
	if err != nil {
		log.Printf("Session save error: %v\n", err)
	}

	// Redirect to the dashboard route (which renders `dashboard.html`)
	c.Redirect(http.StatusFound, "/dashboard")
	return
}

// ShowLoginPage renders login view
func ShowLoginPage(c *gin.Context) {
	// Use the base filename as registered by LoadHTMLGlob
	c.HTML(http.StatusOK, "login.html", gin.H{
		"title": "Login",
	})
}

func Logout(c *gin.Context) {

	log.Println("Logging out user...")
	session := sessions.Default(c)

	// Clear all session data
	session.Clear()

	// Save session (very important)
	session.Save()

	// Redirect to login page
	c.Redirect(http.StatusFound, "/auth/login")
}
