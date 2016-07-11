package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"git.ronmi.tw/ronmi/sdm"
	"github.com/Patrolavia/jsonapi"
)

type listall struct {
	M *sdm.Manager
}

func (h *listall) Handle(enc *json.Encoder, dec *json.Decoder, httpData *jsonapi.HTTP) {
	qstr := `SELECT * FROM orders`
	rows := h.M.Query(Order{}, qstr)

	ret := make([]Order, 0)
	for rows.Next() {
		var o Order
		rows.Scan(&o)
		ret = append(ret, o)
	}

	if err := rows.Err(); err != nil {
		httpData.WriteHeader(http.StatusInternalServerError)
		enc.Encode(fmt.Sprintf("Error reading data from database: %s", err))
		return
	}

	if err := enc.Encode(ret); err != nil {
		httpData.WriteHeader(http.StatusInternalServerError)
		enc.Encode(fmt.Sprintf("Error formatting data: %s", err))
	}
}
