require 'pg'

# Locally running instance:
conn = PG.connect(host:"127.0.0.1", port: 6875, user: "materialize")
conn.exec('BEGIN')
conn.exec('DECLARE c CURSOR FOR TAIL my_view')

while true
  conn.exec('FETCH c') do |result|
    result.each do |row|
      puts row
    end
  end
end