use std::{thread::sleep, time::Duration};

use crate::connection::create_client;

/// Run a tail over the PUBNUB materialized view
pub(crate) fn tail() {
    let mut client = create_client().expect("Error creating client.");
    let mut transaction = client.transaction().expect("Error creating transaction.");
    transaction.execute("DECLARE c CURSOR FOR TAIL (SELECT symbol, bid_price::text FROM market_orders) WITH (SNAPSHOT = false);", &[]).expect("Error creating cursor.");

    loop {
        let results = transaction.query("FETCH ALL c;", &[]).expect("Error running fetch.");
        for row in results {
            println!("{:} - {:}", row.get::<usize, String>(2), row.get::<usize, String>(3));
        }
        sleep(Duration::from_millis(200));
    }
}