const { Client } = require("pg");

async function main() {
  const client = new Client({
    user: MATERIALIZE_USERNAME,
    password: MATERIALIZE_PASSWORD,
    host: MATERIALIZE_HOST,
    port: 6875,
    database: "materialize",
    ssl: true,
  });
  await client.connect();

  await client.query("BEGIN");
  await client.query("DECLARE c CURSOR FOR SUBSCRIBE my_view");

  while (true) {
    const res = await client.query("FETCH ALL c");
    console.log(res.rows);
  }
}

main();
