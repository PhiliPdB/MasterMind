<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Mastermind</title>
	<link rel="stylesheet" href="css/style.css">
</head>
<body>
	<div id="board">
		<!-- Row with the solution -->
		<div id="solution" class="row"></div>
		<!-- Rows where you can guess the code -->
		<?php 
		for ($i=0; $i < 12; $i++) { 
			echo "<div id=\"row_" . $i . "\" class=\"row\">\n";
			echo "<div class=\"attempt_number\">" . (12 - $i) . "</div>";
			// Put the pin holes here
			for ($j=0; $j < 4; $j++) {
				echo "<div id=\"hole_" . $j . "\" class=\"hole\"></div>\n";
			}
			echo "</div>\n";
		}
		 ?>
		<!-- Color selection -->
		<div id="colors">
			<!-- Different colors you can choose -->
			<?php 
			for ($i=0; $i < 8; $i++) { 
				echo "<div id=\"color_" . $i . "\" class=\"color\"></div>";
			}
			 ?>
		</div>
	</div>

	<!-- Include scripts -->
	<script src="js/script.js" type="text/javascript" charset="utf-8" async defer></script>
</body>
</html>