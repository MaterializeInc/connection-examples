const { Client } = require('pg');

const client = new Client({
    user: "MATERIALIZE_USERNAME",
    password: "MATERIALIZE_PASSWORD",
    host: "MATERIALIZE_HOST",
    port: 6875,
    database: 'materialize',
    ssl: true
});

/*
    Alternatively, you can use the following syntax:
    const client = new Client('postgres://materialize@localhost:6875/materialize');
*/

async function main() {
    try {
        await client.connect();
        console.log('Connected to Materialize');

        // Work with Materialize
        // For example:
        // const res = await client.query('SELECT * FROM your_table');
        // console.log(res.rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
        console.log('Disconnected from Materialize');
    }
}

main();
