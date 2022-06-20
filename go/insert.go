package main

import (
    "context"
    "github.com/jackc/pgx/v4"
    "fmt"
)

func main() {

    ctx := context.Background()
    connStr := "postgres://materialize@localhost:6875/materialize?sslmode=disable"

    conn, err := pgx.Connect(ctx, connStr)
    if err != nil {
        fmt.Println(err)
    } else {
        fmt.Println("Connected to Materialize!")
    }

    insertSQL := "INSERT INTO countries (code, name) VALUES ($1, $2)"

    _, err = conn.Exec(ctx, insertSQL, "GH", "GHANA")
    if err != nil {
        fmt.Println(err)
    }

    defer conn.Close(context.Background())
}


