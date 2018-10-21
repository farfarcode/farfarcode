package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	_ "github.com/lib/pq"
)

const (
	DBUSER string = "deniskozlov"
	DBNAME string = "mydb"
	PORT   string = ":8081"
)

type Job struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	Body        string `json:"body"`
	Ref         string `json:"ref"`
	Employer    string `json:"employer"`
	Website     string `json:"website"`
	Contacts    string `json:"contacts"`
	PublishDate string `json:"publish_date"`
}

var db *sql.DB

/*var jobs []Job = []Job{
	{"Lead iOS Engineer", "Kiva"},
	{"Director of Data Science", "Kiva"},
	{"Senior Product Designer", "Kiva"},
	{"Product Manager", "Medic Mobile"},
	{"CTO", "Hello Tractor"},
	{"Partnerships Manager", "Hello Tractor"},
	{"Data Associate", "Ingenuity"},
	{"Impact Data Manager", "New Story"},
	{"Campaign Analyst", "Ad Council"},
	{"Salesforce Administrator", "Ad Council"},
	{"Test11", "Good job"},
	{"Test12", "Good job"},
	{"Test13", "Good job"},
	{"Test14", "Good job"},
	{"Test15", "Good job"},
	{"Test16", "Good job"},
}*/

func init() {
	var err error
	db, err = sql.Open("postgres", fmt.Sprintf("user=%s dbname=%s sslmode=disable", DBUSER, DBNAME))
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS " +
		"farfarcoder(id SERIAL PRIMARY KEY," +
		"title varchar(65) NOT NULL," +
		"body text NOT NULL," +
		"ref varchar(150)," +
		"employer varchar(65) NOT NULL," +
		"website varchar(15) NOT NULL," +
		"contacts text NOT NULL," +
		"publish_date timestamp)")
	if err != nil {
		log.Fatal(err)
	}
}

func isset(sl []string, idx int) bool {
	return len(sl) > idx
}

func insert(db *sql.DB, args ...string) (int64, error) {
	values := make([]interface{}, len(args))
	for i := range args {
		values[i] = args[i]
	}
	res, err := db.Exec("INSERT INTO farfarcoder VALUES (default, $1, $2, $3, $4, $5, $6, $7)",
		values...)
	if err != nil {
		return 0, err
	}
	return res.RowsAffected()
}

func show(db *sql.DB, id string) (res []Job, err error) {
	var where string
	if id != "" {
		where = "WHERE id = " + id
	}
	rows, err := db.Query("SELECT id, title, body, ref, employer, website, contacts, publish_date FROM farfarcoder " + where + " ORDER BY publish_date DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var job Job
	for rows.Next() {
		err = rows.Scan(&job.Id, &job.Title, &job.Body, &job.Ref, &job.Employer, &job.Website, &job.Contacts, &job.PublishDate)
		if err != nil {
			return nil, err
		}
		res = append(res, job)
	}
	return res, nil
}

func main() {
	defer db.Close()
	var err error
	jobs := make([]Job, 0)
	static := http.FileServer(http.Dir("static"))
	dist := http.FileServer(http.Dir("dist"))
	http.Handle("/dist/", http.StripPrefix("/dist/", dist))
	http.Handle("/", static)

	/*
			http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
				fmt.Println(r.URL.Path)
				file, err := os.Open("index.html")
				if err != nil {
					fmt.Println(err.Error())
				}
				fi, _ := file.Stat()

				b := bufio.NewReader(file)
				out := make([]byte, 0, fi.Size())

				for {
					byte, err := b.ReadByte()
					if err == io.EOF {
						break
					}
					out = append(out, byte)
				}

				// Other method
				for {
					line, _, err := b.ReadLine()
					if err == io.EOF {
						break
					}
					out = append(out, line...)
				}

				w.Write(out)
			})

		/*http.HandleFunc("/postjob/", func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodPost {

			}
		}*/

	http.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("request", r.URL.Path)
		switch r.Method {
		case http.MethodGet:
			var jobId string
			s := strings.Split(r.URL.Path, "/")
			if isset(s, 2) && s[2] != "" {
				jobId = s[2]
			}
			fmt.Println(jobId)
			jobs, err = show(db, jobId)
			if err != nil {
				log.Fatal(err)
				break
			}
			json, _ := json.Marshal(jobs)
			w.Header().Set("Content-Type", "application/json")
			w.Write(json)
		case http.MethodPost:
			fmt.Println("POST")
			b, _ := ioutil.ReadAll(r.Body)
			job := Job{}
			err = json.Unmarshal(b, &job)
			if err != nil {
				log.Println(err)
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			//fmt.Println(job)
			_, err = insert(db, job.Title, job.Body, job.Ref, job.Employer, job.Website, job.Contacts, time.Now().Format("2006-01-02 15:04:05"))
			if err != nil {
				log.Fatal(err)
			}

		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.ListenAndServe(PORT, nil)
}
