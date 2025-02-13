package utils

import (
	"fmt"
	"os"
)


func DeleteLocalFile(filePath string) error {
	err := os.Remove(filePath)
	fmt.Println("Deleted file",filePath)
	if err != nil {
		return err
	}
	return nil
}