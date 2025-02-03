package routes

import (
	"github.com/MoCrespo/BlogApp/server/controllers"
	"github.com/MoCrespo/BlogApp/server/middleware"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func AuthRoutes(app *fiber.App, db *gorm.DB) {
	authController := controllers.NewAuthController(db)
	profileController := controllers.NewProfileController(db)

	auth := app.Group("/auth")
	{
		auth.Post("/register", authController.Register)
		auth.Post("/login", authController.Login)

	}

	profile := app.Group("/profile", middleware.AuthRequired)
	{
		profile.Get("/", profileController.GetProfile)
		profile.Put("/", profileController.UpdateProfile)
	}
}
