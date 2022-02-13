package db

import (
	"fmt"
	"microservices/auth-service/util"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDb() (*gorm.DB, error) {
	dbHost := util.GetEnv("DB_HOST")
	dbPort := util.GetEnv("DB_PORT")
	dbName := util.GetEnv("DB_NAME")
	dbUsername := util.GetEnv("DB_USERNAME")
	dbPassword := util.GetEnv("DB_PASSWORD")

	dsn := fmt.Sprintf("host=%v user=%v password=%v dbname=%v port=%v sslmode=disable", dbHost, dbUsername, dbPassword, dbName, dbPort)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	db.AutoMigrate(&User{})
	return db, err
}
