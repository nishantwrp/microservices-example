package util

import (
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	godotenv.Load(".env")
}

func GetEnv(key string) string {
	return os.Getenv(key)
}
