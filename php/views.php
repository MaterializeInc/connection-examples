<?php
// Include the Postgres connection details
require 'connection.php';

$sql = "CREATE VIEW market_orders_2 AS
            SELECT
                val->>'symbol' AS symbol,
                (val->'bid_price')::float AS bid_price
            FROM (SELECT text::jsonb AS val FROM market_orders_raw_2)";

$statement = $connection->prepare($sql);
$statement->execute();

$views = "SHOW VIEWS";
$statement = $connection->query($views);
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
var_dump($result);