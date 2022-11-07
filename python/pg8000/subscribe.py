#!/usr/bin/env python3

import pg8000.native
import ssl

ssl_context = ssl.create_default_context()

conn = pg8000.connect(host="MATERIALIZE_HOST", port=6875, user="MATERIALIZE_USERNAME", password="MATERIALIZE_PASSWORD", database="materialize", ssl_context=ssl_context)

conn.run("BEGIN")
conn.run("DECLARE c CURSOR FOR SELECT * FROM country_codes")
# infinite loop to keep the cursor open
while True:
    results = conn.run("FETCH ALL FROM c")
    for row in results:
        print(row)


