package config

import (
	"log"
	"os"
	"github.com/joho/godotenv"
)


type Config struct {
	Port string
	MONGODB_URL string
	DatabaseName string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	return &Config{
		Port: os.Getenv("PORT"),
		MONGODB_URL: os.Getenv("MONGODB_URL"),
		DatabaseName: os.Getenv("DATABASE_NAME"),
	}
}