# Materialize + Go Example

You connect to Materialize the same way you [connect to PostgreSQL with `pgx`](https://pkg.go.dev/github.com/jackc/pgx#ConnConfig).


Add pgx to your Go modules:

```
go get github.com/jackc/pgx/v4
```

Run the example:

```
go run example.go

# Output:
# Connected to Materialize!
```