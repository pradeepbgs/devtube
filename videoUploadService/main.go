package main

import (
	"log"
	"time"
	"videouploadservice/src/config"
	"videouploadservice/src/db"
	"videouploadservice/src/middleware"
	"videouploadservice/src/routes"
	"videouploadservice/src/service/rabbitmq"
	"videouploadservice/src/utils"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/limiter"
	"github.com/gofiber/fiber/v3/middleware/logger"
)

func main() {
	app := fiber.New(fiber.Config{
		BodyLimit: 100 * 1024 * 1024,
	})

	conf := config.LoadConfig()

	db.ConnectMongoDB(conf)

	utils.InitClodinary()
	go rabbitmq.StartConsumingTask()

	// Some Middlewares
	// logger
	app.Use(logger.New())

	// cors
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8080"},
		AllowCredentials: true,
		AllowMethods:     []string{"GET, POST, PUT, DELETE, OPTIONS"},
	}))

	// rate-limiter
	app.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 1 * time.Hour,
		LimitReached: func(c fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).SendString("Too many requests")
		},
	}))

	// protect these apis
	app.Use("/api/v1/video", middleware.AuthJwt)

	// Simplpe entry point
	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Welcome to video upload service")
	})

	app.Get("/health", func(c fiber.Ctx) error {
		return c.SendString("lady boy i'm good and healthy")
	})

	routes.SetupRoutes(app)

	log.Println("🚀 Server is running on port", conf.Port)
	app.Listen(":" + conf.Port)
}
