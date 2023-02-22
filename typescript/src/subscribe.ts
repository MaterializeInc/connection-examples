// node 14+ cjs named exports not found in pg
import pkg from 'pg';
import State from './state';
const { Client } = pkg;

const client = new Client({
  user: "MATERIALIZE_USERNAME",
  database: "materialize",
  password: "APP_SPECIFIC_PASSWORD",
  host: "MATERIALIZE_HOST",
  port: 6875,
  ssl: true
});

interface CounterSum {
  sum: number;
}

async function main() {
  try {
    await client.connect();

    await client.query('BEGIN');
    await client.query('DECLARE c CURSOR FOR SUBSCRIBE (SELECT sum FROM counter_sum) WITH (PROGRESS);');

    let updated = false;
    const state = new State<CounterSum>();

    // Loop indefinitely
    while (true) {
      const { rows } = await client.query('FETCH ALL c');
      rows.forEach(row => {
        // Map row fields
        const {
          mz_timestamp: ts,
          mz_progressed: progress,
          mz_diff: diff,
          ...rowData
         } = row;

        //  When a progress is detected, get the last values
        if (progress) {
          if (updated) {
            updated = false;
            console.log(state.getValues());
          }
        } else {
          // Update the state with the last data
          updated = true;
          try {
              state.update({
                  value: rowData,
                  diff: Number(diff),
              }, Number(ts));
          } catch (err) {
            console.error(err);
          }
        }
      });
    }
  } catch (e) {
    console.log("error: ", e);
  } finally {
    client.end(); // only on error
  }
}

await main();