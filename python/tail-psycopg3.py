#!/usr/bin/env python3

import psycopg3
import sys

dsn = "postgresql://MATERIALIZE_USERNAME:MATERIALIZE_PASSWORD@MATERIALIZE_HOST:6875/materialize?sslmode=enabled"
conn = psycopg3.connect(dsn)

conn = psycopg3.connect(dsn)
with conn.cursor() as cur:
    for row in cur.stream("TAIL t"):
        print(row)