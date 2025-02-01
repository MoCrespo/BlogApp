package routes

import (
	"github.com/MoCrespo/BlogApp/server/controllers"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func AuthRoutes(app *fiber.App, db *gorm.DB) {
	authController := controllers.NewAuthController(db)

	auth := app.Group("/auth")
	{
		auth.Post("/register", authController.Register)

	}
}
