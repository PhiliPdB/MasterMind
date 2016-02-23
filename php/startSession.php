<?php
$timeout = 3600 * 24 * 2; // Two days
session_set_cookie_params($timeout);
ini_set('session.gc_maxlifetime', $timeout);

session_start();

if (!isset($_SESSION['CREATED'])) {
	$_SESSION['CREATED'] = time();
} else if (time() - $_SESSION['CREATED'] > 1800) {
	// session started more than 30 minutes ago
	session_regenerate_id(true);    // change session ID for the current session and invalidate old session ID
	$_SESSION['CREATED'] = time();  // update creation time
}
 ?>