<?php
$connection = new mysqli("localhost", "root", "root", "highscores");
if ($connection->connect_errno) {
	printf("Connection failed: %s \n", $connection->connect_error);
	exit();
}
$connection->set_charset("utf8");

 ?>