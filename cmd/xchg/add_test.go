package main

import (
	"log"
	"net/http"
	"strings"
	"testing"

	"git.ronmi.tw/ronmi/sdm"

	"github.com/Patrolavia/jsonapi"
)

func makeAdd(preset []Order) (*add, string, *sdm.Manager) {
	mgr, err := initDB(preset)
	if err != nil {
		log.Fatalf("Cannot initial database: %s", err)
	}
	fake := FakeAuthenticator("123456")
	token, _ := fake.Token("123456")
	return &add{mgr, fake}, token, mgr
}

func TestAddOK(t *testing.T) {
	h, token, mgr := makeAdd([]Order{})
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(h.Handle).Post(
		"/api/add",
		"",
		`{"data":{"when":1468248043,"foreign":100,"local":-100,"code":"AUD"},"token":"`+token+`"}`,
	)

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

	qstr := `SELECT * FROM orders`
	rows := mgr.Query(Order{}, qstr)
	expect := []Order{
		Order{1468248043, 100, -100, "AUD"},
	}

	var orders []Order
	for rows.Next() {
		var o Order
		rows.Scan(&o)
		orders = append(orders, o)
	}

	if err := rows.Err(); err != nil {
		t.Fatalf("add: error reading records from db: %s", err)
	}

	msgs := validateOrders(expect, orders)
	for _, msg := range msgs {
		t.Errorf("add: %s", msg)
	}
}

func TestAddDuplicated(t *testing.T) {
	presetData := []Order{
		Order{1468248039, 100, -100, "USD"},
	}
	h, token, mgr := makeAdd(presetData)
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(h.Handle).Post(
		"/api/add",
		"",
		`{"data":{"when":1468248039,"foreign":100,"local":-100,"code":"USD"},"token":"`+token+`"}`,
	)

	if err != nil {
		t.Fatalf("unexpected error occured when testing add: %s", err)
	}

	if resp.Code != http.StatusInternalServerError {
		t.Fatalf("unexpected status code %d for duplicated record: %s", resp.Code, resp.Body.String())
	}
}

func TestAddNoData(t *testing.T) {
	h, token, mgr := makeAdd([]Order{})
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(h.Handle).Post("/api/add", "", `{"token":"`+token+`"}`)

	if err != nil {
		t.Fatalf("unexpected error occured when testing add: %s", err)
	}

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("unexpected status code %d for bas request: %s", resp.Code, resp.Body.String())
	}
}

func TestAddNotJSON(t *testing.T) {
	h, _, mgr := makeAdd([]Order{})
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(h.Handle).Post("/api/add", "", `1234`)

	if err != nil {
		t.Fatalf("unexpected error occured when testing add: %s", err)
	}

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("unexpected status code %d for bas request: %s", resp.Code, resp.Body.String())
	}
}

func TestAddWrongToken(t *testing.T) {
	h, _, mgr := makeAdd([]Order{})
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(h.Handle).Post(
		"/api/add",
		"",
		`{"data":{"when":1468248043,"foreign":100,"local":-100,"code":"AUD"},"token":"1234"}`,
	)

	if err != nil {
		t.Fatalf("unexpected error occured when testing add: %s", err)
	}

	if resp.Code != http.StatusForbidden {
		t.Fatalf("expect add return forbidden when wrong token, got %d: %s", resp.Code, resp.Body.String())
	}
}
