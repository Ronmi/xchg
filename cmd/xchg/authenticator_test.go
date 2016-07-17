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
	if this.currentToken == "" {
		return false
	}

	return this.currentToken == token
}

func FakeAuthenticator(pass string) Authenticator {
	return &dumbAuth{password: pass}
}
