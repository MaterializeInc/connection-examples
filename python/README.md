# Materialize + Python Example

You connect to Materialize the same way you [connect to PostgreSQL with `psycopg2`](https://www.psycopg.org/docs/usage.html).

To install [`psycopg2`](https://pypi.org/project/psycopg2/) run:

```
pip install psycopg2
```

### Examples:

- [Connection](./connection.py)
- [Stream](./tail.py)
- [Query](./query.py)
- [Insert data into tables](./insert.py)
- [Manage sources](./source.py)
- [Manage Views](./view.py)