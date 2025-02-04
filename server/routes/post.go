package routes

import (
	"github.com/MoCrespo/BlogApp/server/controllers"
	"github.com/MoCrespo/BlogApp/server/middleware"
	"github.com/gofiber/fiber/v2"

	"gorm.io/gorm"
)

func PostRoutes(app *fiber.App, db *gorm.DB) {
	postController := controllers.NewPostController(db)

	post := app.Group("/posts", middleware.AuthRequired)
	{
		post.Post("/", postController.CreatePost)
		post.Get("/", postController.GetPosts)
		post.Get("/:id", postController.GetPost)
		post.Delete("/:id", postController.DeletePost)
	}
}
