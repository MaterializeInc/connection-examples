#!/usr/bin/env python3

import psycopg2
import sys

dsn = "user=MATERIALIZE_USERNAME password=MATERIALIZE_PASSWORD host=MATERIALIZE_HOST port=6875 dbname=materialize sslmode=require"
conn = psycopg2.connect(dsn)
conn.autocommit = True

cur = conn.cursor()

with conn.cursor() as cur:
    cur.execute("CREATE SOURCE counter FROM LOAD GENERATOR COUNTER")

with conn.cursor() as cur:
    cur.execute("SHOW SOURCES")
    print(cur.fetchone())