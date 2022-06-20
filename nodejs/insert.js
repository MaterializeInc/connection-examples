const { Client } = require('pg');
const client = new Client('postgres://materialize@localhost:6875/materialize');

const text = 'INSERT INTO countries(code, name) VALUES($1, $2);';
const values = ['GH', 'GHANA'];

async function main() {
    await client.connect();
    const res = await client.query(text, values);
    console.log(res);
}

main();