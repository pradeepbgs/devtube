package rabbitmq

import (
	"encoding/json"
	"log"
	"videouploadservice/src/db"

	"github.com/rabbitmq/amqp091-go"
)

var ch *amqp091.Channel
var conn *amqp091.Connection

func Connect() error {
	// in productio use amqp://guest:guest@rabbitmq:5672/
	conn, err := amqp091.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		return err
	}

	ch, err = conn.Channel()
	if err != nil{
		return err
	}
	
	_,err = ch.QueueDeclare(
		"video_upload",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil{
		return err
	}

	_,err = ch.QueueDeclare(
		"filter-service",
		false,
		false,
		false,
		false,
		nil,
	)
	return err
}


// func declareQueue() error {

// }

func sendToQueue(queueName string, data interface{}) error {
	body , err := json.Marshal(data)
	if err != nil{
		return err
	}

	err = ch.Publish(
		"",
		queueName,
		false,
		false,
		amqp091.Publishing{
		ContentType: "application/json",
		Body: body,
	})
	if err != nil{
		return err
	}

	log.Println("Task published:", queueName)
	return nil
}

func UploadVideoTaskProducer (task db.VideoUploadTask) error {
	return sendToQueue("video_upload", task)
}

func FilterVideoTaskProducer (task db.Video) error {
	return sendToQueue("filter-service", task)
}