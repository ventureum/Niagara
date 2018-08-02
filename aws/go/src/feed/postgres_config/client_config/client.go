package client_config

import (
  "log"
  _ "github.com/lib/pq"
  "fmt"
  "github.com/jmoiron/sqlx"
  "os"
)

type PostgresFeedClient struct {
  C *sqlx.DB
}

func ConnectPostgresClient() *PostgresFeedClient {
  dbUser := os.Getenv("DB_USER")
  dbPassword := os.Getenv("DB_PASSWORD")
  dbName := os.Getenv("DB_NAME")
  dbHost := os.Getenv("DB_HOST")
  dbinfo := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable",
    dbHost, dbUser, dbPassword, dbName)
  db, err := sqlx.Connect("postgres", dbinfo)
  if err != nil {
    log.Fatalln(err)
  }
  log.Println("Connected to Postgres Client")
  return &PostgresFeedClient{C: db}
}

func (postgresFeedClient *PostgresFeedClient) CreateTable(schema string, tableName string) {
  tx := postgresFeedClient.C.MustBegin()
  _ , err := tx.Exec(schema)
  if err != nil {
    log.Fatalf("Failed to execute deleting Table %s:\n error: %s", tableName, err.Error())
  }
  tx.Commit()
  log.Printf("Table %s has been created\n", tableName)
}

func (postgresFeedClient *PostgresFeedClient) DeleteTable(tableName string) {
  command := fmt.Sprintf("DROP TABLE IF EXISTS %s;", tableName)
  tx := postgresFeedClient.C.MustBegin()
  res, err := tx.Exec(command)
  if err != nil {
    log.Fatalf("Failed to execute deleting Table %s:\n error: %s", tableName, err.Error())
  }
  tx.Commit()
  affected, _ := res.RowsAffected()
  log.Printf("Table %s has been deleted with %v rows affected\n", tableName,  affected)
}

func (postgresFeedClient *PostgresFeedClient) CreateTimestampTrigger() {
  _, err := postgresFeedClient.C.Exec(TRIGGER_SET_TIMESTAMP_COMMAND)
  if err != nil {
    log.Fatalf("Failed to create timestamp trigger\n")
  }
}

func (postgresFeedClient *PostgresFeedClient) RegisterTimestampTrigger(tableName string) {
  command := fmt.Sprintf(REGISTER_TIMESTAMP_TRIGGER_COMMAND, tableName)
  _, err := postgresFeedClient.C.Exec(command)
  if err != nil {
    log.Fatalf("Failed to register timestamp trigger for Table %s\n", tableName)
  }
}
