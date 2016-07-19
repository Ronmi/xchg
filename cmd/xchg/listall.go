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
	A Authenticator
}

func (h *listall) Handle(dec *json.Decoder, httpData *jsonapi.HTTP) (result interface{}, err error) {
	type p struct {
		Token string `json:"token"`
	}

	var param p
	if err = dec.Decode(&param); err != nil {
		err = jsonapi.Error{http.StatusBadRequest, fmt.Sprintf("Error decoding parameter: %s", err)}
		return
	}

	if !h.A.Valid(param.Token) {
		err = jsonapi.Error{http.StatusForbidden, "Invalid token"}
		return
	}

	qstr := `SELECT * FROM orders`
	rows := h.M.Query(Order{}, qstr)

	ret := make([]Order, 0)
	for rows.Next() {
		var o Order
		rows.Scan(&o)
		ret = append(ret, o)
	}

	if err = rows.Err(); err != nil {
		err = jsonapi.Error{http.StatusInternalServerError, fmt.Sprintf("Error reading data from database: %s", err)}
		return
	}

	return ret, nil
}
