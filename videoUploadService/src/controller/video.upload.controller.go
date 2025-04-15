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

func (vc *VideoControllerStruct) UpdateVideoDetails (c fiber.Ctx) error {
	return vc.videoService.UpdateVideoDetails(c)
}

func (vc *VideoControllerStruct) DeleteUserVideo (c fiber.Ctx) error {
	return vc.videoService.DeleteUserVideo(c)
}