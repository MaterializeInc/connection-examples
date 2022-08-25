<?php
// Include the Postgres connection details
require 'connection.php';

$sql = "CREATE SOURCE counter FROM LOAD GENERATOR COUNTER";

$statement = $connection->prepare($sql);
$statement->execute();

$sources = "SHOW SOURCES";
$statement = $connection->query($sources);
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
var_dump($result);