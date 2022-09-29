#!/usr/bin/env python3

import psycopg2
import sys

dsn = "postgresql://MATERIALIZE_USERNAME:MATERIALIZE_PASSWORD@MATERIALIZE_HOST:6875/materialize?sslmode=require"
conn = psycopg2.connect(dsn)
conn.autocommit = True

cur = conn.cursor()

with conn.cursor() as cur:
    cur.execute("CREATE SOURCE counter FROM LOAD GENERATOR COUNTER")

with conn.cursor() as cur:
    cur.execute("SHOW SOURCES")
    print(cur.fetchone())