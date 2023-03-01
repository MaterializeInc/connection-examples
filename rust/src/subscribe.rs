use std::{thread::sleep, time::Duration};

use rust_decimal::{prelude::ToPrimitive, Decimal};

use crate::{
    connection::create_client,
    state::{State, Update},
};

#[derive(Hash, Eq, PartialEq, Debug, Clone)]
struct Sum {
    sum: Decimal,
}

/// Run a subscribe over the materialized view
pub(crate) fn subscribe() {
    let mut client = create_client().expect("Error creating client.");
    let mut transaction = client.transaction().expect("Error creating transaction.");
    transaction
        .execute(
            "DECLARE c CURSOR FOR SUBSCRIBE (SELECT sum FROM counter_sum) WITH (PROGRESS);",
            &[],
        )
        .expect("Error creating cursor.");
    let display_history = false;
    let mut state: State<Sum> = State::new(display_history);
    let mut buffer: Vec<Update<Sum>> = Vec::new();

    loop {
        let results = transaction
            .query("FETCH ALL c;", &[])
            .expect("Error running fetch.");
        for row in results {
            let ts = row.get::<_, Decimal>("mz_timestamp").to_i64().unwrap();
            let progress = row.get::<_, bool>("mz_progressed");

            if progress {
                // Update the state
                state.update(buffer.clone(), ts).unwrap();

                // Display new state:
                println!("State: {:?}", state.get_state());
                if (display_history) {
                    println!("History: {:?}", state.get_history());
                }

                // Clear the buffer
                buffer.clear();
            } else {
                let diff = row.get::<_, Option<i64>>("mz_diff").unwrap();
                let sum = row.get::<_, Option<Decimal>>("sum").unwrap();
                buffer.push(Update {
                    value: Sum { sum },
                    diff,
                })
            }
        }
        sleep(Duration::from_millis(200));
    }
}
