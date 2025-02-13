package service

import (
	"os"
	"path/filepath"
	"videouploadservice/src/db"
	"videouploadservice/src/service/rabbitmq"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/google/uuid"
)

type VideoServiceStruct struct{}

func VideoService() *VideoServiceStruct {
	return &VideoServiceStruct{}
}

func (v *VideoServiceStruct) UploadVideo(c fiber.Ctx) error {
	// upload video

	user := c.Locals("user")
	if user == nil {
		return c.Status(401).JSON(fiber.Map{"error": "User not found"})
	}

	title := c.FormValue("title")
	description := c.FormValue("description")

	if title == "" || description == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Title and description are required"})
	}

	videoUUID := uuid.New().String()
	thumbnailUUID := uuid.New().String()

	videoFile, err := c.FormFile("video")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Video file is required"})
	}

	thumbnail, err := c.FormFile("thumbnail")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Thumbnail is required"})
	}

	uploadDir := "public/uploads"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create upload directory"})
	}

	videoPath := filepath.Join(uploadDir, videoUUID+filepath.Ext(videoFile.Filename))
	thumbnailPath := filepath.Join(uploadDir, thumbnailUUID+filepath.Ext(thumbnail.Filename))
	
	if err := c.SaveFile(videoFile, videoPath); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save video file"})
	}

	if err := c.SaveFile(thumbnail, thumbnailPath); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save thumbnail"})
	}

	claims, ok := user.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status": false,
			"error":  "Invalid token claims",
		})
	}

	userID, ok := claims["_id"].(string)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid or missing user ID in token"})
	}

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid ObjectID format"})
	}

	task := db.VideoUploadTask{
		User:          objectID,
		VideoPath:     videoPath,
		ThumbnailPath: thumbnailPath,
		Title:         title,
		Description:   description,
	}

	if err := rabbitmq.PublishTask(task); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error":   "Failed to send task to queue",
			"message": "Its our server problem , not yours",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Video Uploaded successfully , Processing asynchronously...",
	})
}
