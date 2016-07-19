package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"git.ronmi.tw/ronmi/sdm"
	"github.com/Patrolavia/jsonapi"
)

type add struct {
	M *sdm.Manager
	A Authenticator
}

func (h *add) Handle(dec *json.Decoder, httpData *jsonapi.HTTP) (ret interface{}, err error) {
	type p struct {
		Data  Order  `json:"data"`
		Token string `json:"token"`
	}

	var param p
	if err := dec.Decode(&param); err != nil {
		return nil, jsonapi.Error{http.StatusBadRequest, "Parameter is not Order object"}
	}

	if !h.A.Valid(param.Token) {
		return nil, jsonapi.Error{http.StatusForbidden, "Invalid token"}
	}

	// validating data
	data := param.Data
	data.Code = strings.ToUpper(strings.TrimSpace(data.Code))
	if len(data.Code) != 3 || data.Local == 0 || data.Foreign == 0 || data.Time <= 0 {
		return nil, jsonapi.Error{http.StatusBadRequest, "Parameter has no Order object"}
	}

	if _, err := h.M.Insert("orders", data); err != nil {
		return nil, jsonapi.Error{http.StatusInternalServerError, fmt.Sprintf("Error saving order: %s", err)}
	}

	return
}
