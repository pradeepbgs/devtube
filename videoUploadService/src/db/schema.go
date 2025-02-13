package db

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)


type Video struct{
	Url string `bson:"url" json:"url" validate:"required"`
	Thumbnail   string             `bson:"thumbnail" json:"thumbnail" validate:"required"`
	Title       string             `bson:"title" json:"title" validate:"required"`
	Description string             `bson:"description" json:"description,omitempty"`
	Duration    int                `bson:"duration" json:"duration,omitempty"`
	Views       int                `bson:"views" json:"views,omitempty"`
	IsPublished bool               `bson:"isPublished" json:"isPublished,omitempty"`
	Owner       primitive.ObjectID `bson:"owner,omitempty" json:"owner"`
	CreatedAt   time.Time          `bson:"createdAt,omitempty" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt,omitempty" json:"updatedAt"`
}


type VideoUploadTask struct {
	VideoPath    string `json:"videoFile"`
	ThumbnailPath string `json:"thumbnail"`
	Title        string `json:"title"`
	Description  string `json:"description"`
	User       primitive.ObjectID `json:"owner"`
}