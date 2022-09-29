// node 14+ cjs named exports not found in pg
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  user: "MATERIALIZE_USERNAME",
  database: "materialize",
  password: "APP_SPECIFIC_PASSWORD",
  hostname: "MATERIALIZE_HOST",
  port: 6875
});

async function main() {
  try {
    await client.connect();

    await client.query('BEGIN');
    await client.query('DECLARE c CURSOR FOR SUBSCRIBE market_orders_2');

    while (true) {
      const res = await client.query('FETCH ALL c');
      console.log(res.rows);
    }
  } catch (e) {
    console.log("error: ", e);
  } finally {
    client.end(); // only on error
  }
}

await main();