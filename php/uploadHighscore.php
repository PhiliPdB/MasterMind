<?php
require("connection.php");
require("calculateScore.php");
require("startSession.php");

$username = $connection->real_escape_string($_POST['username']);
$score = calculate_score($_SESSION['attempts'], $_SESSION['black'], $_SESSION['white']);

if (strlen($username) > 0 && strlen($username) <= 20 && $score > 0) {
	// Check if username already exists
	$username_check = $connection->query("SELECT * FROM `highscores` WHERE `nickname` = '$username'")->fetch_array();
	if (isset($username_check)) {
		// Look for score
		$db_score = $connection->query("SELECT `score` FROM `highscores` WHERE `nickname` = '$username'")->fetch_array();
		if (intval($db_score[0]) < $score) {
			// Update score
			$connection->query("UPDATE `highscores` SET `score` = $score WHERE `nickname` = '$username'");
			echo "Updated";
		}
	} else {
		// Upload highscore
		$connection->query("INSERT INTO `highscores` (`nickname`, `score`) VALUES ('$username', $score)");
		echo "Uploaded";
	}
}
// Set nickname cookie
setcookie("nickname", $username, time() + (3600 * 24 * 7 * 52), "/");
$_COOKIE['nickname'] = $username;

 ?>