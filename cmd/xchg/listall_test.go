package main

import (
	"encoding/json"
	"net/http"
	"strings"
	"testing"

	"github.com/Patrolavia/jsonapi"
)

func TestListAll(t *testing.T) {
	presetData := []Order{
		Order{1468248039, 100, -100, "USD"},
		Order{1468248040, -50, 51, "USD"},
		Order{1468248041, 100, -100, "JPY"},
		Order{1468248042, -50, 51, "JPY"},
	}
	mgr, err := initDB(presetData)
	if err != nil {
		t.Fatalf("Cannot initial database: %s", err)
	}
	defer mgr.Connection().Close()
	h := &listall{mgr}

	resp, err := jsonapi.HandlerTest(h.Handle).Get("/api/listall", "")

	if err != nil {
		t.Fatalf("unexpected error occured when testing listall: %s", err)
	}

	if resp.Code != http.StatusOK {
		t.Fatalf("unexpected error occured when testing listall with status code %d: %s", resp.Code, resp.Body.String())
	}

	var orders []Order
	if resp.Body == nil {
		t.Fatal(resp)
	}
	if err := json.Unmarshal(resp.Body.Bytes(), &orders); err != nil {
		t.Fatalf("cannot encode returned data from listall: %s", err)
	}

	msgs := validateOrders(presetData, orders)
	for _, msg := range msgs {
		t.Errorf("listall: %s", msg)
	}
}

func TestListAllEmpty(t *testing.T) {
	mgr, err := initDB([]Order{})
	if err != nil {
		t.Fatalf("Cannot initial database: %s", err)
	}
	defer mgr.Connection().Close()

	h := &listall{mgr}

	resp, err := jsonapi.HandlerTest(h.Handle).Get("/api/listall", "")

	if err != nil {
		t.Fatalf("unexpected error occured when testing listall: %s", err)
	}

	if resp.Code != http.StatusOK {
		t.Fatalf("unexpected error occured when testing listall with status code %d: %s", resp.Code, resp.Body.String())
	}

	if resp.Body == nil {
		t.Fatal(resp)
	}
	if str := strings.TrimSpace(resp.Body.String()); str != "[]" {
		t.Errorf("listall: not returning empty array: '%s'", str)
	}
}
