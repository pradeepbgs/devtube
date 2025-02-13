package routes

import (
	"videouploadservice/src/controller"
	"videouploadservice/src/middleware"

	"github.com/gofiber/fiber/v3"
)


func SetupRoutes(app *fiber.App){
	api := app.Group("/api/v1")

	// user apis
	video := api.Group("/video")
	videoController := controller.VideoController()

	video.Post("/upload",videoController.UploadVideo)
	video.Put("/update", middleware.AuthJwt)
}