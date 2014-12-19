(function (global) {
    var  app = global.app = global.app || {};    
    var SummaryListViewModel = kendo.data.ObservableObject.extend({
        summaryListDataSource: null,    
        init: function (e) {             
            var that = this,
                dataSource,
                jsonUrlToLoad;

            kendo.data.ObservableObject.fn.init.apply(that, []);    
            jsonUrlToLoad = "http://cooler.insigmainc.com/Controllers/AssetInfo.ashx?action=list&asArray=0&limit=0&sort=AssetId&dir=DESC";
            dataSource = new kendo.data.DataSource({  
                group: { field: "SerialNumber" },                
                schema:{
                   model: app.models.SummaryList,
                   parse: function(response) {                
                        return response.records;
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
            that.set("summaryListDataSource", dataSource);
        }
    });
    app.summaryListService = {     
        show: function(e){            
          app.summaryListService.viewModel.summaryListDataSource.read({LocationId : e.view.params.locationId});
        },
        viewModel: new SummaryListViewModel(),
            spaces: function () {
                var spaces = this.get('Columns') * this.get('Shelves');
                return spaces;
            },
            getTemperatureImg: function (values, baseCls) {
                var base = baseCls || 'cooler-list-image-small';
                var toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-inrangetemperature") + '">&nbsp;</div>';
                if (values.Temperature < 35.6) {
                    toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-lowtemperature") + '">&nbsp;</div>';
                } else if (values.Temperature > 39.2) {
                    toReturn = '<div class="' + Ext.String.format("{0} {1}", base, " cooler-list-hightemperature") + '">&nbsp;</div>';
                }
                return toReturn;
            },
            getLightImg: function (values, baseCls) {
                var base = baseCls || 'cooler-list-image-small';
                var toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-darklight") + '">&nbsp;</div>';
                if (values.LightIntensity < 5)
                    toReturn = '<div class="' + Ext.String.format("{0} {1}", base, " cooler-list-brightlight") + '">&nbsp;</div>';
                else if (values.LightIntensity > 10 && values.LightIntensity < 12)
                    toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-lowlight") + '">&nbsp;</div>';

                return toReturn;
            },
            getPurityImg: function (values, baseCls) {
                var purityPerc = (((values.Stock - values.ForeignProduct) * 100) / values.Stock);
                var base = baseCls || 'cooler-list-image-small';
                var toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-humidity25") + '">&nbsp;</div>';
                if (purityPerc > 25 && purityPerc <= 50)
                    toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-humidity50") + '">&nbsp;</div>';
                else if (purityPerc > 50 && purityPerc <= 75)
                    toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-humidity75") + '">&nbsp;</div>';
                else if (purityPerc > 75)
                    toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-humidity100") + '">&nbsp;</div>';

                return toReturn;
            },
            getStockImg: function (values, baseCls) {
                var spaces = values.Columns * values.Shelves;
                var stockPerc = (((values.Stock - values.ForeignProduct) * 100) / spaces);

                var base = baseCls || 'cooler-list-image-small';
                var toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-stock100") + '">&nbsp;</div>'

                if (stockPerc <= 25) {
                    toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-stock25") + '">&nbsp;</div>'
                } else if (stockPerc > 25 && stockPerc <= 50) {
                    toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-stock50") + '">&nbsp;</div>'
                } else if (stockPerc > 50 && stockPerc <= 75) {
                    toReturn = '<div class="' + Ext.String.format("{0} {1}", base, "cooler-list-stock75") + '">&nbsp;</div>'
                }
                return toReturn;
            },
            getLightIntensity: function (lightIntensity) {                
                return (80 - lightIntensity);
            },
            getPurityPerc: function (stock, foreignProduct) {
                var toReturn;
                if (stock === null || stock === 0) {
                    toReturn = (0).toFixed(1); // to avoid divide by zero
                } else {
                    toReturn = (((stock - foreignProduct) * 100) / stock).toFixed(1);
                    toReturn = Math.floor(toReturn).toFixed(1);
                }
                if (foreignProduct === 0) {
                    toReturn = toReturn;
                }
                return toReturn;
            },
            getStockPerc: function (columns, shelves, stock, foreignProduct) {
                var spaces = columns * shelves;                
                var toReturn;
                if (foreignProduct === null || foreignProduct === 0 || spaces < 0) {
                    toReturn = (0).toFixed(2); // to avoid divide by zero
                }
                toReturn = (((stock - foreignProduct) * 100) / spaces).toFixed(1);
                toReturn = Math.floor(toReturn);

                return toReturn;
            },
            getTemperatureText: function (temperature) {                
                var toReturn = "In Range";
                if (temperature < 35.6) {
                    toReturn = "Too Cold";
                } else if (temperature > 39.2) {
                    toReturn = "Too Hot";
                }
                return toReturn
            },
            getLightIntensityText: function (lightIntensity) {
                var toReturn;

                if (lightIntensity < 5) {
                    toReturn = "Bright";
                } else if (lightIntensity > 10 && lightIntensity < 12) {
                    toReturn = "Low";
                } else if (lightIntensity > 12) {
                    toReturn = "Dark";
                }
                return toReturn;
            },
            getPurityPercText: function (foreignProduct) {
                var toReturn = "Impure";
                if (foreignProduct == 0) {
                    toReturn = "Pure";
                }
                return toReturn;
            },
            getStockPercText: function (columns, shelves, stock) {
                var spaces = columns * shelves;
                var toReturn = "Sos";
                if (stock >= ((spaces * 60) / 100)) {
                    toReturn = toReturn;
                }
                return toReturn;
            }
    };    
  
})(window);