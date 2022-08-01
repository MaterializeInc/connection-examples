// node 14+ cjs named exports not found in pg
import pkg from 'pg';
const { Client } = pkg;

const client = new Client('postgres://materialize@localhost:6875/materialize');

async function main() {
  try {
    await client.connect();

    await client.query('BEGIN');
    await client.query('DECLARE c CURSOR FOR TAIL market_orders_2');

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