// node 14+ cjs named exports not found in pg
import pkg from 'pg';
const { Client } = pkg;

const client = new Client('postgres://materialize@localhost:6875/materialize');

// const createTable = 'CREATE TABLE countries (code text NOT NULL, name text NOT NULL);';
const text = 'INSERT INTO countries(code, name) VALUES($1, $2);';
const values = ['GH', 'GHANA'];

async function main() {
    try {
        await client.connect();
        const res = await client.query(text, values);
        console.log(res);
    } catch(e) {
        console.log("error: ", e);
    } finally {
        await client.end();
    }
}

await main();