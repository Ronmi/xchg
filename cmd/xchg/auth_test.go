package main

import (
	"net/http"
	"testing"

	"github.com/Patrolavia/jsonapi"
)

func TestAuthOK(t *testing.T) {
	fake := FakeAuthenticator("123456")
	h := &auth{fake}

	resp, err := jsonapi.HandlerTest(h.Handle).Post("/api/auth", "", `{"pin":"123456"}`)

	if err != nil {
		t.Fatalf("unexpected error occured when testing auth: %s", err)
	}

	if resp.Code != http.StatusOK {
		t.Fatalf("auth: sent correct pin but got http status %d", resp.Code)
	}

	if resp.Body == nil {
		t.Fatal("auth: got 200 OK, but no token")
	}
}

func TestAuthWrongPin(t *testing.T) {
	fake := FakeAuthenticator("123456")
	h := &auth{fake}

	cases := []struct {
		in  string
		msg string
	}{
		{`{"pin":"654321"}`, "auth: sent wrong pin, expect 400, got %d"},
		{`{}`, "auth: sent no pin, expect 400, got %d"},
		{`"123456"`, "auth: sent wrong format, expect 400, got %d"},
	}

	for _, c := range cases {
		resp, err := jsonapi.HandlerTest(h.Handle).Post("/api/auth", "", c.in)

		if err != nil {
			t.Fatalf("unexpected error occured when testing auth: %s", err)
		}

		if resp.Code != http.StatusBadRequest {
			t.Errorf(c.msg, resp.Code)
		}
	}
}
