package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"git.ronmi.tw/ronmi/sdm"
	"github.com/Patrolavia/jsonapi"
)

type list struct {
	M *sdm.Manager
	A Authenticator
}

func (h *list) Handle(enc *json.Encoder, dec *json.Decoder, httpData *jsonapi.HTTP) {
	type p struct {
		Code  string `json:"code"`
		Token string `json:"token"`
	}

	var param p
	if err := dec.Decode(&param); err != nil {
		httpData.WriteHeader(http.StatusBadRequest)
		enc.Encode(fmt.Sprintf("Error decoding parameter: %s", err))
		return
	}

	if !h.A.Valid(param.Token) {
		httpData.WriteHeader(http.StatusForbidden)
		enc.Encode("Invalid token")
		return
	}

	if param.Code == "" {
		httpData.WriteHeader(http.StatusBadRequest)
		enc.Encode("You must pass currency code to me.")
		return
	}

	qstr := `SELECT * FROM orders WHERE currency_code=?`
	rows := h.M.Query(Order{}, qstr, strings.ToUpper(param.Code))

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
