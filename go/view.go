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

    createViewSQL := `CREATE VIEW market_orders_2 AS
                    SELECT
                        val->>'symbol' AS symbol,
                        (val->'bid_price')::float AS bid_price
                    FROM (SELECT text::jsonb AS val FROM market_orders_raw)`
    _, err = conn.Exec(ctx, createViewSQL)
    if err != nil {
        fmt.Println(err)
    }

    defer conn.Close(context.Background())
}
