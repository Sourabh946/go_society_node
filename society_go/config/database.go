package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	log.Println("[DEBUG] config/database.go: ConnectDatabase() called")

	// Determine which environment to use
	// env := os.Getenv("APP_ENV")
	env := "local"
	if env == "" {
		env = "echo %APP_ENV%"
	}
	log.Printf("[DEBUG] config/database.go: Environment = %s\n", env)

	// Load corresponding .env file
	log.Printf("[DEBUG] config/database.go: Loading .env.%s file...\n", env)
	err := godotenv.Load(".env." + env)
	if err != nil {
		log.Printf("[DEBUG] config/database.go: .env.%s file not found (optional): %v\n", env, err)
	} else {
		log.Printf("[DEBUG] config/database.go: .env.%s loaded successfully\n", env)
	}

	log.Printf("[DEBUG] config/database.go: DB_HOST=%s, DB_PORT=%s, DB_NAME=%s\n",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"))

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASS"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)
	log.Println("[DEBUG] config/database.go: Connecting to database...")

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("[ERROR] config/database.go: Failed to connect to database:", err)
	}

	fmt.Printf("[%s] Database connected successfully!\n", env)
	log.Printf("[DEBUG] config/database.go: Database connection established for environment: %s\n", env)
	log.Println("✓ [SUCCESS] Database is connected and ready!")
	DB = db
}
