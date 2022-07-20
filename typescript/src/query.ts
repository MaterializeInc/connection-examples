// node 14+ cjs named exports not found in pg
import pkg from 'pg';
const { Client } = pkg;

const client = new Client('postgres://materialize@localhost:6875/materialize');

async function main() {
  try {
    await client.connect();
    const res = await client.query('SELECT * FROM market_orders_2');
    console.log(res.rows);
  } catch(e) {
    console.log("error: ", e);
  } finally {
    client.end();
  }
};

await main();