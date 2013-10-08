var TabView = Backbone.View.extend({
    el: "#tabs-container",
    events:
    {
        'click .list-tabs': 'handleTabs'
    },
    initialize: function()
    {
        //init global var
        this._sHistory = {};
        Backbone.View.prototype.global = this._sHistory;

        this.tabsInit();
	},

    handleTabs: function(e)
    {
        var self = this;
        var el = $(e.target);

        //Remove any "active" class
        $("ul.tabs li").removeClass("active");

        //Add "active" class to selected tab
        el.parents('li').addClass("active");

        //Hide all tab content
        $(".tab_content").hide();

        //Find the href attribute value to identify the active tab + content
        var activeTab = el.find("a").context.hash;

        //Fade in the active ID content
        $(activeTab).fadeIn();

        self.handleClick( $(el) );

        return false;
    },

    handleClick: function(el)
    {
        console.log("handled click", el.attr('id'));
        var self = this;
        switch( el.attr('id') )
        {
            case 'history_chart':
                if ( typeof self.chartLoaded === "undefined" ) {
                    console.log("Chart loaded successfully");
                    self._sHistory.chart = new HistoryChartView();
                    self.chartLoaded = true;
                }
            break;
            case 'history_map':
                if ( typeof self.mapLoaded === "undefined" ) {
                    console.log("Map loaded successfully");
                    self._sHistory.map = new HistoryMapView();
                    self.mapLoaded = true;
                } else {
                    self.global.map.initMap();
                }
            break;
        }
    },

    tabsInit: function()
    {
        //Hide all tab contents
        $(".tab_content").hide();

        //Activate first tab
        $("ul.tabs li:first").addClass("active").show();

        //Show first tab content
        $(".tab_content:first").show();

        //initialize first tab
        this.handleClick( $("ul.tabs li:first a.list-tabs") );        
    }
});