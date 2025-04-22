package config

import (
	"os"
	"github.com/joho/godotenv"
)


type Config struct {
	Port string
	MONGODB_URL string
	DatabaseName string
}

func LoadConfig() *Config {
	_ = godotenv.Load()
	
	return &Config{
		Port: os.Getenv("PORT"),
		MONGODB_URL: os.Getenv("MONGODB_URL"),
		DatabaseName: os.Getenv("DATABASE_NAME"),
	}
}