// node 14+ cjs named exports not found in pg
import pkg from 'pg';
const { Client } = pkg;

const client = new Client('postgres://materialize@localhost:6875/materialize');

async function main() {
    try {
        await client.connect();
        const res = await client.query(
            `CREATE VIEW market_orders_2 AS
                SELECT
                    val->>'symbol' AS symbol,
                    (val->'bid_price')::float AS bid_price
                FROM (SELECT text::jsonb AS val FROM market_orders_raw)`
            );
        console.log(res);
    } catch (e) {
        console.log("error: ", e);
    } finally {
        client.end();
    }
}

await main();