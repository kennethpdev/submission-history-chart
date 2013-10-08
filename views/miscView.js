var miscView = Backbone.View.extend({

    initialize: function()
    {
        this.allowDebug = true;
    },
    /**
     * Show laoding indicator
     */
    showStart: function( elemObj )
    {
        var elem = elemObj || $('#chartContainer');

        //hide any previous loading
        this.showEnd();

        //show the current
        elem.showLoading();
    },

    /**
     * Modify loading indicator
     */
    modifyLoading: function(str)
    {
        $(".loading-indicator").html("Loading<br><br><br>"+str);
    },

    /**
     * Hide loading indicator
     */
    showEnd: function( elemObj )
    {
        var elem = elemObj || $('#chartContainer');
        elem.hideLoading();
    },

    /**
     * Sort an array by date
     */
    sortArray: function( a, b )
    {
        a = new Date( a[ 0 ] );
        b = new Date( b [ 0 ] );
        return ( a < b ) ? -1 : ( ( a > b ) ? 1 : 0 );
    },

    /**
     * Get last week date
     * such as MM/DD/YYYY
     */
    getLastWeek: function()
    {
        var t = new Date();
        var l = new Date( t.getFullYear(), t.getMonth(), t.getDate() - 7 );

        return {
            lastWeekMonth: l.getMonth() + 1,
            lastWeekDay: l.getDate(),
            lastWeekYear: l.getFullYear(),
            lastWeekFull: ( l.getMonth() + 1 ) + "/" + l.getDate() + "/" + l.getFullYear(),
            todayFull : ( t.getMonth() + 1 ) + "/" + t.getDate() + "/" + t.getFullYear()
        };
    },


    /**
     * Get the proper date format
     * and return it such as January 1, 2013
     */
    getDateFromString: function( date )
    {
        var MONTHS = ["January","Februry","March","April","May","June","July","August","September","October","November","December"];
        var myDate, myFormatDate;
        var d = new Date( date );
        var date_str =( d.getMonth() + 1 ) + "/" + d.getDate() + "/" + d.getFullYear();
        var t = date_str.split("/");
        if ( t[2] )
        {
            myDate = new Date(t[2], t[0] - 1, t[1]);
            myFormatDate = MONTHS[myDate.getMonth()] + " " + myDate.getDate() + "," + myDate.getFullYear();
        }
        else
        {
            myDate = new Date(new Date().getFullYear(), t[0] - 1, t[1]);
            myFormatDate = MONTHS[myDate.getMonth()] + " " + mydate.getDate();
        }

        return myFormatDate;
    },

    /**
     * Get the unix time equivalent of human readable time string format
     * such as mm-dd-yy
     */
    getTimeStamp: function ( time )
    {
        return new Date( time ).getTime() / 1000;
    },

    /**
     * Merge two arrays to one - the same as array_merge function of php
     */
    array_merge: function()
    {
      var args = Array.prototype.slice.call(arguments),
        argl = args.length,
        arg,
        retObj = {},
        k = '',
        argil = 0,
        j = 0,
        i = 0,
        ct = 0,
        toStr = Object.prototype.toString,
        retArr = true;

      for (i = 0; i < argl; i++) {
        if (toStr.call(args[i]) !== '[object Array]') {
          retArr = false;
          break;
        }
      }

      if (retArr) {
        retArr = [];
        for (i = 0; i < argl; i++) {
          retArr = retArr.concat(args[i]);
        }
        return retArr;
      }

      for (i = 0, ct = 0; i < argl; i++) {
        arg = args[i];
        if (toStr.call(arg) === '[object Array]') {
          for (j = 0, argil = arg.length; j < argil; j++) {
            retObj[ct++] = arg[j];
          }
        }
        else {
          for (k in arg) {
            if (arg.hasOwnProperty(k)) {
              if (parseInt(k, 10) + '' === k) {
                retObj[ct++] = arg[k];
              }
              else {
                retObj[k] = arg[k];
              }
            }
          }
        }
      }
      return retObj;
    },
    /**
    * Converts a value to a string appropriate for entry into a CSV table.  E.g., a string value will be surrounded by quotes.
    * @param {string|number|object} theValue
    * @param {string} sDelimiter The string delimiter.  Defaults to a double quote (") if omitted.
    */
    toCsvValue: function(theValue, sDelimiter)
    {
        var t = typeof (theValue), output;

        if (typeof (sDelimiter) === "undefined" || sDelimiter === null) {
            sDelimiter = '"';
        }

        if (t === "undefined" || t === null) {
            output = "";
        } else if (t === "string") {
            output = sDelimiter + theValue + sDelimiter;
        } else {
            output = String(theValue);
        }

        return output;
    },

    /**
    * Converts an array of objects (with identical schemas) into a CSV table.
    * @param {Array} objArray An array of objects.  Each object in the array must have the same property list.
    * @param {string} sDelimiter The string delimiter.  Defaults to a double quote (") if omitted.
    * @param {string} cDelimiter The column delimiter.  Defaults to a comma (,) if omitted.
    * @return {string} The CSV equivalent of objArray.
    */
    toCsv: function(objArray, sDelimiter, cDelimiter)
    {
        var i, l, names = [], name, value, obj, row, output = "", n, nl;

        // Initialize default parameters.
        if (typeof (sDelimiter) === "undefined" || sDelimiter === null) {
            sDelimiter = '"';
        }
        if (typeof (cDelimiter) === "undefined" || cDelimiter === null) {
            cDelimiter = ",";
        }

        for (i = 0, l = objArray.length; i < l; i += 1) {
            // Get the names of the properties.
            obj = objArray[i];
            console.log(obj);
            row = "";
            if (i === 0) {
                // Loop through the names
                for (name in obj) {
                    if (obj.hasOwnProperty(name)) {
                        names.push(name);
                        // row += [sDelimiter, name, sDelimiter, cDelimiter].join("");
                    }
                }
                // row = row.substring(0, row.length - 1);
                // output += row;
                console.log( output, row );
            }

            // output += "\n";
            row = "";
            for (n = 0, nl = names.length; n < nl; n += 1) {
                name = names[n];
                value = obj[name];
                if (n > 0) {
                    row += ","
                }
                row += this.toCsvValue(value, '"');
            }
            output += row + "\n";
        }

        return output;
    },
    /**
     * Download chart Image
     */
    getChartImage: function(chart_elem)
    {
        if (
            typeof grChartImg === "object" &&
            typeof grChartImg.ShowImage === "function"
        )
        {
            grChartImg.ShowImage( chart_elem, true);
        }
        else
        {
            console.error("Required libraries to download chart image were missing.");
        }

        return false;
    },

    /**
     * Downoad Chart data in CSV format
     * @param dataTable - colletion of current dataTable from the displayed chart
     * @param filename - filename of the csv
     */
    getChartCSV: function( dataTable, filename )
    {
        //get the current tableobject that used to display to the chart
        var table = dataTable;

        //get number of rows and cols from the tableobject
        var rows = table.getNumberOfRows();
        var cols = table.getNumberOfColumns();

        //get label
        var labelTable = [];
        for( var z = 0; z < cols; z++ )
        {
            labelTable.push( table.getColumnLabel( z ) );
        }

        //generate csv table - include labes/header
        var csvTable = [labelTable];

        //get values
        for( var x = 0; x < rows; x++ )
        {
            var r = [];
            for( var y = 0; y < cols; y++ )
            {
                r.push(table.getFormattedValue(x, y));
            }

            csvTable.push( r );
        }

        var csvContent = "data:text/csv;charset=utf-8," + this.toCsv( csvTable );
        var link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", filename + ".csv");
        link.click();

        console.log("Final table", csvTable);
        console.log("csv data", this.toCsv( csvTable ));
    },

    /**
     * Custom log for better debugging
     */
    log: function()
    {
        if( this.allowDebug && 'console' in window )
        {
            window.console.log( Array.prototype.slice.call( arguments ) );
        }
    }
});