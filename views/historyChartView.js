var HistoryChartView = Backbone.View.extend({
    el: "#history-chart-mainContainer",
    events:
    {
        'click #getFormSubmissions': 'getFormSubmissionsEvt',
        'click #formList': 'pickForm',
        'click #allDates': 'getFromAllDates',
        'click #dl_chart_image': 'getChartImage',
        'click #dl_chart_csv': 'getChartCSV'
    },
    /**
     * Constructor
     */
    initialize: function()
    {
        //get misc view
        this.misc = new miscView();

        //use template
        // $(this.el).html(_.template($("#submission-history-chart-template").html()));

        //build chart data object
        this._chartData = {
            chart: null,                            //chart object
            totalSubmissions: 0,                    //shows how many submission within a range
            formSubmissionsTemp: {},                //use for form data caching
            enableCacheSubmissions: true,           //enable/disable form data caching
            dataTableObj: new google.visualization.DataTable()  //datatable that holds the data to be printed on the chart
        };

        //elements data object
        this._elem = {
            mainContainer_el: $("#mainContent"),    //mainContent
            formSelected_el: $("#userFormsList"),   //list of forms
            chartType_el: $("#chartType"),          //chart element
            rangeFrom_el: $("#date-input-1"),       //range From elem
            rangeTo_el: $("#date-input-2"),         //range To elem
            allDates_el: $("#allDates")             //all dates elem
        };

        this.setDefaults();
    },

    /**
     * Set some defaults when initializing chart history
     */
    setDefaults: function()
    {
        var self = this;

        //set default time range
        self.getFromAllDates();

        //limit per request - default is 1000
        self.maximumRequestLimit = 1000;

        //maximum data to fetch from the server if submission counts is greater than maximumRequestLimit - default 10000
        self.maximumRequest = 10000;

        //set google chart defaults
        self.chartDivElement = "chart_history_div";
        self._elem.chart_el = document.getElementById(self.chartDivElement);
        self._chartData.chart = new google.visualization.AreaChart( self._elem.chart_el );

        self.column1Title = "Submission Date";
        self.column2Title = "Submission Counts";

        //default columns
        self._chartData.dataTableObj.addColumn('date', self.column1Title);
        self._chartData.dataTableObj.addColumn('number', self.column2Title);

        //horizontal Axis options
        self.hAxisOptions = {
            title: "Submission Date",
            titleTextStyle: {color: 'red'},
            gridlines: {color: '#ccc', count: -1},
            minorGridlines: {color: '#eee', count: 3}
        };

        //vertical Axis options
        self.vAxisOptions = {
            title: "Submissions Counts",
            titleTextStyle: {color: 'red'},
            gridlines: {color: '#eee', count: -1}
        };

        //main options of the chart
        self.mainOptions = {
            width: '100%',
            height: 500,
            chartArea: {
                top: 50,
                bottom: 0
            },
            animation: {
                duration: 500,
                easing: 'out'
            },
            legend: {
                position: 'top',
                alignment: 'end'
            },
            pointSize: 5,
            vAxis: self.vAxisOptions,
            hAxis: self.hAxisOptions,
            slantedText: true
        };
    },

    pickForm: function()
    {
        console.log("Pick form");
        var self = this;

        JF.FormPicker({
            title: 'Pick your Form',
            showPreviewLink: true,
            sort: 'created_at',
            sortType: 'DESC',
            multiSelect: false,
            onSelect: function(r) {
                var selectedFormObj = r[0];
                
                self.formID = selectedFormObj.id;
                self.formTitle = selectedFormObj.title;
                self.submissionCount = selectedFormObj.count;

                $("#getFormSubmissions", self.$el).removeAttr('disabled');

            }
        });
    },

    /**
     * Get all submission from an specific form
     * @param formID - the form ID on where to get all forms
     * @param submissionCount - how many submission does the form have
     * @param next - callback after all forms has been fetched
     */
    getFormSubmissions: function( formID, submissionCount, next )
    {
        var self = this;

        function getData(a, next)
        {
            var dataFormatted = {};

            for( var i in a )
            {
                var data = a[i];
                var date = self.getOnlyDate( data['created_at'] );

                //count how many submissions each date
                dataFormatted[date] = ( dataFormatted.hasOwnProperty( date ) ) ? dataFormatted[date]+1 : 1;
            }

            //call callback(instance, formatted array data, all objects)
            next.call(self, dataFormatted, a);
        };

        //get data from cache if any to lessen load times
        if ( self._chartData.enableCacheSubmissions && self._chartData.formSubmissionsTemp[ formID ] )
        {
            getData(self._chartData.formSubmissionsTemp[ formID ], next);
        }
        else
        {
            var maxLimit = self.maximumRequestLimit;
            if ( submissionCount > maxLimit && confirm("Large form submissions may take a while.\nPress OK to continue, otherwise load the first 1000 submissions.") )
            {
                //show loading indicator
                self.misc.showStart( self._elem.mainContainer_el );

                self.multipleRequestStart = 1;
                var submissionMultipleAjax = function(self, submissionCount, maxLimit, formID)
                {
                    var offset = ( ( self.multipleRequestStart - 1 ) * ( maxLimit ) );
                    var totalRequest = Math.ceil( ( submissionCount > self.maximumRequest ? self.maximumRequest : submissionCount ) / maxLimit );

                    // console.log('come n', self.multipleRequestStart, "offset", offset);
                    if ( self.multipleRequestStart <= totalRequest )
                    {
                        self.misc.modifyLoading(self.multipleRequestStart+"/"+totalRequest);

                        //get data from the server
                        JF.getFormSubmissions(formID, {
                            offset: offset,
                            limit: maxLimit
                        }, function(a){
                            //increment counter for next request
                            self.multipleRequestStart++;

                            //save data
                            if ( self._chartData.formSubmissionsTemp[ formID ] )
                            {
                                self._chartData.formSubmissionsTemp[ formID ] = self.misc.array_merge( self._chartData.formSubmissionsTemp[ formID ], a);
                            }
                            else
                            {
                                self._chartData.formSubmissionsTemp[ formID ] = a;
                            }

                            //do another request
                            submissionMultipleAjax(self, submissionCount, maxLimit, formID);
                        }, function error(){
                            self.errorMsg("Something went wrong fetching form submissions");
                        });
                    }
                    else
                    {
                        // console.log("Request reached", self.multipleRequestStart, totalRequest);
                        // console.log("formsubmissionTemp", self._chartData.formSubmissionsTemp[ formID ]);
                        getData( self, self._chartData.formSubmissionsTemp[ formID ], function(e){
                            self._chartData.dataTable = self.objectToDataTable( e );
                            self.buildChart();
                        });
                    }
                };

                //get data in parts
                submissionMultipleAjax(self, submissionCount, maxLimit, formID);
            }
            else
            {
                //show loading indicator
                self.misc.showStart( self._elem.mainContainer_el );

                // console.log('none', submissionCount);
                JF.getFormSubmissions(formID, {
                    offset: 0,
                    limit: submissionCount
                }, function(a){
                    console.log(a);

                    if ( a.length == 0 ) {
                        return self.errorMsg("No submissions available to be shown");
                    }

                    self._chartData.formSubmissionsTemp[ formID ] = a;
                    getData( a, next );
                }, function error(){
                    return self.errorMsg("Something went wrong fetching form submissions");
                });
            }
            // JF.getFormSubmissions(formID, function(a){
            //     self._chartData.formSubmissionsTemp[ formID ] = a;
            //     getData(self, self._chartData.formSubmissionsTemp[ formID ], next);
            // });
        }
    },

    /**
     * Extract the MM/DD/YYYY from a date string
     * such as MM-DD-YYYY HH:MM:SS
     * @param date - date string on where to extract
     */
    getOnlyDate: function( date )
    {
        var d = date.split(" ")[0];
        var a = d.split('-');
        return a[1]+'/'+a[2]+'/'+a[0];
    },

    /**
     * Set what chart is going to use
     * @param charElem - element that contains what chart is going to use
     */
    setChartType: function( chartElem )
    {
        var chartText = chartElem.text();

        this._chartData.chartType = chartElem.val();

        return this;
    },

    /**
     * Set the default range for the calendar pickers
     */
    setDefaultTimeRange: function()
    {
        //remove previous calendar if any to avoid bugs
        if (  $(".calendar.popup").length > 0 )
        {
            $(".calendar.popup").each(function(){
                $(this).remove();
            });
        }

        //modify default ranges and set them as calendarview
        var l = this.misc.getLastWeek();
        this._elem.rangeFrom_el.val( l.lastWeekFull ).removeAttr('disabled').calendar({dateFormat: '%m/%d/%Y', defaultDate: l.lastWeekFull });
        
        this._elem.rangeTo_el.val( l.todayFull ).removeAttr('disabled').calendar({dateFormat: '%m/%d/%Y', defaultDate: l.todayFull });
    },

    /**
     * Set the time range on what to fetch from submissions
     * @param range1 - element that contains the rangeFrom
     * @param range2 - element that contains the rangeTo
     */
    getTimeRange: function( range1, range2 )
    {
        //check if "All Dates" option was checked
        if ( this._elem.allDates_el.is(":checked") )
        {
            this._elem.rangeFrom_el.val('').attr('disabled', true);
            this._elem.rangeTo_el.val('').attr('disabled', true);
        }

        this._chartData.rangeFromRAW = range1.val();
        this._chartData.rangeToRAW = range2.val();
        this._chartData.rangeFrom = this.misc.getTimeStamp( this._chartData.rangeFromRAW  );
        this._chartData.rangeTo = this.misc.getTimeStamp( this._chartData.rangeToRAW );

        return this;
    },

    /**
     * Convert object response from getting the form submissions
     * to a dataTable that is compatible with Google Chart API
     * @param object - the object to convert
     */
    objectToDataTable: function( object )
    {
        console.log("Object", object);
        var array = [];
        for( var i in object )
        {
            var key = i;
            var value = object[i];

            var thisKeyTime = this.misc.getTimeStamp( key );
            if ( ( !this._chartData.rangeFrom || !this._chartData.rangeTo ) || (thisKeyTime >= this._chartData.rangeFrom && thisKeyTime <= this._chartData.rangeTo) )
            {
                array.push([ new Date(key), value]);

                //get the total submissions
                this._chartData.totalSubmissions += value;
            }
        }

        return array.sort(this.misc.sortArray);
    },

    /**
     * Show the total submissions count to the page
     */
    showTotalSubmissions: function()
    {
        var fromRText = ( this._chartData.totalSubmissions ) ? this.misc.getDateFromString( this._chartData.dataTable[0] ) : "N/A";
        var fromTText = ( this._chartData.totalSubmissions && this._chartData.totalSubmissions > 1 ) ? this.misc.getDateFromString( this._chartData.dataTable[ this._chartData.dataTable.length - 1 ] ) : "N/A";
        var totalCounts = {
            from: ( this._chartData.totalSubmissions && this._chartData.totalSubmissions > 1 && this._chartData.rangeFromRAW ) ? this._chartData.rangeFromRAW : fromRText,
            to: ( this._chartData.totalSubmissions && this._chartData.totalSubmissions > 1 &&  this._chartData.rangeToRAW ) ?  this._chartData.rangeToRAW : fromTText,
            total: ( this._chartData.totalSubmissions ) ? this._chartData.totalSubmissions : "N/A"
        };

        var maxSubmission = {
            date: "N/A",
            value: "N/A"
        };

        //if max submission oject is present createad from buildChart()
        if ( this._chartData.maxSubmissionsRowIndex !== undefined )
        {
            //since date column index in datatable is 0 and value as 1
            var dateColumnIndex = 0;
            var valueColumnIndex = 1;
            var rowIndex = this._chartData.maxSubmissionsRowIndex;
            var dataTable = this._chartData.dataTableObj;

            maxSubmission.date = this.misc.getDateFromString( dataTable.getValue( rowIndex, dateColumnIndex) );
            maxSubmission.value = dataTable.getValue( rowIndex, valueColumnIndex);

            this.misc.log("max", maxSubmission);
        }


        var totalsElem = $("#totalSubmission");

        //set values
        $('.highestCounts', totalsElem).text( maxSubmission.value );
        $('._highestCountDate', totalsElem).text( maxSubmission.date )

        $('.totalCounts', totalsElem).text( totalCounts.total );
        $('._fromRange', totalsElem).text( totalCounts.from );
        $('._toRange', totalsElem).text( totalCounts.to );

        totalsElem.show();
    },

    /**
     * Build the whole chart
     */
    buildChart: function()
    {
        var self = this;

        // //clear any previous chart resources
        // if ( self._chartData.chart )
        // {
        //     self.clearChart();
        // }

        if( self._chartData.dataTable.length < 1 ) {
            return self.errorMsg("No Data to be shown on this specific Date range, Try another one!");
        }

        if ( self._chartData.dataTable.length == 1 ) {
            return self.errorMsg("History cannot be shown with only 1 column data of submissions");
        }

        //since we are using one data table, we need to delete the old one and set another
        if ( typeof self._chartData.dataTableObj !== "undefined" )
        {
            //get the total rows of all the data table
            var previousDataTableRowCount = self._chartData.dataTableObj.getNumberOfRows();
            self.misc.log("previousDataTableRowCount", previousDataTableRowCount);

            //if rows are greater than zero, meaning we do have current data on the dataTable
            if ( previousDataTableRowCount > 0 )
            {
                //get the total rows of the current data table
                var currentDataTableCount = self._chartData.dataTable.length;
                self.misc.log("currentDataTableCount", currentDataTableCount);
                //get the index to start removing rows
                //if and only if previousDataTableRowCount > currentDataTableCount
                if ( previousDataTableRowCount > currentDataTableCount )
                {
                    var deepIndex = currentDataTableCount;
                    var totalRowToRemove = ( previousDataTableRowCount - deepIndex );
                    self.misc.log("deepIndex totalRowToRemove", deepIndex,totalRowToRemove);

                    self._chartData.dataTableObj.removeRows( deepIndex, totalRowToRemove);
                }
                else
                {
                    var totalRowToAdd = ( currentDataTableCount - previousDataTableRowCount );
                    self.misc.log("totalRowToAdd", totalRowToAdd);
                    self._chartData.dataTableObj.addRows(totalRowToAdd);
                }

                var z = self._chartData.dataTable;
                for( var x = 0; x < z.length; x++ )
                {
                    //set date
                    self._chartData.dataTableObj.setValue(x, 0, new Date(z[x][0]));

                    //set value
                    self._chartData.dataTableObj.setValue(x, 1, z[x][1]);
                }
            }
            else
            {
                //add some data to the data table
                self._chartData.dataTableObj.addRows(self._chartData.dataTable);
            }
        }

        //get max submissions index array
        //this will tell us how many submission within a range
        var columnIndex = 1;
        var maxSubmissionRowIndex = self._chartData.dataTableObj.getFilteredRows([{
            column: columnIndex,
            value: self._chartData.dataTableObj.getColumnRange( columnIndex ).max
        }])[0];

        //register to global object
        self._chartData.maxSubmissionsRowIndex = maxSubmissionRowIndex;

        // build dataView to format the hAxis and yAxis labels
        // var dataView = new google.visualization.DataView(self._chartData.dataTableObj);
        //     dataView.setColumns([{
        //         calc: function(data, row) {
        //             return data.getFormattedValue(row, 0);
        //         },
        //         type:'string'
        //     },  1 ]);

        //event when chart is ready
        google.visualization.events.addListener(self._chartData.chart, 'ready', function(){
            self.misc.log("chart is now ready: total submissions", self._chartData.totalSubmissions);
            self.misc.showEnd( self._elem.mainContainer_el );
            self.misc.log( self.mainOptions );
            self.showTotalSubmissions();
        });

        self._chartData.chart.draw(self._chartData.dataTableObj, self.mainOptions);
        self._chartData.justDraw = true;
    },

    /**
     * Clears the chart, and releases all of its allocated resources.
     */
    clearChart: function()
    {
        this._chartData.chart.clearChart();
    },

    /**
     * Proccesor of the form, setting default values and get all forms
     */
    processChartForm: function()
    {
        var self = this;

        self.clearErrors();

        self.mainOptions.title = "Submission Chart History for - " + self.formTitle;

        //reset total submission
        self._chartData.totalSubmissions = 0;

        self.getFormSubmissions( self.formID, self.submissionCount, function(e){
            self._chartData.dataTable = self.objectToDataTable( e );
            self.buildChart();
            console.log("normal dataTable", self._chartData.dataTable);
        });

        return this;
    },

    /**
     * Function event when the form submission is clicked
     */
    getFormSubmissionsEvt: function()
    {
        var self = this;
        self.clearErrors();

        if ( typeof this.formID === "undefined" || typeof this.formID !== 'string' )
        {
            return self.errorMsg("No From was selected. Please try again!");
        }

        //set chart type, default range elems and then process now the chartform
        this.setChartType( this._elem.chartType_el )
            .getTimeRange( this._elem.rangeFrom_el, this._elem.rangeTo_el )
            .processChartForm();

        return false;
    },

    /**
     * Download chart Image
     */
    getChartImage: function()
    {
        this.misc.getChartImage(this.chartDivElement);
    },

    /**
     * Downoad Chart data in CSV format
     */
    getChartCSV: function()
    {
        this.misc.getChartCSV( this._chartData.dataTableObj, this.formTitle );
    },

    /**
     * Get and display all submissions from all the dates
     */
    getFromAllDates: function()
    {
        //check if "All Dates" option was checked
        if ( this._elem.allDates_el.is(":checked") )
        {
            this._elem.rangeFrom_el.val('').attr('disabled', true);
            this._elem.rangeTo_el.val('').attr('disabled', true);
        }
        else
        {
            this.setDefaultTimeRange();
        }

        //reset chart if present
        // if ( typeof this._chartData.chart !== "undefined" )
        // {
        //     this.getFormSubmissionsEvt();
        // }
    },

    errorMsg: function(msg)
    {
        this.misc.showEnd( this._elem.mainContainer_el );
        $('.error-notifier', this.$el).text(msg);
        return false;
    },

    clearErrors: function()
    {
        this.errorMsg('');
    }
});