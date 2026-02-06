package Services

import (
	"errors"
	models "go_society_node/society_go/app/Models"
	repositories "go_society_node/society_go/app/Repositories"
	"os"

	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func Register(name, email, password string) error {
	// Registration logic here
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), 14)
	user := &models.User{
		Name:     name,
		Email:    email,
		Password: string(hashedPassword),
	}
	return repositories.CreateUser(user)
}

func Login(email, password string) (*models.User, string, error) {
	user, err := repositories.GetUserByEmail(email)
	if err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return nil, "", err
	}
	return user, tokenString, nil
}
