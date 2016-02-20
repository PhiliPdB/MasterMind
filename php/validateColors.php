<?php 
require('mySession.php');

my_session_start();

$colors = [];
if (!array_key_exists('colors', $_SESSION) || !isset($_SESSION['colors'])) {
	while (sizeof($colors) < 4) {
		$randomNumber = intval(round(rand(0, 7)));
		$found = false;
		foreach ($colors as $color) {
			if ($color == $randomNumber) {
				$found = true;
				break;
			}
		}
		if (!$found) {
			$colors[] = $randomNumber;
		}
	}
	$_SESSION['colors'] = $colors;
	$_SESSION['attempts'] = 0;
	$_SESSION['black'] = 0;
	$_SESSION['white'] = 0;
} else {
	$colors = $_SESSION['colors'];
}

$currentInput = explode(',', $_POST['colors']);
$output = array(
	"white" => 0,
	"black" => 0
	);

for ($i=0; $i < 4; $i++) { 
	// First convert to int
	$currentInput[$i] = intval($currentInput[$i]);
	// Check for black
	if ($currentInput[$i] == $colors[$i]) {
		$output['black']++;
	} else if (in_array($currentInput[$i], $colors)) {
		$output['white']++;
	}
}

// Save scores to session
$_SESSION['black'] += $output['black'];
$_SESSION['white'] += $output['white'];
$_SESSION['attempts']++;

echo json_encode($output);
 ?>