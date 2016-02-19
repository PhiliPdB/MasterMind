<?php 
require("calculateScore.php");

session_start();

echo json_encode(array("score" => calculate_score($_SESSION['attempts'], $_SESSION['black'], $_SESSION['white'])));
 ?>