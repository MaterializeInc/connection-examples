use postgres::Error;

use crate::connection::create_client;

/// Creates a materialized view over the source
pub(crate) fn create_materialized_view() -> Result<u64, Error> {
    let mut client = create_client().expect("Error creating client.");

    client.execute(
        "
        CREATE MATERIALIZED VIEW IF NOT EXISTS counter_sum AS
        SELECT sum(counter)
        FROM counter;`
    ",
        &[],
    )
}
