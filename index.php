<?php
    require_once("lib/header.php");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <?=PAGE_HEAD?>
    <title><?=PAGE_TITLE?></title>
    <?=PAGE_STYLES?>
</head>
<body>
	<!--[if lt IE 7]>
	    <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
	<![endif]-->
    <script type="text/template" id="submission-history-chart-template"></script>

    <div id="application_landing">
        <div class="slides-background">
            <header id="header">
                <div class="header">
                    <div class="header-content">
                        <a href="/" class="logo-link">
                            <img src="css/images/jotformDevLogo.png" alt="JotForm Developers">
                        </a>
                    </div>
                </div>
            </header>
            <div class="content-container">
                <div class="content">
                    <div class="banner-area">
                        <div class="banner-content">
                            <div class="title">Get better insights of your form data with a historical chart.</div>
                            <div class="banner-text">Historical chart with date ranges and sorting options. With better data analysis of your forms, you'll be able to see patterns and optimization strategies for your forms.</div>
                        </div>
                        <div class="visual">
                            <p><img src="css/images/submission_history.jpg" alt=""></p>
                        </div>
                        <div class="integrate_btn">
                            <button class="pure-button pure-button-success" id="integrate_now-btn">Integrate Now!</button>  </div>
                    </div>
                </div>
            </div>
            <footer class="footer" id="footer">
                <div class="tm">
                    <span>Powered by </span>
                    <span><a href="http://www.jotform.com">JotForm</a></span>
                    <span class="app-g"><a href="http://apps.jotform.com">JotForm Apps</a></span>
                </div>
            </footer>
        </div>
    </div>
    <div id="history-chart-mainContainer">
        <div class="widget" style="width:100%;" id="historyChart">
            <div class="widget-header"><h2>Submission History</h2></div>
            <div class="widget-content" id="mainContent"> 
                <div class="main-sHContainer" id="main-sHContainer">
                    <div class="sHContainer" id="tabs-container">
                        <div id="history_chart_tab" class="chart_content">
                            <div id="chart-div-template">
                                <div class="sHContainer" id="chartContainer"><div id="chart_history_div"></div></div>
                                <div class="sHContainer hiddenElem" id="totalSubmission">
                                    <b>Highest submissions: </b><span class="counts"><b class="highestCounts"></b> - From <span class="totalDates _highestCountDate"></span></span><br />
                                    <b>Total submissions: </b> <span class="counts"><b class="totalCounts"></b> - From <span class="totalDates _fromRange"></span> to <span class="totalDates _toRange"></span></span>
                                    <br/><br/>
                                    <span id="dl_chart_image" class="dl_links">Get Chart Image</span><br/>
                                    <span id="dl_chart_csv" class="dl_links">Get Chart CSV</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sHContainer" id="navigation">
                    <div class="">
                        <button id="formList" class="pure-button pure-button-primary" style="width: 250px;">Pick your Form</button>
                    </div>
                    <input type="hidden" id="chartType" value="areaChart" />
                    <div class="" style="margin-top: 10px;">
                        <label>Show history from a specific Date range. Or check <i>"All Dates"</i> to display them all.</label><br/>
                        <label class="sHlabel-mini">From: </label><input type="text" id="date-input-1" class="rangeInputs prettyInputs" />
                        <label class="sHlabel-mini">To: <input type="text" id="date-input-2" class="rangeInputs prettyInputs" />
                        <label class="sHlabel-mini">All Dates: <input type="checkbox" id="allDates" checked/>
                    </div>
                    <div style="margin-top: 10px;">
                        <button name="button" id="getFormSubmissions" class="pure-button pure-button-success" disabled="disabled" style="width: 250px;">Display History</button>
                        <div class="error-notifier"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript" src="http://js.jotform.com/JotForm.js?3.1.{REV}"></script>
    <script type="text/javascript" src="http://js.jotform.com/FormPicker.min.js?3.1.{REV}"></script>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
<!--[if lt IE 9]><script type="text/javascript" src="canvas/flashcanvas.js"></script><![endif]-->
<?php if ( MODE === "live" || MODE === 'dev' ) { ?>
    <script type="text/javascript" src="canvas/canvg.js"></script>
    <script type="text/javascript" src="canvas/rgbcolor.js"></script>
    <script type="text/javascript" src="canvas/grChartImg.js"></script>   

    <script type="text/javascript" src="js/libraries.js"></script>
    <script type="text/javascript" src="js/calendarview.js"></script>

    <script type="text/javascript" src="views/historyChartView.js"></script>
    <script type="text/javascript" src="views/historyMapView.js"></script>
    <script type="text/javascript" src="views/miscView.js"></script>
    <script type="text/javascript" src="views/tabView.js"></script>

    <script type="text/javascript" src="js/application.js"></script>
<?php } else { ?>
    <script type="text/javascript" src="<?=HTTP_URL?>scripts/scripts-min.js"></script>
<?php } ?>
    <!-- Google Analytics Code -->
    <script type="text/javascript">

          var _gaq = _gaq || [];
          _gaq.push(['_setAccount', 'UA-1170872-7']);
          _gaq.push(['_setDomainName', 'jotform.com']);
          _gaq.push(['_setAllowLinker', true]);
          _gaq.push(['_trackPageview']);

          (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
          })();

     </script>
</body>
</html>
