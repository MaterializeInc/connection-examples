#!/usr/bin/env python3

import psycopg3
import sys

dsn = "user=MATERIALIZE_USERNAME password=MATERIALIZE_PASSWORD host=MATERIALIZE_HOST port=6875 dbname=materialize sslmode=require"
conn = psycopg3.connect(dsn)

with conn.cursor() as cur:
    for row in cur.stream("SUBSCRIBE t"):
        print(row)