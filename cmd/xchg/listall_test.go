package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"testing"

	"git.ronmi.tw/ronmi/sdm"

	"github.com/Patrolavia/jsonapi"
)

func makeListAll(preset []Order) (*listall, string, *sdm.Manager) {
	mgr, err := initDB(preset)
	if err != nil {
		log.Fatalf("Cannot initial database: %s", err)
	}
	fake := FakeAuthenticator("123456")
	token, _ := fake.Token("123456")
	return &listall{mgr, fake}, token, mgr
}

func TestListAll(t *testing.T) {
	presetData := []Order{
		Order{1468248039, 100, -100, "USD"},
		Order{1468248040, -50, 51, "USD"},
		Order{1468248041, 100, -100, "JPY"},
		Order{1468248042, -50, 51, "JPY"},
	}
	h, token, mgr := makeListAll(presetData)
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(h.Handle).Post("/api/listall", "", `{"token":"`+token+`"}`)

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
	h, token, mgr := makeListAll([]Order{})
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(h.Handle).Post("/api/listall", "", `{"token":"`+token+`"}`)

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

func TestListAllNotJSON(t *testing.T) {
	h, _, mgr := makeListAll([]Order{})
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(h.Handle).Post("/api/listall", "", `1234`)

	if err != nil {
		t.Fatalf("unexpected error occured when testing listall: %s", err)
	}

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("expected listall return bad request when not sending json, got %d: %s", resp.Code, resp.Body.String())
	}
}

func TestListAllWrongToken(t *testing.T) {
	h, _, mgr := makeListAll([]Order{})
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(h.Handle).Post("/api/listall", "", `{"token":"1234"}`)

	if err != nil {
		t.Fatalf("unexpected error occured when testing listall: %s", err)
	}

	if resp.Code != http.StatusForbidden {
		t.Fatalf("expected listall return forbidden when wrong token, got %d: %s", resp.Code, resp.Body.String())
	}
}
