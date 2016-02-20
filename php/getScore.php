<?php 
require("calculateScore.php");
require('mySession.php');

my_session_start();

echo json_encode(array("score" => calculate_score($_SESSION['attempts'], $_SESSION['black'], $_SESSION['white'])));
 ?>