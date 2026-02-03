package controllers

import (
	"go_society_node/society_go/app/dto"
	services "go_society_node/society_go/app/services"

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
	if err := c.ShouldBindJSON(&req); err != nil {
		c.Set("response", gin.H{
			"status":  400,
			"error":   "Invalid request",
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	// Call service layer to authenticate
	token, err := services.Login(req.Email, req.Password)
	if err != nil {
		c.Set("response", gin.H{
			"status":  401,
			"error":   "Invalid credentials",
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	c.Set("response", gin.H{
		"status": 200,
		"token":  token,
	})
}
