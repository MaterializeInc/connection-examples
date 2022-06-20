const { Client } = require('pg');
const client = new Client('postgres://materialize@localhost:6875/materialize');

async function main() {
    await client.connect();
    const res = await client.query(
        `CREATE SOURCE market_orders_raw_2 FROM PUBNUB
            SUBSCRIBE KEY 'sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe'
            CHANNEL 'pubnub-market-orders'`
        );
    console.log(res);
}

main();