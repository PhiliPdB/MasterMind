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
		<div id="solution" class="row"></div>
			<?php 
			for ($i=0; $i < 12; $i++) { 
				echo "<div id=\"row_" . $i . "\" class=\"row\">";
				echo "</div>";
			}
			 ?>
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