<?php 
require('mySession.php');

my_session_start();

session_unset();
session_destroy();

 ?>