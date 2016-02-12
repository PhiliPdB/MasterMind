<?php 
require("connection.php");

$scores = $connection->query("SELECT * FROM `highscores` ORDER BY `score` DESC LIMIT 10")->fetch_all();
 ?>