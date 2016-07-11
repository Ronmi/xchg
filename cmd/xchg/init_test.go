package main

import (
	"database/sql"
	"fmt"

	"git.ronmi.tw/ronmi/sdm"
	_ "github.com/mattn/go-sqlite3"
)

func initDB(presetData []Order) (mgr *sdm.Manager, err error) {
	db, err := sql.Open("sqlite3", ":memory:")
	if err != nil {
		return
	}

	initTable(db)
	mgr = sdm.New(db)

	// create preset data
	for _, data := range presetData {
		if _, err = mgr.Insert("orders", data); err != nil {
			return
		}
	}
	return
}

func validateOrders(expect, actual []Order) (msgs []string) {
	// too lazy to use smart algorithm XD
	if len(actual) != len(expect) {
		msgs = append(msgs, fmt.Sprintf("expected %d records, got %d", len(expect), len(actual)))
	}

	counter := make(map[Order]int)
	for _, data := range expect {
		counter[data] = 0
	}

	for _, o := range actual {
		cnt, ok := counter[o]
		if !ok {
			msgs = append(msgs, fmt.Sprintf("unknown order: %#v", o))
		}
		if cnt > 0 {
			msgs = append(msgs, fmt.Sprintf("duplicated order: %#v", o))
		}
		counter[o] = 1
	}

	return
}
