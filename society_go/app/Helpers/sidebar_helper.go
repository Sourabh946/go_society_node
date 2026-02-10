package helpers

type MenuItem struct {
	Title    string
	Icon     string
	URL      string
	Children []MenuItem
}

func BuildSidebarMenu(userRoleID int) []MenuItem {
	menu := []MenuItem{}

	// Dashboard (common for all)
	menu = append(menu, MenuItem{
		Title: "Dashboard",
		Icon:  "bi-speedometer",
		URL:   "/dashboard",
	})

	// Super Admin + Admin
	if userRoleID == 1 || userRoleID == 2 {
		menu = append(menu, MenuItem{
			Title: "Users",
			Icon:  "bi-box-seam-fill",
			Children: []MenuItem{
				{Title: "All Users", URL: "/users"},
				{Title: "Add User", URL: "/user/add"},
			},
		})
	}

	// Only Super Admin
	if userRoleID == 1 {
		menu = append(menu, MenuItem{
			Title: "System Settings",
			Icon:  "bi-gear",
			URL:   "/settings",
		})
	}

	// Community Settings (All roles)
	menu = append(menu, MenuItem{
		Title: "Community Settings",
		Icon:  "bi-pencil-square",
		Children: []MenuItem{
			{Title: "Community Details", URL: "/community/add_details"},
			{Title: "Block & Unit", URL: "/community/add_block_unit"},
		},
	})

	return menu
}
