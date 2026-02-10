package helpers

import (
	"encoding/json"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type UserSessionData struct {
	UserID                    int
	UserName                  string
	UserEmail                 string
	UserRoleID                int
	Roles                     []Role
	CurrentRoleID             int
	LoggedIn                  bool
	LoginTime                 string
	User_default_community    string
	User_default_community_Id int
}

// Unmarshal user_roles into a typed slice
type Role struct {
	RoleID   int    `json:"role_id"`
	RoleName string `json:"role_name"`
}

type User struct {
	ID uint
}

func GetSessionData(c *gin.Context) *UserSessionData {
	session := sessions.Default(c)

	var userID int
	if v := session.Get("user_id"); v != nil {
		switch val := v.(type) {
		case int:
			userID = val
		case uint:
			userID = int(val)
		case int64:
			userID = int(val)
		case float64:
			userID = int(val)
		}
	}

	var currentRoleID int
	if v := session.Get("user_role_id"); v != nil {
		switch val := v.(type) {
		case int:
			currentRoleID = val
		case uint:
			currentRoleID = int(val)
		case int64:
			currentRoleID = int(val)
		case float64:
			currentRoleID = int(val)
		}
	}

	var User_default_community_Id int
	if v := session.Get("user_default_community_id"); v != nil {
		switch val := v.(type) {
		case int:
			User_default_community_Id = val
		case uint:
			User_default_community_Id = int(val)
		case int64:
			User_default_community_Id = int(val)
		case float64:
			User_default_community_Id = int(val)
		}
	}

	// Unmarshal roles
	var roles []Role
	rolesRaw := session.Get("user_roles")
	if rolesRaw != nil {
		switch v := rolesRaw.(type) {
		case string:
			_ = json.Unmarshal([]byte(v), &roles)
		case []byte:
			_ = json.Unmarshal(v, &roles)
		}
	}

	return &UserSessionData{
		UserID:                    userID,
		UserName:                  toString(session.Get("user_name")),
		UserEmail:                 toString(session.Get("user_email")),
		UserRoleID:                currentRoleID,
		CurrentRoleID:             currentRoleID,
		Roles:                     roles,
		LoggedIn:                  session.Get("logged_in") == true,
		LoginTime:                 toString(session.Get("login_time")),
		User_default_community:    toString(session.Get("user_default_community")),
		User_default_community_Id: User_default_community_Id,
	}
}

func toString(v interface{}) string {
	if v == nil {
		return ""
	}
	switch val := v.(type) {
	case string:
		return val
	case []byte:
		return string(val)
	default:
		return ""
	}
}
