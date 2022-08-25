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
        const res = await client.query(
            `CREATE SOURCE counter FROM LOAD GENERATOR COUNTER`
            );
        console.log(res);
    } catch(e) {
        console.log("error: ", e);
    } finally {
        client.end();
    }
}

await main();