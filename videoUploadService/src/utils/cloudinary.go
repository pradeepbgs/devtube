package utils

import (
	"context"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

var cld *cloudinary.Cloudinary

func InitClodinary() {
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	cldConnection, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		panic(err)
	}

	cld=cldConnection
}

func UploadVideoToCloudinary(filepath string) (string, error) {
    uploadResult, err := cld.Upload.Upload(context.Background(), filepath, uploader.UploadParams{
        ResourceType: "video",
    })

    if err != nil {
        return "",err
    }

	

    return uploadResult.SecureURL,nil
}

func UploadThumbnail(filepath string) (string,error) {
	resp, err := cld.Upload.Upload(context.Background(),filepath, uploader.UploadParams{
		Folder: "image",
	})

	if err != nil {
		return "",err
	}
	
	return resp.SecureURL,nil
}

func GetCloudinaryInstance () *cloudinary.Cloudinary{
	return cld
}

// func GetVideoDuration(filepath string) (float64, error) {
// 	resp, err := cld.VideoURL(filepath, cloudinary.VideoURLParams{
// 		ResourceType: "video",
// 	})

// 	if err != nil {
// 		return 0,err
// 	}

// 	return resp.Duration,nil
// }