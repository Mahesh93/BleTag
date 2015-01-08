(function (global) {
     var  app = global.app = global.app || {};          
     var LocationViewModel = kendo.data.ObservableObject.extend({
        locationDataSource: null,
        init: function () {
            var that = this,
                dataSource,
                jsonUrlToLoad;

            kendo.data.ObservableObject.fn.init.apply(that, []);
            //When you build for Apache Cordova 3.0.0, apply this code instead of using relative URLs. In Apache Cordova 3.0.0, relative URLs might not work properly.
            //jsonUrlToLoad = app.makeUrlAbsolute("data/weather.json");
            jsonUrlToLoad = "http://cooler.insigmainc.com/Controllers/Location.ashx?action=List&asArray=0&limit=0&sort=Name&dir=DESC";

            dataSource = new kendo.data.DataSource({  
                group: {
                    field: "LocationIndex"
                },
                schema:{
                    model: app.models.LocationList,
                   parse: function(response) { 
                        //console.log(JSON.stringify(response, null, 4));
                       var count=response.recordCount;
                       var records=response.records;
                       for(var i=0;i<count;i++){                           
                           records[i].LocationIndex=records[i].Name[0];
                       }
                        return records;
                    }
                },
                transport: {
                       read:  {
                           url: jsonUrlToLoad,
                           dataType: "json",
                           type: "GET"                           
                      }  
                }
                
            });

            that.set("locationDataSource", dataSource);
        }
    });

    app.locationService = {
        viewModel: new LocationViewModel()
    };    
  
})(window);