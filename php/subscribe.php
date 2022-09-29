<?php
// Include the Postgres connection details
require 'connection.php';

// Begin a transaction
$connection->beginTransaction();
// Declare a cursor
$statement = $connection->prepare('DECLARE c CURSOR FOR SUBSCRIBE demo');
// Execute the statement
$statement->execute();

/* Fetch all of the remaining rows in the result set */
while (true) {
    $subscribe = $connection->prepare('FETCH ALL c');
    $subscribe->execute();
    $result = $subscribe->fetchAll(PDO::FETCH_ASSOC);
    print_r($result);
}