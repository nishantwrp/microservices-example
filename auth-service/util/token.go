package util

import (
	"github.com/xyproto/randomstring"
)

func GenerateToken() string {
	return randomstring.CookieFriendlyString(32)
}
