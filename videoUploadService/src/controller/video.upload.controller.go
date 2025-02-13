package controller

import (
	"videouploadservice/src/service"

	"github.com/gofiber/fiber/v3"
)

type VideoControllerStruct struct{
	videoService *service.VideoServiceStruct
}

func VideoController () *VideoControllerStruct {
	return &VideoControllerStruct{
		videoService:service.VideoService(),
	}
}

func (vc *VideoControllerStruct) UploadVideo (c fiber.Ctx) error {
	return vc.videoService.UploadVideo(c)
}

func (u *VideoControllerStruct) UpdateVideoDetails (c fiber.Ctx) error {
	return nil
}