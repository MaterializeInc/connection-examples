require 'pg'

# Locally running instance:
conn = PG.connect(host:"MATERIALIZE_HOST", port: 6875, user: "MATERIALIZE_USERNAME", password: "MATERIALIZE_PASSWORD")
conn.exec('BEGIN')
conn.exec('DECLARE c CURSOR FOR SUBSCRIBE my_view')

while true
  conn.exec('FETCH c') do |result|
    result.each do |row|
      puts row
    end
  end
end