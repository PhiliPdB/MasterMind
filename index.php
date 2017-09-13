<?php
// Reset color code
include('php/resetColors.php');
// Get the highscores
include('php/getHighscores.php');
 ?>
<!DOCTYPE html>
<html>
<head>
	<!-- Meta tags -->
	<?php require('metatags.html') ?>

	<title>Mastermind</title>

	<link rel="stylesheet" href="build/css/style.css">
	<link rel="import" href="https://www.polymer-project.org/1.0/components/paper-ripple/paper-ripple.html">

	<!-- Favicon setup -->
	<?php include('favicons.php'); ?>
</head>
<body>
	<div id="board">
		<div id="rows">
			<!-- Rows where you can guess the code -->
			<?php
			$attempt_rows = 12;
			for ($i=0; $i < $attempt_rows; $i++) {
				echo "<div id=\"row_" . $i . "\" class=\"row\">";
				echo "<div class=\"attempt_number\">" . ($attempt_rows - $i) . "</div>";
				// Put the pin holes here
				for ($j=0; $j < 4; $j++) {
					echo "<div id=\"hole_" . $j . "\" class=\"hole\"></div>";
				}
				echo "<div class=\"little_holes\">";
				for ($j=0; $j < 4; $j++) {
					echo "<div id=\"little_hole_" . $j . "\" class=\"little hole\"></div>";
				}
				echo "</div>";
				// The check svg
				echo "<div class=\"svg_box\">";
				echo "<svg class=\"check\" onclick=\"checkColors()\" height=\"40\" viewBox=\"0 0 24 24\" width=\"40\" xmlns=\"http://www.w3.org/2000/svg\">";
				echo "<path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z\"/>";
				echo "</svg>";
				echo "<svg class=\"spinner\" width=\"40px\" height=\"40px\" viewBox=\"0 0 66 66\" xmlns=\"http://www.w3.org/2000/svg\">";
				echo "<circle class=\"path\" fill=\"none\" stroke-width=\"6\" stroke-linecap=\"round\" cx=\"33\" cy=\"33\" r=\"30\"></circle>";
				echo "</svg>";
				echo "</div>";

				echo "</div>";
			}
			 ?>
		</div>
		<div id="right">
			<!-- Highscores table -->
			<table id="highscores">
				<thead>
					<tr>
						<th></th>
						<th>Name</th>
						<th>Score</th>
					</tr>
				</thead>
				<tbody>
					<?php
					for ($i=1; $i <= sizeof($scores); $i++) {
						echo "<tr>";
						echo "<td>$i</td>";
						foreach ($scores[$i-1] as $key => $value) {
							echo "<td>$value</td>";
						}
						echo "</tr>";
					}
					 ?>
				</tbody>
			</table>

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
	</div>

	<div id="dimmer"></div>
	<div id="lose" class="box">
		<p>You lost, mate.</p>
		<div class="button raised" onclick="resetBoard(); hideLose();">
			<div class="center" fit>Try again</div>
			<paper-ripple fit></paper-ripple>
		</div>
	</div>
	<div id="win" class="box">
		<p>
			You won and got <span id="score"></span> points!
		</p>
		<div id="upload_high_score">
			<div class="group">
				<input type="text" required id="nickname" maxlength="20" value="<?=isset($_COOKIE['nickname']) ? $_COOKIE['nickname']:"" ?>">
				<span class="highlight"></span>
				<span class="bar"></span>
				<label>Nickname</label>
			</div>
			<div class="button raised" onclick="uploadHighScore(); hideWin(); resetBoard();">
				<div class="center" fit>Submit score</div>
				<paper-ripple fit></paper-ripple>
			</div>
		</div>
		<div class="button raised" onclick="resetBoard(); hideWin();">
			<div class="center" fit>Try again</div>
			<paper-ripple fit></paper-ripple>
		</div>
	</div>

	<!-- Include scripts -->
	<script src="build/js/script.js" type="text/javascript" charset="utf-8" async defer></script>
</body>
</html>
