package main

import (
	"context"
	"fmt"
	"encoding/json"

    "github.com/jackc/pgx/v4"
)

func main() {

	ctx := context.Background()
	connStr := "postgres://MATERIALIZE_USERNAME:APP_SPECIFIC_PASSWORD@MATERIALIZE_HOST:6875/materialize?ssl_mode=require"

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

	_, err = tx.Exec(ctx, "DECLARE c CURSOR FOR SUBSCRIBE (SELECT sum FROM counter_sum) WITH (PROGRESS);")
	if err != nil {
		fmt.Println(err)
		return
	}

	// Define a struct to hold the data returned from the query
	type subscribeResult struct {
		MzTimestamp int64
		MzProgress  bool
		MzDiff      pgx.NullInt64
		Sum			pgx.NullInt64
	}

	state := NewState(false)
	var buffer []Update
	for {
		rows, err := tx.Query(ctx, "FETCH ALL c")
		if err != nil {
			fmt.Println(err)
			tx.Rollback(ctx)
			return
		}

		for rows.Next() {
			var r subscribeResult

			if err := rows.Scan(&r.MzTimestamp, &r.MzProgress, &r.MzDiff, &r.Sum); err != nil {
				fmt.Println(err)
				tx.Rollback(ctx)
				return
			}

			if r.MzProgress {
				state.Update(buffer, r.MzTimestamp)
				fmt.Println(state.getState())

				// Clean buffer
				buffer = []Update{}
			} else {
				jsonData := []byte(fmt.Sprintf(`{
					"value": {
						"sum": %d
					}
				}`, r.Sum));
				var update Update
				json.Unmarshal(jsonData, &update)

				buffer = append(buffer, update)
			}
		}
	}

	err = tx.Commit(ctx)
	if err != nil {
		fmt.Println(err)
	}

	defer conn.Close(context.Background())
}
