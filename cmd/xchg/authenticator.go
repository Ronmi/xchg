package main

import (
	"math/rand"
	"strconv"
	"sync"

	"github.com/dgryski/dgoogauth"
)

// Authenticator 包裝了 google OTP 和 token 的管理
type Authenticator interface {
	Token(pin string) (string, error)
	Valid(token string) bool
	URI(user string) string // 取得認證用 uri
}

// ErrPincode 代表 pin 碼檢查失敗
type ErrPincode struct {
	Pin string
}

func (e ErrPincode) Error() string {
	return "pin code " + e.Pin + " incorrect"
}

type authenticator struct {
	current string // current token
	otp     *dgoogauth.OTPConfig
	lock    *sync.Mutex
}

func (a *authenticator) Token(pin string) (string, error) {
	// 避免 data racing 所以上個鎖
	a.lock.Lock()
	defer a.lock.Unlock()

	if ok, err := a.otp.Authenticate(pin); err != nil || !ok {
		return "", ErrPincode{pin}
	}

	// 產生隨機的 token
	// 最完美的方法：用亂數然後轉字串(不對
	token := a.current
	for token == a.current {
		token = strconv.Itoa(rand.Int())
	}

	a.current = token

	return token, nil
}

func (a *authenticator) Valid(token string) bool {
	return token == a.current
}

func (a *authenticator) URI(user string) string {
	return a.otp.ProvisionURIWithIssuer(user, "xchg")
}

// NewAuthenticator 建立一個 10 秒間隔的 totp Authenticator
//
// secret 是 80bit 經過 base32 編碼後的字串
func NewAuthenticator(secret string) Authenticator {
	return &authenticator{
		"",
		&dgoogauth.OTPConfig{
			Secret:     secret,
			WindowSize: 10,
		},
		&sync.Mutex{},
	}
}
