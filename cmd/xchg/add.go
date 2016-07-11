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
}

func (h *add) Handle(enc *json.Encoder, dec *json.Decoder, httpData *jsonapi.HTTP) {
	var param Order
	if err := dec.Decode(&param); err != nil {
		httpData.WriteHeader(http.StatusBadRequest)
		enc.Encode("Parameter is not Order object")
		return
	}

	// validating data
	param.Code = strings.ToUpper(strings.TrimSpace(param.Code))
	if len(param.Code) != 3 || param.Local == 0 || param.Foreign == 0 || param.Time <= 0 {
		httpData.WriteHeader(http.StatusBadRequest)
		enc.Encode("Parameter is not Order object")
		return
	}

	if _, err := h.M.Insert("orders", param); err != nil {
		httpData.WriteHeader(http.StatusInternalServerError)
		enc.Encode(fmt.Sprintf("Error saving order: %s", err))
		return
	}

	enc.Encode(nil)
}
