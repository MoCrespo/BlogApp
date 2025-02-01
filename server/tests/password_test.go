package tests

import (
	"testing"

	"github.com/MoCrespo/BlogApp/server/utils"
)

func TestHashPassword(t *testing.T) {
	password := "securepassword123"
	hashedPassword, err := utils.HashPassword(password)

	if err != nil {
		t.Fatalf("HashPasswrod failed: %v", err)
	}

	if len(hashedPassword) == 0 {
		t.Error("Hashed password is empty")
	}
}

func TestCheckPassword(t *testing.T) {
	password := "securepassword123"
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		t.Fatalf("HashPassword failed: %v", err)
	}

	err = utils.CheckPassword(hashedPassword, password)
	if err != nil {
		t.Errorf("CheckPassword failed: %v", err)
	}

	wrongPassword := "wrongpassword"
	err = utils.CheckPassword(hashedPassword, wrongPassword)
	if err == nil {
		t.Error("CheckPassword should fail with wrong password")
	}
}
