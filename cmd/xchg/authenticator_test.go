package main

type dumbAuth struct {
	password     string
	currentToken string
}

func (a *dumbAuth) Token(pin string) (string, error) {
	if a.password != pin {
		return "", ErrPincode{pin}
	}

	a.currentToken = pin + "HAHAUCCU"
	return a.currentToken, nil
}

func (a *dumbAuth) Valid(token string) bool {
	if a.currentToken == "" {
		return false
	}

	return a.currentToken == token
}

func (a *dumbAuth) URI(user string) string {
	return user
}

func FakeAuthenticator(pass string) Authenticator {
	return &dumbAuth{password: pass}
}
