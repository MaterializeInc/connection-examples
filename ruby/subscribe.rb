require 'pg'
require './state'

conn = PG.connect(
  host: "MATERIALIZE_HOST",
  port: 6875,
  dbname: "materialize",
  user: "MATERIALIZE_USERNAME",
  password: "MATERIALIZE_PASSWORD",
  sslmode: 'require'
)
conn.exec('BEGIN')
conn.exec('DECLARE c CURSOR FOR SUBSCRIBE (SELECT sum FROM counter_sum) WITH (PROGRESS)')

updated = false
state = State.new(false)

# Loop indefinitely
loop do
  conn.exec('FETCH c') do |result|
    result.each do |row|
      # Map row fields
      ts = row["mz_timestamp"]
      progress = row["mz_progressed"]
      diff = row["mz_diff"]
      rowData = { sum: row["sum"] }

      #  When a progress is detected, get the last values
      if progress == 't'
        if updated
          updated = false
          puts state.get_values
        end
      else
        # Update the state with the last data
        updated = true
        begin
          state.update({ value: rowData, diff: diff.to_i }, ts.to_i)
        rescue StandardError => e
          puts "Error: #{e}"
        end
      end
    end
  end
end
