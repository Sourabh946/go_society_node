package helpers

import (
	"encoding/json"
	"log"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type UserSessionData struct {
	UserID        interface{}
	UserName      interface{}
	UserEmail     interface{}
	UserRoleID    interface{}
	Roles         interface{}
	CurrentRoleID interface{}
	LoggedIn      bool
	LoginTime     interface{}
}

// Unmarshal user_roles into a typed slice
type Role struct {
	RoleID   int    `json:"role_id"`
	RoleName string `json:"role_name"`
}

func GetSessionData(c *gin.Context) *UserSessionData {

	session := sessions.Default(c)

	// Retrieve roles from session and unmarshal
	// Unmarshal user_roles into a typed slice
	var roles []Role
	rolesRaw := session.Get("user_roles")
	if rolesRaw != nil {
		switch v := rolesRaw.(type) {
		case string:
			if v != "" {
				_ = json.Unmarshal([]byte(v), &roles)
			}
		case []byte:
			_ = json.Unmarshal(v, &roles)
		}
	}

	log.Printf("[DEBUG] Dashboard roles: %+v", roles)

	return &UserSessionData{
		UserID:        session.Get("user_id"),
		UserName:      session.Get("user_name"),
		UserEmail:     session.Get("user_email"),
		UserRoleID:    session.Get("user_role_id"),
		CurrentRoleID: session.Get("current_role_id"),
		Roles:         roles,
		LoggedIn:      session.Get("logged_in") == true,
		LoginTime:     session.Get("login_time"),
	}
}
