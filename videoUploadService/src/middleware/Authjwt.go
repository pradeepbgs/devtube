package middleware

import (
	"videouploadservice/src/utils"

	"github.com/gofiber/fiber/v3"
)


func AuthJwt(c fiber.Ctx) error {
	token := c.Cookies("accessToken")
	if token == "" {
		token = c.Get("Authorization")
	}
	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status":false,
			"error": "No access token found, unauthorized request",
		})
	}

	claims , err := utils.ParseToken(token)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status":false,
			"error": "Invalid or expired token",
		})
	}
	c.Locals("user", claims)
	return c.Next()
}