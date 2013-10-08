<?php
    
    require_once(__DIR__ . "/init.php");

    $header = '
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="keywords" content="jotform, submissions, history chart, submission chart, chart, jotform chart, submission history chart" />
        <meta name="description" content="Get better insights of your form data with a historical chart with date ranges and sorting options. With better data analysis of your forms, you\'ll be able to see patterns and optimization strategies for your forms." />
        <meta name="google-site-verification" content="CG6F2CQMNJ3nvu1pdPuN7Ww_YcG1-0cMc06ntbB12wk" />
        <meta property="og:title" content="Submission History Chart" />
        <meta property="og:description" content="Get better insights of your form data with a historical chart with date ranges and sorting options. With better data analysis of your forms, you\'ll be able to see patterns and optimization strategies for your forms." />
        <meta property="og:image" content="http://cms.interlogy.com/uploads/image_upload/image_upload/global/9260_150X150.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://subhistory.jotform.io/" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="http://subhistory.jotform.io/" />
        <meta name="twitter:title" content="Submission History Chart" />
        <meta name="twitter:description" content="Get better insights of your form data with a historical chart with date ranges and sorting options. With better data analysis of your forms, you\'ll be able to see patterns and optimization strategies for your forms." />
        <meta name="twitter:image" content="http://cms.interlogy.com/uploads/image_upload/image_upload/global/9260_150X150.jpg" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <base href="' . HTTP_URL . '" />
    ';

    $styles = '
        <link rel="Shortcut Icon" href="' . HTTP_URL . 'css/images/favicon.ico" />
        <link rel="stylesheet" href="' . HTTP_URL . 'css/pure.css" type="text/css" media="screen, projection" />
        <link rel="stylesheet" href="' . HTTP_URL . 'css/stylesheet.css" type="text/css" media="screen, projection" />
        <link rel="stylesheet" href="' . HTTP_URL . 'css/tabs.css" type="text/css" media="screen, projection" />
        <link rel="stylesheet" href="' . HTTP_URL . 'css/calendarview.css" type="text/css" media="screen, projection" />
        <link rel="stylesheet" href="' . HTTP_URL . 'css/common-page-styles.css" type="text/css" media="screen, projection" />
    ';

    define("PAGE_HEAD", $header);
    define("PAGE_STYLES", $styles);
    define("PAGE_TITLE", "Submission History Chart");

?>