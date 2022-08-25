require 'pg'

conn = PG.connect(host:"MATERIALIZE_HOST", port: 6875, user: "MATERIALIZE_USERNAME", password: "MATERIALIZE_PASSWORD")

res  = conn.exec('SELECT * FROM my_view')

res.each do |row|
  puts row
end