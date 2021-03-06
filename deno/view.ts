import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client('postgres://materialize@127.0.0.1:6875/materialize')

const main = async ({ response }: { response: any }) => {
    try {
        await client.connect()

        await client.queryObject(
            `CREATE VIEW market_orders AS
                SELECT
                    val->>'symbol' AS symbol,
                    (val->'bid_price')::float AS bid_price
                FROM (SELECT text::jsonb AS val FROM market_orders_raw)`
        );

        const result = await client.queryObject("SHOW VIEWS")
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