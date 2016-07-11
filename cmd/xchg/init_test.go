package main

import (
	"database/sql"
	"log"

	"git.ronmi.tw/ronmi/sdm"
	_ "github.com/mattn/go-sqlite3"
)

var (
	db         *sql.DB
	mgr        *sdm.Manager
	presetData []Order
	presetUSD  []Order
)

func init() {
	var err error
	db, err = sql.Open("sqlite3", ":memory:")
	if err != nil {
		log.Fatalf("Cannot connect to database: %s", err)
	}

	initTable(db)
	mgr = sdm.New(db)

	presetData = []Order{
		Order{1468248039, 100, -100, "USD"},
		Order{1468248040, -50, 51, "USD"},
		Order{1468248041, 100, -100, "JPY"},
		Order{1468248042, -50, 51, "JPY"},
	}

	presetUSD = []Order{
		presetData[0],
		presetData[1],
	}

	// create preset data
	for _, data := range presetData {
		if _, err := mgr.Insert("orders", data); err != nil {
			log.Fatalf("Cannot create data %#v: %s", data, err)
		}
	}
}
