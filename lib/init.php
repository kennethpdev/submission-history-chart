<?php
    // print_r( $_SERVER );
    define("MODE", ( $_SERVER['HTTP_HOST'] === 'localhost' ) ? 'dev' : 'live');
    define("BASE_URL", (MODE==="dev") ? '/submissions-history-chart/' : '/');
    define("HTTP_URL", "http" . (($_SERVER['SERVER_PORT']==443) ? "s://" : "://") . $_SERVER['HTTP_HOST'] . BASE_URL);
    define('ROOT_DIR', realpath(__DIR__.'/../') . DIRECTORY_SEPARATOR);
    define("SCRIPT_DIR", ROOT_DIR . "js/");

    // if ( MODE === "live" )
    // {
    //     include( __DIR__ . "/php-closure.php");

    //     $scriptsListTop = array(
    //         ROOT_DIR . "canvas/canvg.js",
    //         ROOT_DIR . "canvas/rgbcolor.js",
    //         ROOT_DIR . "canvas/grChartImg.js",
    //         ROOT_DIR . "js/libraries.js",
    //         ROOT_DIR . "js/calendarview.js"
    //     );

    //     $scriptsListViews = ROOT_DIR . "views/";

    //     $scriptsListBottom = array(
    //         ROOT_DIR . "js/application.js"
    //     );

    //     $c = new PhpClosure();
    //     $c->addFromArray($scriptsListTop)
    //     ->addDir($scriptsListViews)
    //     ->addFromArray($scriptsListBottom)
    //     ->hideDebugInfo()
    //     ->setLanguageECMA("ECMASCRIPT5")
    //     ->setCacheName('scripts-min')
    //     ->cacheDir(SCRIPT_DIR)
    //     ->write(false);
    // }

?>