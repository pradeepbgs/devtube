package main

import (
	"log"
	"videouploadservice/src/config"
	"videouploadservice/src/db"
	"videouploadservice/src/middleware"
	"videouploadservice/src/routes"
	"videouploadservice/src/service/rabbitmq"
	"videouploadservice/src/utils"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

func main() {
	app := fiber.New(fiber.Config{
		BodyLimit: 100 * 1024 * 1024,
	})
	
	conf := config.LoadConfig()

	db.ConnectMongoDB(conf)
	
	utils.InitClodinary()
	 go rabbitmq.StartConsumingTask()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8080"},
		AllowCredentials: true,
		AllowMethods:     []string{"GET, POST, PUT, DELETE, OPTIONS"},
	}))

	app.Use("/api/v1/video/upload",middleware.AuthJwt)

	app.Get("/", func (c fiber.Ctx) error  {
		return c.SendString("Hello World from video upload service")
	})

	routes.SetupRoutes(app)

	log.Println("🚀 Server is running on port", conf.Port)
	app.Listen(":"+conf.Port)
}
