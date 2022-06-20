require 'pg'

conn = PG.connect(host:"127.0.0.1", port: 6875, user: "materialize")

# Create a view
view = conn.exec(
    "CREATE VIEW market_orders_2 AS
            SELECT
                val->>'symbol' AS symbol,
                (val->'bid_price')::float AS bid_price
            FROM (SELECT text::jsonb AS val FROM market_orders_raw)"
);
puts view.inspect

# Show the view
res = conn.exec("SHOW VIEWS")
res.each do |row|
  puts row
end