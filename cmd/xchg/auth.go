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
func (h *auth) e(msg string) jsonapi.Error {
	return jsonapi.Error{http.StatusBadRequest, msg}
}

func (h *auth) Handle(dec *json.Decoder, httpData *jsonapi.HTTP) (ret interface{}, err error) {
	// 定義參數型別
	type p struct {
		Pin string `json:"pin"`
	}

	var param p

	// 同樣的錯誤會在這個方法裡重複使用，所以拉出來

	if err = dec.Decode(&param); err != nil {
		err = h.e("Parameter is not Pin object")
		return
	}

	// validating data
	token, err := h.A.Token(param.Pin)
	if err != nil {
		err = h.e("Pin code incorrect")
		return
	}

	return token, nil
}
