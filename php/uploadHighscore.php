<?php
require("connection.php");
require("calculateScore.php");

session_start();

$username = $connection->real_escape_string($_POST['username']);
$score = calculate_score($_SESSION['attempts'], $_SESSION['black'], $_SESSION['white']);

if (strlen($username) > 0 && strlen($username) <= 20 && $score > 0 && intval($_COOKIE['score']) < $score) {
	// Check if username already exists
	$username_check = $connection->query("SELECT * FROM `highscores` WHERE `nickname` = '$username'")->fetch_array();
	if (isset($username_check)) {
		$connection->query("DELETE FROM `highscores` WHERE `nickname` = '$username'");
	}
	// Upload highscore
	$connection->query("INSERT INTO `highscores` (`nickname`, `score`) VALUES ('$username', '$score')");
	setcookie("score", $score, time() + 3600 * 7 * 52, "/");
	setcookie("nickname", $username, time() + 3600 * 7 * 52, "/");
	$_COOKIE['score'] = $score;
	echo "uploaded";
}
$_COOKIE['nickname'] = $username;

 ?>