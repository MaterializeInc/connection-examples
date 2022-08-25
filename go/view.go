package main

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v4"
)

func main() {

	ctx := context.Background()
	connStr := "postgres://MATERIALIZE_USERNAME:APP_SPECIFIC_PASSWORD@MATERIALIZE_HOST:6875/materialize"

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
