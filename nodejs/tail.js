const { Client } = require('pg');

async function main() {
  const client = new Client('postgres://materialize@localhost:6875/materialize');
  await client.connect();

  await client.query('BEGIN');
  await client.query('DECLARE c CURSOR FOR TAIL my_view');

  while (true) {
    const res = await client.query('FETCH ALL c');
    console.log(res.rows);
  }
}

main();