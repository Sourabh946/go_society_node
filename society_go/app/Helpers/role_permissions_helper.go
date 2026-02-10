package helpers

func HasRole(currentRoleID int, allowedRoles ...int) bool {
	for _, role := range allowedRoles {
		if currentRoleID == role {
			return true
		}
	}
	return false
}
