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

	tx, err := conn.Begin(ctx)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, "DECLARE c CURSOR FOR SUBSCRIBE my_view")
	if err != nil {
		fmt.Println(err)
		return
	}

	// Define a struct to hold the data returned from the query
	type subscribeResult struct {
		MzTimestamp int64
		MzDiff      int
		MzValue     int
	}

	for {
		rows, err := tx.Query(ctx, "FETCH ALL c")
		if err != nil {
			fmt.Println(err)
			tx.Rollback(ctx)
			return
		}

		for rows.Next() {
			var r subscribeResult
			if err := rows.Scan(&r.MzTimestamp, &r.MzDiff, &r.MzValue); err != nil {
				fmt.Println(err)
				tx.Rollback(ctx)
				return
			}
			fmt.Printf("%d %d %d\n", r.MzTimestamp, r.MzDiff, r.MzValue)
			// operate on subscribeResult
		}
	}

	err = tx.Commit(ctx)
	if err != nil {
		fmt.Println(err)
	}

	defer conn.Close(context.Background())
}
