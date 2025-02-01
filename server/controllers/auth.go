package controllers

import (
	"github.com/MoCrespo/BlogApp/server/dto"
	"github.com/MoCrespo/BlogApp/server/models"
	"github.com/MoCrespo/BlogApp/server/utils"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type AuthController struct {
	DB *gorm.DB
}

func NewAuthController(db *gorm.DB) *AuthController {
	return &AuthController{DB: db}
}

func (ac *AuthController) Register(c *fiber.Ctx) error {
	var req dto.UserCreateRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{Error: err.Error()})
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{Error: "Password hashing failed"})
	}

	user := models.User{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: hashedPassword,
	}

	if err := ac.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusConflict).JSON(dto.ErrorResponse{Error: "User already exists"})
	}

	return c.Status(fiber.StatusCreated).JSON(dto.UserResponse{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
	})
}
