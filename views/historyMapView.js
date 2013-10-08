var HistoryMapView = Backbone.View.extend({
    el: "#map-div-template-container",
    initialize: function()
    {
        var el = $(this.el);
        var tab_cont_height = el.parent().height();
        $("#map-container", el).height( tab_cont_height );
        this.initMap();
    },

    initMap: function()
    {
        var chart = this.global.chart;
        var chartFormID = chart.formID;

        if ( typeof chartFormID === "undefined" )
        {
            console.error("Please select atleast one form");
            return false;
        } else {
            console.log("global form ID", chartFormID);
        }
        
        if ( typeof this.map === "undefined" )
        {
            console.log("Map view init");
            var cloudmade = L.tileLayer('http://{s}.tile.cloudmade.com/86748be895564a97af91f107fa85d06e/997/256/{z}/{x}/{y}.png', {
                maxZoom: 17,
                attribution: '<a href="http://www.jotform.com/">JotForm</a> | Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
            });

            var latlng = L.latLng(51.505, -0.09);
            this.map = L.map('map-container', {center: latlng, zoom: 13, layers: [cloudmade]});
        }
        
        if ( typeof chart._chartData.formSubmissionsTemp[ chartFormID ] !== "undefined" )
        {
            var d = chart._chartData.formSubmissionsTemp[ chartFormID ];
            var arr = [];
            for( var x in d )
            {
                var ip = d[x].ip;
            }

        } else {
            console.log("global form data", chart._chartData.formSubmissionsTemp[ chartFormID ]);
        }
    }
});