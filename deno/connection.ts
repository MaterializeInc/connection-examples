import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client({
    user: "MATERIALIZE_USERNAME",
    database: "materialize",
    password: "APP_SPECIFIC_PASSWORD",
    hostname: "MATERIALIZE_HOST",
    port: 6875,
    ssl: true,
})

/*
    Alternatively, you can use the following syntax to connect to Materialize:
    const client = new Client('postgres://MATERIALIZE_USERNAME@MATERIALIZE_HOST:6875/materialize')
*/
const main = async ({ response }: { response: any }) => {
    try {
        await client.connect()
        /* Work with Materialize */
    } catch (err) {
        console.error(err);
        response.status = 500
        response.body = {
            success: false,
            msg: err.toString()
        }
    } finally {
        await client.end()
    }
}

export { main }

// Call the main function
main({ response: {} })