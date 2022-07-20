// node 14+ cjs named exports not found in pg
import pkg from 'pg';
const { Client } = pkg;

// or annoyingly, 
// import pg from 'pg'
// new pg.Client(...)

const client = new Client('postgres://materialize@localhost:6875/materialize');

async function main() {
    try {
        await client.connect();

        /* Work with Materialize */
    } catch(e) {
        console.log("error: ", e);
    } finally {
        await client.end();
    }
}

await main();