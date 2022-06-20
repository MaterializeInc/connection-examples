require 'pg'

conn = PG.connect(host:"127.0.0.1", port: 6875, user: "materialize")

# Create a source
src = conn.exec(
    "CREATE SOURCE IF NOT EXISTS market_orders_raw FROM PUBNUB
            SUBSCRIBE KEY 'sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe'
            CHANNEL 'pubnub-market-orders'"
);

puts src.inspect

# Show the source
res = conn.exec("SHOW SOURCES")
res.each do |row|
  puts row
end