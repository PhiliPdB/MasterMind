<?php 
require("calculateScore.php");
require('startSession.php');

echo json_encode(array("score" => calculate_score($_SESSION['attempts'], $_SESSION['black'], $_SESSION['white'])));
 ?>