const { Client } = require("pg");
const State = require("./state");

async function main() {
  const client = new Client({
    user: "joaquin@materialize.com",
    password: "mzp_fb1b51dd8ece4fb289a15d3050528dd146b82d53bff94e3a98530607350b40ef",
    host: "4eylxydzhfj2ef3sblalf5h32.us-east-1.aws.materialize.cloud",
    port: 6875,
    database: "materialize",
    ssl: true,
  });
  await client.connect();

  await client.query("BEGIN");
  await client.query("DECLARE c CURSOR FOR SUBSCRIBE counter_sum WITH (PROGRESS)");


  let buffer = [];
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
        sum,
      } = row;

      //  When a progress is detected, get the last values
      if (progress) {
        if (buffer.length > 0) {
          try {
            state.update(buffer, ts);
          } catch (err) {
            console.error(err);
          } finally {
            console.log("State: ", state.getState());
            buffer.splice(0, buffer.length);
          }
        }
      } else {
          buffer.push({ value: { sum }, diff });
      }
    });
  }
}

main();
