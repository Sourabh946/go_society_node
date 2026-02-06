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
			return
		}

		// For web requests: if controller provided a `template` key, render it.
		if tpl, ok := resp.(gin.H)["template"].(string); ok && tpl != "" {
			c.HTML(resp.(gin.H)["status"].(int), tpl, resp)
			return
		}

		// If controller provided a `redirect` target, perform redirect.
		if target, ok := resp.(gin.H)["redirect"].(string); ok && target != "" {
			c.Redirect(resp.(gin.H)["status"].(int), target)
			return
		}

		// Fallback: attempt to render a sensible default template if provided
		if name, ok := resp.(gin.H)["template_name"].(string); ok && name != "" {
			c.HTML(resp.(gin.H)["status"].(int), name, resp)
			return
		}

		// Nothing to render: do nothing
	}
}
