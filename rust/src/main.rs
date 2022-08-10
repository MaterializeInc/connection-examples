use insert::insert;
use query::run_query;
use source::create_source;
use table::create_table;
use crate::views::create_materialized_view;
use tail::tail;

mod insert;
mod query;
mod source;
mod tail;
mod views;
mod connection;
mod table;


fn main() {
    create_source().expect("Error creating source.");
    println!("Source created.");
    create_materialized_view().expect("Error creating view.");
    println!("View created.");
    create_table().expect("Error creating table.");
    println!("Table created.");
    insert().expect("Error running insert.");
    println!("Data inserted.");

    println!("Running query: ");
    run_query();

    println!("Running tail: ");
    tail();
}
