
var _jFCharts = {
    init: function()
    {
        $("#integrate_now-btn").click(function(){
            $(this).parents("#application_landing").slideUp('fast', function(){
                $(this).remove();
            });
        });

        var historyView = new HistoryChartView();
        // var tabView = new TabView();
    }
};

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(function(){

    //initialize app name
    JF.init({
        enableCookieAuth : true,
        appName: "Submissions-History-Chart"
    });
    
    if ( !JF.getAPIKey() )
    {
        JF.login(function(){
            _jFCharts.init();
        });
    }
    else
    {
        _jFCharts.init();
    }

    // JF.initialize( {apiKey: "76d37e1b759fcbe67063a39166747301"} );
    // JF.initialize( {apiKey: "1c4efba0d67e0e77aee4dee551b4259f"} );
    // _jFCharts.init();
});

$(document).ready();