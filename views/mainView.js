var MainView = Backbone.View.extend({
    el: "#history-chart-mainContainer",
    events:
    {
        'click #getFormSubmissions': 'getFormSubmissionsEvt',
        'change #userFormsList' : 'getFormSubmissionsEvt',
        'click #allDates': 'getFromAllDates',
    },

    initialize: function()
    {
        this.HCV = new HistoryChartView();
    },

    getFormSubmissionsEvt: function()
    {
        this.HCV.getFormSubmissionsEvt();
    },

    getFormSubmissionsEvt: function()
    {
        this.HCV.getFormSubmissionsEvt();
    },

    getFromAllDates: function()
    {
        this.HCV.getFromAllDates();
    }
});