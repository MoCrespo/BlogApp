package models

import (
	"time"
)

type Post struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	Title     string    `gorm:"size:255;not null" json:"title"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"-"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
