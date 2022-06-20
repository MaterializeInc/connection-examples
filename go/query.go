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

    rows, err := conn.Query(ctx, "SELECT * FROM countries")
    if err != nil {
        fmt.Println(err)
    }

    type result struct {
        Code string
        Name string
    }

    for rows.Next() {
        var r result
        err = rows.Scan(&r.Code, &r.Name)
        if err != nil {
            fmt.Println(err)
        }
        // operate on result
        fmt.Printf("%s %s\n", r.Code, r.Name)
    }

    defer conn.Close(context.Background())
}
