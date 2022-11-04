#!/usr/bin/env python3

import pg8000.native
import ssl

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = ssl.CERT_REQUIRED

conn = pg8000.connect(host="MATERIALIZE_HOST", port=6875, user="MATERIALIZE_USERNAME", password="MATERIALIZE_PASSWORD", database="materialize", ssl_context=ssl_context)

# Show clusters
clusters = conn.run("SHOW CLUSTERS;")
print(clusters)

# Create a table
print('Create a table: countries')
create_table_query = "CREATE TABLE IF NOT EXISTS countries (name text, code text)"
conn.run(create_table_query)

# Show tables
tables = conn.run("SHOW TABLES;")
print(tables)

# Insert data
print('Insert data')
insert_query = "INSERT INTO countries (name, code) VALUES ('United States', 'US')"
conn.run(insert_query)
insert_query = "INSERT INTO countries (name, code) VALUES ('Canada', 'CA')"
conn.run(insert_query)
print('Select data')
countries = conn.run("SELECT * FROM countries;")
print(countries)

# Create a view
print('Create a view: country_codes')
create_view_query = "CREATE VIEW IF NOT EXISTS country_codes AS SELECT code FROM countries"
conn.run(create_view_query)
print('Select data from view')
country_codes = conn.run("SELECT * FROM country_codes;")
print(country_codes)