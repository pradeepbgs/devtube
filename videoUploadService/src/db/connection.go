package db

import (
	"context"
	"fmt"
	"log"
	"videouploadservice/src/config"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func ConnectMongoDB(conf *config.Config) {
	clientOptions := options.Client().ApplyURI(conf.MONGODB_URL)

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal("MongoDB connection error:", err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal("Could not ping MongoDB: %w", err)
	}

	DB = client.Database(conf.DatabaseName)
	fmt.Println("✅ Connected to MongoDB")
}
