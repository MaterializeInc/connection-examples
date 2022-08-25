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

	createSourceSQL := `CREATE SOURCE counter FROM LOAD GENERATOR COUNTER`

	_, err = conn.Exec(ctx, createSourceSQL)
	if err != nil {
		fmt.Println(err)
	}

	defer conn.Close(context.Background())
}
