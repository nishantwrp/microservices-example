package db

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string
	Username string `gorm:"unique"`
	Password string
	Token    string `gorm:"unique"`
}
