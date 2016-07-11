package main

import (
	"database/sql"
	"flag"
	"log"
	"net/http"

	"git.ronmi.tw/ronmi/sdm"
	"github.com/Patrolavia/jsonapi"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	var bind string
	var constr string
	flag.StringVar(&bind, "bind", ":8000", "parameter to pass to http.ListenAndServe")
	flag.StringVar(&constr, "constr", "file:data.db?cache=shared&mode=rwc", "sqlite connection string")
	flag.Parse()

	db, err := sql.Open("sqlite3", constr)
	if err != nil {
		log.Fatalf("Error connecting to db with constr %s: %s", constr, err)
	}

	if err := initTable(db); err != nil {
		log.Fatalf("Error initializing database: %s", err)
	}

	mgr := sdm.New(db)
	jsonapi.HandleFunc("/api/listall", (&listall{mgr}).Handle)
	jsonapi.HandleFunc("/api/list", (&list{mgr}).Handle)
	jsonapi.HandleFunc("/api/add", (&add{mgr}).Handle)

	if err := http.ListenAndServe(bind, nil); err != nil {
		log.Fatalf("Error starting http server: %s", err)
	}
}
