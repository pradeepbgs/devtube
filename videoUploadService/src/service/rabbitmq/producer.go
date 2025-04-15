package rabbitmq

import (
	"encoding/json"
	"log"
	"videouploadservice/src/db"

	"github.com/rabbitmq/amqp091-go"
)


func PublishTask(task db.VideoUploadTask) error {
	// in docker like this - amqp://guest:guest@rabbitmq:5672/
	conn, err := amqp091.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		return err
	}

	ch, err := conn.Channel()
	if err != nil{
		return err
	}

	queue, err := ch.QueueDeclare(
		"video_upload", false, false, false, false, nil,
	)
	if err != nil {
		return err
	}

	body , err := json.Marshal(task)
	if err != nil{
		return err
	}

	err = ch.Publish("",queue.Name,false,false,amqp091.Publishing{
		ContentType: "application/json",
		Body: body,
	})
	if err != nil{
		return err
	}

	log.Println("Task published:", task.VideoPath)
	return nil
}