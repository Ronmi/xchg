package main

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/Patrolavia/jsonapi"
)

func TestListAll(t *testing.T) {
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
		t.Error(msg)
	}
}
