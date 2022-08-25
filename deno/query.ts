import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client({
    user: "MATERIALIZE_USER",
    database: "materialize",
    password: "APP_SPECIFIC_PASSWORD",
    hostname: "MATERIALIZE_HOST",
    port: 6875
})

const main = async ({ response }: { response: any }) => {
    try {
        await client.connect()
        const result = await client.queryObject("SELECT * FROM my_view")
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