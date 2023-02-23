const { Client } = require("pg");
const State = require("./state");

async function main() {
  const client = new Client({
    user: "MATERIALIZE_USERNAME",
    password: "MATERIALIZE_PASSWORD",
    host: "MATERIALIZE_HOST",
    port: 6875,
    database: "materialize",
    ssl: true,
  });
  await client.connect();

  await client.query("BEGIN");
  await client.query("DECLARE c CURSOR FOR SUBSCRIBE counter_sum WITH (PROGRESS)");


  let updated = false;
  const state = new State();

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
}

main();
