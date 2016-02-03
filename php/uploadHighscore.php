<?php
require("connection.php");

session_start();

$username = $connection->real_escape_string($_POST['username']);
$score = calculate_score($_SESSION['attempts'], $_SESSION['black'], $_SESSION['white']);

if (strlen($username) > 0 && strlen($username) <= 20 && $score > 0 && $_COOKIE['score'] < $score) {
	// Check if username already exists
	$username_check = $connection->query("SELECT * FROM `highscores` WHERE `nickname` = '$username'")->fetch_array();
	if (isset($username_check)) {
		$connection->query("DELETE FROM `highscores` WHERE `nickname` = '$username'");
	}
	// Upload highscore
	$connection->query("INSERT INTO `highscores` (`nickname`, `score`) VALUES ('$username', '$score')");
	setcookie("score", $score, time() + 3600 * 7 * 52);
}

function calculate_score($attempt, $black, $white) {
	$output = 0;
	$attempt = -$attempt + 12;
	if ($attempt > 7) {
		$output = intval(round(-150 * sqrt($attempt) + 510));
	} else if ($attempt < 0) {
		$output = -100;
	} else {
		$output = intval(1.88 * pow($attempt, 2));
	}

	return $output + $white + 2 * $black;
}

 ?>