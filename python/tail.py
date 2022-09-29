#!/usr/bin/env python3

import psycopg2
import sys

dsn = "postgresql://MATERIALIZE_USERNAME:MATERIALIZE_PASSWORD@MATERIALIZE_HOST:6875/materialize?sslmode=require"
conn = psycopg2.connect(dsn)

with conn.cursor() as cur:
    cur.execute("DECLARE c CURSOR FOR TAIL my_view")
    while True:
        cur.execute("FETCH ALL c")
        for row in cur:
            print(row)