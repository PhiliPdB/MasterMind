<?php 
function my_session_start($timeout = 1440) {
    ini_set('session.gc_maxlifetime', $timeout);
    session_start();

    if (isset($_SESSION['timeout_idle']) && $_SESSION['timeout_idle'] < time()) {
        $temp = $_SESSION;
        session_destroy();
        session_start();
        session_regenerate_id();
        $_SESSION = $temp;
    }

    $_SESSION['timeout_idle'] = time() + $timeout;
}

 ?>