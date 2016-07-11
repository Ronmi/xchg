package main

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/Patrolavia/jsonapi"
)

func TestList(t *testing.T) {
	h := &list{mgr}

	resp, err := jsonapi.HandlerTest(h.Handle).Get("/api/list", "")

	if err != nil {
		t.Fatalf("unexpected error occured when testing list: %s", err)
	}

	if resp.Code != http.StatusOK {
		t.Fatalf("unexpected error occured when testing list with status code %d: %s", resp.Code, resp.Body.String())
	}

	var orders []Order
	if resp.Body == nil {
		t.Fatal(resp)
	}
	if err := json.Unmarshal(resp.Body.Bytes(), &orders); err != nil {
		t.Fatalf("cannot encode returned data from list: %s", err)
	}

	// too lazy to use smart algorithm XD
	if len(orders) != len(presetUSD) {
		t.Errorf("list: expected %d records, got %d", len(presetUSD), len(orders))
	}

	counter := make(map[Order]int)
	for _, data := range presetUSD {
		counter[data] = 0
	}

	for _, o := range orders {
		cnt, ok := counter[o]
		if !ok {
			t.Errorf("list: unknown order: %#v", o)
		}
		if cnt > 0 {
			t.Errorf("list: duplicated order: %#v", o)
		}
		counter[o] = 1
	}

}
