#!/usr/bin/env python3

import psycopg2
import sys

dsn = "user=MATERIALIZE_USERNAME password=MATERIALIZE_PASSWORD host=MATERIALIZE_HOST port=6875 dbname=materialize sslmode=require"
conn = psycopg2.connect(dsn)
conn.autocommit = True

cur = conn.cursor()

with conn.cursor() as cur:
    cur.execute("CREATE VIEW market_orders_2 AS " \
            "SELECT " \
                "val->>'symbol' AS symbol, " \
                "(val->'bid_price')::float AS bid_price " \
            "FROM (SELECT text::jsonb AS val FROM market_orders_raw_2)")

with conn.cursor() as cur:
    cur.execute("SHOW VIEWS")
    print(cur.fetchone())