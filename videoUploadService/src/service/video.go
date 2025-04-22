package service

import (
	"log"
	"os"
	"path/filepath"
	"videouploadservice/src/db"
	"videouploadservice/src/service/rabbitmq"
	"videouploadservice/src/utils"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
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
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
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

	if err := rabbitmq.UploadVideoTaskProducer(task); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error":   "Failed to send task to queue",
			"message": "Its our server problem , not yours",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Video Uploaded successfully , Processing asynchronously...",
	})
}

// // update video
func (v *VideoServiceStruct) UpdateVideoDetails(c fiber.Ctx) error {
	user := c.Locals("user")
	if user == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}

	claims, ok := user.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token claims"})
	}

	userIDStr, ok := claims["_id"].(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID missing in token"})
	}

	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid ObjectID format"})
	}

	videoIDStr := c.Params("id")
	if videoIDStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Video ID is required"})
	}

	videoID, err := primitive.ObjectIDFromHex(videoIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid video ID"})
	}

	title := c.FormValue("title")
	description := c.FormValue("description")
	// fmt.Println("let's see if we can get title", title)
	// fmt.Println("let's see if we can get description", description)
	updateVideoFields := bson.M{}

	if title != "" {
		updateVideoFields["title"] = title
	}
	if description != "" {
		updateVideoFields["description"] = description
	}

	thumbnail, _ := c.FormFile("thumbnail")

	if thumbnail != nil {
		uploadDir := "public/uploads"
		if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to create upload directory"})
		}
	
		thumbnailUUID := uuid.New().String()
		thumbnailPath := filepath.Join(uploadDir, thumbnailUUID+filepath.Ext(thumbnail.Filename))
	
		if err := c.SaveFile(thumbnail, thumbnailPath); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to save thumbnail"})
		}
		thumbnailURL, err := utils.UploadThumbnail(thumbnailPath)
		if err != nil {
			log.Println("Thumbnail upload error:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to upload thumbnail",
			})
			
		}
		updateVideoFields["thumbnail"] = thumbnailURL
	}
	if len(updateVideoFields) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No fields to update"})
	}

	video := db.DB.Collection("videos")
	filter := bson.M{
		"_id":  videoID,
		"owner": userID,
	}
	update := bson.M{
		"$set": updateVideoFields,
	}
	
	result , err := video.UpdateOne(c.Context(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update video details"})
	}
	if result.ModifiedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Video not found or you don't have permission to update it"})
	}
	
	return c.JSON(fiber.Map{
		"message": "Video details updated successfully",
	})
}


// Delete video

func (v *VideoServiceStruct) DeleteUserVideo(c fiber.Ctx) error {
	// Get user from context
	user := c.Locals("user")
	if user == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}

	// Extract user ID from token
	claims, ok := user.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token claims"})
	}

	userIDStr, ok := claims["_id"].(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User ID missing in token"})
	}

	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid ObjectID format"})
	}

	// Get video ID from request parameters
	videoIDStr := c.Params("id")
	if videoIDStr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Video ID is required"})
	}

	videoID, err := primitive.ObjectIDFromHex(videoIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid video ID"})
	}

	// Delete video from database
	video := db.DB.Collection("videos")
	filter := bson.M{
		"_id":  videoID,
		"owner": userID,
	}
	result, err := video.DeleteOne(c.Context(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete video"})
	}
	if result.DeletedCount == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Video not found or you don't have permission to delete it"})
	}

	return c.JSON(fiber.Map{
		"message": "Video deleted successfully",
	})
}