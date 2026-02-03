package middleware

import (
	"github.com/gin-gonic/gin"
)

func ResponseFormatter() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next() // run the controller

		// Get response from context
		resp, exists := c.Get("response")
		if !exists {
			// nothing set, ignore
			return
		}

		// Check if request wants JSON
		if c.GetHeader("Accept") == "application/json" {
			c.JSON(resp.(gin.H)["status"].(int), resp)
		} else {
			// For web, render HTML or template
			c.HTML(resp.(gin.H)["status"].(int), "template.html", resp)
		}
	}
}
