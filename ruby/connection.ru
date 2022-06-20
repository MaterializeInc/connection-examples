require 'pg'

conn = PG.connect(host:"127.0.0.1", port: 6875, user: "materialize")