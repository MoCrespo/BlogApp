package controllers

import (
	"github.com/MoCrespo/BlogApp/server/dto"
	"github.com/MoCrespo/BlogApp/server/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type PostController struct {
	DB *gorm.DB
}

func NewPostController(db *gorm.DB) *PostController {
	return &PostController{DB: db}
}

func (pc *PostController) CreatePost(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var req dto.PostCreateRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error: "Invalid request body",
		})
	}

	post := models.Post{
		Title:   req.Title,
		Content: req.Content,
		UserID:  userID,
	}

	if err := pc.DB.Create(&post).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error: "Failed to create post",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(dto.PostResponse{
		ID:        post.ID,
		Title:     post.Title,
		Content:   post.Content,
		UserID:    post.UserID,
		CreatedAt: post.CreatedAt,
		UpdatedAt: post.UpdatedAt,
	})
}

func (pc *PostController) GetPosts(c *fiber.Ctx) error {
	var posts []models.Post
	if err := pc.DB.Preload("User").Find(&posts).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error: "Failed to fetch posts",
		})
	}

	var response []dto.PostResponse
	for _, post := range posts {
		response = append(response, dto.PostResponse{
			ID:        post.ID,
			Title:     post.Title,
			Content:   post.Content,
			UserID:    post.UserID,
			CreatedAt: post.CreatedAt,
			UpdatedAt: post.UpdatedAt,
		})
	}

	return c.JSON(response)
}

func (pc *PostController) GetPost(c *fiber.Ctx) error {
	postID := c.Params("id")
	var post models.Post

	if err := pc.DB.Preload("User").First(&post, postID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(dto.ErrorResponse{
			Error: "Post not found",
		})
	}

	return c.JSON(dto.PostResponse{
		ID:        post.ID,
		Title:     post.Title,
		Content:   post.Content,
		UserID:    post.UserID,
		CreatedAt: post.CreatedAt,
		UpdatedAt: post.UpdatedAt,
	})
}

func (pc *PostController) DeletePost(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)
	postID := c.Params("id")

	var post models.Post
	if err := pc.DB.First(&post, postID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(dto.ErrorResponse{
			Error: "Post not found",
		})
	}

	if post.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(dto.ErrorResponse{
			Error: "You are not authorized to delete this post",
		})
	}

	if err := pc.DB.Delete(&post).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error: "Failed to delete post",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Post deleted successfully",
	})
}
