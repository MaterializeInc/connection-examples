<?php
// Include the Postgres connection details
require 'connection.php';

// Begin a transaction
$connection->beginTransaction();
// Declare a cursor
$statement = $connection->prepare('DECLARE c CURSOR FOR TAIL demo');
// Execute the statement
$statement->execute();

/* Fetch all of the remaining rows in the result set */
while (true) {
    $tail = $connection->prepare('FETCH ALL c');
    $tail->execute();
    $result = $tail->fetchAll(PDO::FETCH_ASSOC);
    print_r($result);
}