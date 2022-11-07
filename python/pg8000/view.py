#!/usr/bin/env python3

import pg8000.native
import ssl

ssl_context = ssl.create_default_context()

conn = pg8000.connect(host="MATERIALIZE_HOST", port=6875, user="MATERIALIZE_USERNAME", password="MATERIALIZE_PASSWORD", database="materialize", ssl_context=ssl_context)

print('Create a view: country_codes')
create_view_query = "CREATE VIEW IF NOT EXISTS country_codes AS SELECT code FROM countries"
conn.run(create_view_query)

print('Select data from view')
country_codes = conn.run("SELECT * FROM country_codes;")
print(country_codes)