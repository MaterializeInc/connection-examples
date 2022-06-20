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

    createSourceSQL := `CREATE SOURCE market_orders_raw FROM PUBNUB
                SUBSCRIBE KEY 'sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe
                CHANNEL 'pubnub-market-orders'`

    _, err = conn.Exec(ctx, createSourceSQL)
    if err != nil {
        fmt.Println(err)
    }

    defer conn.Close(context.Background())
}