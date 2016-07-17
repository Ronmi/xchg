package main

import (
	"encoding/json"
	"net/http"

	"github.com/Patrolavia/jsonapi"
)

type auth struct {
	A Authenticator
}

// 錯誤處理會重複使用，抽出來
func (h *auth) e(enc *json.Encoder, httpData *jsonapi.HTTP, msg string) {
	httpData.WriteHeader(http.StatusBadRequest)
	enc.Encode(msg)
	return
}

func (h *auth) Handle(enc *json.Encoder, dec *json.Decoder, httpData *jsonapi.HTTP) {
	// 定義參數型別
	type p struct {
		Pin string `json:"pin"`
	}

	var param p

	// 同樣的錯誤會在這個方法裡重複使用，所以拉出來

	if err := dec.Decode(&param); err != nil {
		h.e(enc, httpData, "Parameter is not Pin object")
		return
	}

	// validating data
	token, err := h.A.Token(param.Pin)
	if err != nil {
		h.e(enc, httpData, "Pin code incorrect")
		return
	}

	enc.Encode(token)
}
