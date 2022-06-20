import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client('postgres://materialize@127.0.0.1:6875/materialize')

const main = async ({ response }: { response: any }) => {
    try {
        await client.connect()

        await client.queryObject(
            `CREATE SOURCE market_orders_raw FROM PUBNUB
                SUBSCRIBE KEY 'sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe'
                CHANNEL 'pubnub-market-orders'`
        );

        const result = await client.queryObject("SHOW SOURCES")
        console.log(result.rows)
    } catch (err) {
        console.error(err.toString())
    } finally {
        await client.end()
    }
}
export { main }

// Call the main function
main({ response: {} })