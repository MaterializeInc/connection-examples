import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client('postgres://materialize@127.0.0.1:6875/materialize')

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