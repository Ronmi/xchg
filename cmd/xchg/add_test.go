package main

import (
	"net/http"
	"strings"
	"testing"

	"github.com/Patrolavia/jsonapi"
)

func TestAddOK(t *testing.T) {
	mgr, err := initDB([]Order{})
	if err != nil {
		t.Fatalf("Cannot initial database: %s", err)
	}
	defer mgr.Connection().Close()
	h := &add{mgr}

	resp, err := jsonapi.HandlerTest(h.Handle).Post("/api/add", "", `{"when":1468248043,"foreign":100,"local":-100,"code":"AUD"}`)

	if err != nil {
		t.Fatalf("unexpected error occured when testing add: %s", err)
	}

	if resp.Code != http.StatusOK {
		t.Fatalf("unexpected error occured when testing add with status code %d: %s", resp.Code, resp.Body.String())
	}

	if resp.Body == nil {
		t.Fatal(resp)
	}

	if str := strings.TrimSpace(resp.Body.String()); str != "null" {
		t.Errorf("add: returned non-null result: '%s'", str)
	}
}

func TestAddDuplicated(t *testing.T) {
	presetData := []Order{
		Order{1468248039, 100, -100, "USD"},
	}
	mgr, err := initDB(presetData)
	if err != nil {
		t.Fatalf("Cannot initial database: %s", err)
	}
	defer mgr.Connection().Close()
	h := &add{mgr}

	resp, err := jsonapi.HandlerTest(h.Handle).Post("/api/add", "", `{"when":1468248039,"foreign":100,"local":-100,"code":"USD"}`)

	if err != nil {
		t.Fatalf("unexpected error occured when testing add: %s", err)
	}

	if resp.Code != http.StatusInternalServerError {
		t.Fatalf("unexpected status code %d for duplicated record: %s", resp.Code, resp.Body.String())
	}
}

func TestAddBadParam(t *testing.T) {
	mgr, err := initDB([]Order{})
	if err != nil {
		t.Fatalf("Cannot initial database: %s", err)
	}
	defer mgr.Connection().Close()
	h := &add{mgr}

	resp, err := jsonapi.HandlerTest(h.Handle).Post("/api/add", "", `{}`)

	if err != nil {
		t.Fatalf("unexpected error occured when testing add: %s", err)
	}

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("unexpected status code %d for bas request: %s", resp.Code, resp.Body.String())
	}
}
