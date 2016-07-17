package main

// Authenticator 包裝了 google OTP 和 token 的管理
type Authenticator interface {
	Token(pin string) (string, error)
	Valid(token string) bool
}

// ErrPincode 代表 pin 碼檢查失敗
type ErrPincode struct {
	Pin string
}

func (e ErrPincode) Error() string {
	return "pin code " + e.Pin + " incorrect"
}
