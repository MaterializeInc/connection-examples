<?php
// Include the Postgres connection details
require 'connection.php';

$sql = "CREATE SOURCE market_orders_raw_2 FROM PUBNUB
            SUBSCRIBE KEY 'sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe'
            CHANNEL 'pubnub-market-orders'";

$statement = $connection->prepare($sql);
$statement->execute();

$sources = "SHOW SOURCES";
$statement = $connection->query($sources);
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
var_dump($result);