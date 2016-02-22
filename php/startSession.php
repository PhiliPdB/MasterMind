<?php
$timeout = 3600 * 24;
session_set_cookie_params($timeout);
ini_set('session.gc_maxlifetime', $timeout);

session_start();
 ?>