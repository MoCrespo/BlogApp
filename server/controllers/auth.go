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

	var existingUser models.User
	result := ac.DB.Where("email = ? OR username = ?", req.Email, req.Username).First(&existingUser)

	if result.Error == nil {
		return c.Status(fiber.StatusConflict).JSON(dto.ErrorResponse{
			Error: "User already exists",
		})
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

// controllers/auth.go
func (ac *AuthController) Login(c *fiber.Ctx) error {
	var req dto.UserLoginRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.ErrorResponse{
			Error: "Invalid request body",
		})
	}

	var user models.User
	if err := ac.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(dto.ErrorResponse{
			Error: "Invalid credentials",
		})
	}

	if err := utils.CheckPassword(user.PasswordHash, req.Password); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(dto.ErrorResponse{
			Error: "Invalid credentials",
		})
	}

	token, err := utils.GenerateToken(user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.ErrorResponse{
			Error: "Failed to generate token",
		})
	}

	return c.JSON(dto.TokenResponse{
		Token: token,
	})
}
