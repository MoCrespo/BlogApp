package main

import (
	"fmt"
	"log"

	"github.com/MoCrespo/BlogApp/server/config"
	"github.com/MoCrespo/BlogApp/server/database"
	"github.com/MoCrespo/BlogApp/server/models"
	"github.com/MoCrespo/BlogApp/server/routes"
	"github.com/gofiber/fiber/v2"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		panic("Failed to load config: " + err.Error())
	}

	err = database.InitDB(cfg)
	if err != nil {
		panic("Failed to initialize database: " + err.Error())
	}

	db := database.GetDB()
	err = db.AutoMigrate(&models.User{})
	if err != nil {
		panic("Migration failed: " + err.Error())
	}

	fmt.Println("Database connection and migration successful!")
	app := fiber.New()

	routes.AuthRoutes(app, db)
	routes.PostRoutes(app, db)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!🚀")
	})

	log.Println("Server is running on port 8080...")
	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
