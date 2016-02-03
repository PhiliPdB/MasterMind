<?php 
session_start([
	"read_and_close" => true,
]);

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

echo json_encode(array("score" => calculate_score($_SESSION['attempts'], $_SESSION['black'], $_SESSION['white'])));
 ?>