use postgres::Error;

use crate::connection::create_client;

/// Creates a load generator source
pub(crate) fn create_source() -> Result<u64, Error> {
    let mut client = create_client().expect("Error creating client.");

    client.execute(
        "
        CREATE SOURCE IF NOT EXISTS counter
        FROM LOAD GENERATOR COUNTER
        (TICK INTERVAL '500ms')
        WITH (SIZE = '3xsmall');
    ",
        &[],
    )
}
