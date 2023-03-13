use openssl::ssl::{SslConnector, SslMethod, SslVerifyMode};
use postgres::{Client, Error};
use postgres_openssl::MakeTlsConnector;

/// Create a client using localhost
pub(crate) fn create_client() -> Result<Client, Error> {
    let mut builder = SslConnector::builder(SslMethod::tls()).expect("Error creating builder.");
    builder.set_verify(SslVerifyMode::NONE);
    let connector = MakeTlsConnector::new(builder.build());

    let config = "postgres://materialize@localhost:6875/materialize?sslmode=require";
    Client::connect(config, connector)
}

// ----------------------------------
// Alternative way to create a client
// ----------------------------------
// pub(crate) fn create_client_with_config() -> Result<Client, Error> {
// let mut builder = SslConnector::builder(SslMethod::tls()).expect("Error creating builder.");
// builder.set_verify(SslVerifyMode::NONE);
// let connector = MakeTlsConnector::new(builder.build());

// Config::new()
//     .host("localhost")
//     .port(6875)
//     .dbname("materialize")
//     .user("materialize")
//     .connect(connector)
// }
