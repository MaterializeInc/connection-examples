const { Client } = require('pg');
const client = new Client('postgres://materialize@localhost:6875/materialize');

async function main() {
  await client.connect();
  const res = await client.query('SELECT * FROM my_view');
  console.log(res.rows);
};

main();