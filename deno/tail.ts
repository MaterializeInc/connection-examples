import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client({
    user: "MATERIALIZE_USERNAME",
    database: "materialize",
    password: "APP_SPECIFIC_PASSWORD",
    hostname: "MATERIALIZE_HOST",
    port: 6875
})

const main = async ({ response }: { response: any }) => {
    try {
        await client.connect()

        await client.queryObject('BEGIN');
        await client.queryObject('DECLARE c CURSOR FOR TAIL countries');

        while (true) {
            const res = await client.queryObject('FETCH ALL c');
            console.log(res.rows);
        }
    } catch (err) {
        console.error(err.toString())
    } finally {
        await client.end()
    }
}

export { main }

// Call the main function
main({ response: {} })