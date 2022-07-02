require 'pg'

conn = PG.connect(host:"127.0.0.1", port: 6875, user: "materialize")

conn.exec("INSERT INTO my_table (my_column) VALUES ('some_value')")

res  = conn.exec('SELECT * FROM my_table')

res.each do |row|
  puts row
end