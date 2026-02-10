package helpers

import (
	"html/template"
	"os"

	"github.com/gin-gonic/gin"
)

// LoadTemplates loads all HTML templates into Gin engine
// It also registers custom template functions (like baseURL)
// so they can be used inside .html files.
func LoadTemplates(r *gin.Engine) {

	// Define custom functions available inside templates.
	// Example usage in HTML:
	// <link href="{{ baseURL }}/assets/css/style.css">
	funcMap := template.FuncMap{
		// baseURL returns the BASE_URL from environment variables
		// This helps avoid hardcoding URLs in templates
		"baseURL": func() string {
			return os.Getenv("BASE_URL")
		},
	}

	// Create a new empty template container.
	// Attach custom functions BEFORE parsing templates.
	// Then parse all HTML files inside one-level subfolders:
	// Example: views/layout/header.html
	//          views/pages/home.html
	tmpl := template.Must(
		template.New("").
			Funcs(funcMap).
			ParseGlob("app/resources/views/*/*.html"),
	)

	// Parse templates inside two-level subfolders.
	// Example: views/pages/users/list.html
	//          views/pages/users/edit.html
	// Go does NOT support recursive glob (**),
	// so we manually load deeper folder structures.
	tmpl = template.Must(
		tmpl.ParseGlob("app/resources/views/*/*/*.html"),
	)

	// Register the fully parsed template collection
	// with Gin so it can be used with:
	// c.HTML(http.StatusOK, "template_name.html", data)
	r.SetHTMLTemplate(tmpl)
}
