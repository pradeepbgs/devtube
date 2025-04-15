package rabbitmq

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"
	"videouploadservice/src/db"
	"videouploadservice/src/utils"

	"github.com/rabbitmq/amqp091-go"
	"go.mongodb.org/mongo-driver/mongo"
)

func StartConsumingTask() {
	conn, err := amqp091.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatal("Failed to connect to RabbitMQ:", err)
	}
	fmt.Println("Connected to rabbitmq",conn)
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal("Failed to open a channel:", err)
	}
	defer ch.Close()

	queue, err := ch.QueueDeclare("video_upload", false, false, false, false, nil)
	if err != nil {
		log.Fatal("Failed to declare queue:", err)
	}

	msgs, err := ch.Consume(queue.Name, "", true, false, false, false, nil)
	if err != nil {
		log.Fatal("Failed to register a consumer:", err)
	}

	videoModel := db.DB.Collection("videos")

	for msg := range msgs {
		go processUploadVideo(videoModel, msg)
	}

}

func processUploadVideo(videoModel *mongo.Collection, msg amqp091.Delivery) {

	if utils.GetCloudinaryInstance() == nil{
		log.Println("Cloudinary is not initialized")
		return
	}

	var task db.VideoUploadTask
	err := json.Unmarshal(msg.Body, &task)
	if err != nil {
		log.Println("Failed to unmarshal JSON:", err)
		return
	}

	videoURL, err := utils.UploadVideoToCloudinary(task.VideoPath)
	if err != nil {
		log.Println("Video upload error:", err)
		return
	}

	thumbnailURL, err := utils.UploadThumbnail(task.ThumbnailPath)
	if err != nil {
		log.Println("Thumbnail upload error:", err)
		return
	}
	video := db.Video{
		Title:       task.Title,
		Description: task.Description,
		Url:         videoURL,
		Thumbnail:   thumbnailURL,
		Owner:       task.User,
		Views: 0,
		IsPublished: true,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
		Duration: 0,
	}
	_, err = videoModel.InsertOne(context.TODO(), video)
	if err != nil {
		log.Println("Failed to insert video into DB:", err)
		return
	}

	// need to delete local video and thumbnail file
	err = utils.DeleteLocalFile(task.VideoPath)
	if err != nil {
		log.Println("Failed to delete local video file:", err)
		return
	}

	err = utils.DeleteLocalFile(task.ThumbnailPath)

	if err != nil {
		log.Println("Failed to delete local thumbnail file:", err)
		return
	}

}
