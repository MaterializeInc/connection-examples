#!/usr/bin/env python3

import psycopg2
import sys

dsn = "postgresql://MATERIALIZE_USERNAME:MATERIALIZE_PASSWORD@MATERIALIZE_HOST:6875/materialize?sslmode=require"
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