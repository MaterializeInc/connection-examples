#!/usr/bin/env python3

import psycopg2
import sys

dsn = "postgresql://materialize@localhost:6875/materialize?sslmode=disable"
conn = psycopg2.connect(dsn)
conn.autocommit = True

cur = conn.cursor()

with conn.cursor() as cur:
    cur.execute("CREATE SOURCE market_orders_raw_2 FROM PUBNUB " \
            "SUBSCRIBE KEY 'sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe' " \
            "CHANNEL 'pubnub-market-orders'")

with conn.cursor() as cur:
    cur.execute("SHOW SOURCES")
    print(cur.fetchone())