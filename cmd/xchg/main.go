package main

import (
	"database/sql"
	"encoding/base32"
	"encoding/hex"
	"flag"
	"log"
	"net/http"
	"os"
	"strings"

	"git.ronmi.tw/ronmi/sdm"
	"github.com/Patrolavia/jsonapi"
	_ "github.com/mattn/go-sqlite3"
)

func checkSeed(seed string) string {
	if len(seed) != 20 {
		log.Fatal("You must provide just 20 hexdecimal characters as OTP secret.")
	}

	buf, err := hex.DecodeString(seed)
	if err != nil {
		log.Fatal("OTP secret must be hexdecimal characters.")
	}

	return base32.StdEncoding.EncodeToString(buf)
}

func main() {
	var bind string
	var constr string
	var uidir string
	var seed string
	flag.StringVar(&bind, "bind", ":8000", "parameter to pass to http.ListenAndServe")
	flag.StringVar(&constr, "constr", "file:data.db?cache=shared&mode=rwc", "sqlite connection string")
	flag.StringVar(&uidir, "ui", "../../ui", "path to ui files, cant be absolute or relative")
	flag.StringVar(&seed, "seed", "", "20 hexdecimal characters as OTP secret")
	flag.Parse()

	seed = strings.TrimSpace(seed)
	authmgr := NewAuthenticator(checkSeed(seed))
	log.Printf("To auth your self, install Google Authenticator and add this url in it: %s", authmgr.URI(os.Getenv("USER")))

	db, err := sql.Open("sqlite3", constr)
	if err != nil {
		log.Fatalf("Error connecting to db with constr %s: %s", constr, err)
	}

	if err := initTable(db); err != nil {
		log.Fatalf("Error initializing database: %s", err)
	}

	mgr := sdm.New(db)
	jsonapi.HandleFunc("/api/auth", (&auth{authmgr}).Handle)
	jsonapi.HandleFunc("/api/listall", (&listall{mgr, authmgr}).Handle)
	jsonapi.HandleFunc("/api/list", (&list{mgr, authmgr}).Handle)
	jsonapi.HandleFunc("/api/add", (&add{mgr, authmgr}).Handle)

	// serve ui files
	http.Handle("/node_modules/", http.FileServer(http.Dir(uidir)))
	http.Handle("/css/", http.FileServer(http.Dir(uidir)))
	http.Handle("/js/", http.FileServer(http.Dir(uidir)))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, uidir+"/index.html")
	})

	if err := http.ListenAndServe(bind, nil); err != nil {
		log.Fatalf("Error starting http server: %s", err)
	}
}
