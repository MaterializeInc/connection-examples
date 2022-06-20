# Materialize + Deno example

You connect to Materialize the same way you [connect to PostgreSQL with `deno-postgres`](https://deno.land/x/postgres).

To run the example, run the following command:

```
deno run --allow-net --allow-env connection.ts
```

### Examples:

- [Connection](./connection.ts)
- [Stream](./tail.ts)
- [Query](./query.ts)
- [Insert data into tables](./insert.ts)
- [Manage sources](./source.ts)
- [Manage Views](./view.ts)