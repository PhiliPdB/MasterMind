<?php 
function calculate_score($attempt, $black, $white) {
	$output = 0;
	$attempt = -$attempt + 12;
	if ($attempt > 8) {
		$output = intval(round(-150 * sqrt($attempt) + 570));
	} else if ($attempt < 0) {
		$output = -100;
	} else {
		$output = intval(1.88 * pow($attempt, 2));
	}

	return $output + $white + 2 * $black;
}
 ?>