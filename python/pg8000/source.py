#!/usr/bin/env python3

import pg8000.native
import ssl

ssl_context = ssl.create_default_context()

conn = pg8000.connect(host="MATERIALIZE_HOST", port=6875, user="MATERIALIZE_USERNAME", password="MATERIALIZE_PASSWORD", database="materialize", ssl_context=ssl_context)

conn.run("CREATE SOURCE counter FROM LOAD GENERATOR COUNTER;")
clusters = conn.run("SHOW SOURCES")
print(clusters)