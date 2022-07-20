// node 14+ cjs named exports not found in pg
import pkg from 'pg';
const { Client } = pkg;

const client = new Client('postgres://materialize@localhost:6875/materialize');

async function main() {
    try {
        await client.connect();
        const res = await client.query(
            `CREATE SOURCE market_orders_raw FROM PUBNUB
                SUBSCRIBE KEY 'sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe'
                CHANNEL 'pubnub-market-orders'`
            );
        console.log(res);
    } catch(e) {
        console.log("error: ", e);
    } finally {
        client.end();
    }
}

await main();