const { Client } = require("pg");

const client = new Client({
    user: MATERIALIZE_USERNAME,
    password: MATERIALIZE_PASSWORD,
    host: MATERIALIZE_HOST,
    port: 6875,
    database: "materialize",
    ssl: true,
});

async function main() {
  await client.connect();
  const res = await client.query(
    `CREATE VIEW market_orders_2 AS
            SELECT
                val->>'symbol' AS symbol,
                (val->'bid_price')::float AS bid_price
            FROM (SELECT text::jsonb AS val FROM market_orders_raw)`
  );
  console.log(res);
}

main();
