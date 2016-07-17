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

func (h *add) Handle(enc *json.Encoder, dec *json.Decoder, httpData *jsonapi.HTTP) {
	type p struct {
		Data  Order  `json:"data"`
		Token string `json:"token"`
	}

	var param p
	if err := dec.Decode(&param); err != nil {
		httpData.WriteHeader(http.StatusBadRequest)
		enc.Encode("Parameter is not Order object")
		return
	}

	if !h.A.Valid(param.Token) {
		httpData.WriteHeader(http.StatusForbidden)
		enc.Encode("Invalid token")
		return
	}

	// validating data
	data := param.Data
	data.Code = strings.ToUpper(strings.TrimSpace(data.Code))
	if len(data.Code) != 3 || data.Local == 0 || data.Foreign == 0 || data.Time <= 0 {
		httpData.WriteHeader(http.StatusBadRequest)
		enc.Encode("Parameter has no Order object")
		return
	}

	if _, err := h.M.Insert("orders", data); err != nil {
		httpData.WriteHeader(http.StatusInternalServerError)
		enc.Encode(fmt.Sprintf("Error saving order: %s", err))
		return
	}

	enc.Encode(nil)
}
