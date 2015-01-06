(function (global) {
    var app = global.app = global.app || {};

    CoolerDataListViewModel = kendo.data.ObservableObject.extend({
        CoolerDataListDataSource: null,
        init: function (e) {
            var that = this,
                dataSource,
                jsonUrlToLoad;
            var assetId = app.summaryDetailService.assetId;
            kendo.data.ObservableObject.fn.init.apply(that, []);
            jsonUrlToLoad = "http://cooler.insigmainc.com/Controllers/CoolerInfo.ashx?action=list&AsArray=0&sort=CoolerInfoId&dir=DESC";
            dataSource = new kendo.data.DataSource({
                schema: {
                    parse: function (response) {
                        return response.records;
                    }
                },
                transport: {
                    read: {
                        url: jsonUrlToLoad,
                        dataType: "json",
                        type: "GET"
                    }
                }

            });
            that.set("CoolerDataListDataSource", dataSource);
        }
    });

    app.viewDataListService = {
        show: function (e) {
            app.viewDataListService.viewModel.CoolerDataListDataSource.read({
                assetId: app.summaryDetailService.assetId
            });
        },
        viewModel: new CoolerDataListViewModel(),
        dateRenderer: function (date) {
            var options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
            var dateArray = date.match(app.dateRegex).slice(1);
            var dt = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0] + " " + dateArray[3] + ":" + dateArray[4] + ":" + dateArray[5] + ":" + dateArray[6];
            var currentDate = new Date(dt);
            var renderDate = currentDate.toLocaleString("en-us",options).replace(/,/g , "");
            return renderDate;
        },
        getTemperatureImg: function (Temperature, baseCls) {
            var base = baseCls || 'cooler-list-image-small';
            var toReturn = '<div class="cooler-list-image-mini cooler-list-inrangetemperature">&nbsp;</div>';
            if (Temperature < 35.6) {
                toReturn = '<div class="cooler-list-image-mini cooler-list-lowtemperature">&nbsp;</div>';
            } else if (Temperature > 39.2) {
                toReturn = '<div class="cooler-list-image-mini cooler-list-hightemperature">&nbsp;</div>';
            }
            return toReturn;
        },
        getLightImg: function (LightIntensity, baseCls) {
            var base = baseCls || 'cooler-list-image-small';
            var toReturn = '<div class="cooler-list-image-mini cooler-list-darkligh">&nbsp;</div>';
            if (LightIntensity < 5)
                toReturn = '<div class="cooler-list-image-mini cooler-list-brightlight">&nbsp;</div>';
            else if (LightIntensity > 10 && LightIntensity < 12)
                toReturn = '<div class="cooler-list-image-mini cooler-list-lowlight">&nbsp;</div>';

            return toReturn;
        },
        getPurityImg: function (Stock, baseCls) {
            var purityPerc = (((Stock) * 100) / Stock);
            var base = baseCls || 'cooler-list-image-small';
            var toReturn = '<div class="cooler-list-image-mini cooler-list-humidity25">&nbsp;</div>';
            if (purityPerc > 25 && purityPerc <= 50)
                toReturn = '<div class="cooler-list-image-mini cooler-list-humidity50">&nbsp;</div>';
            else if (purityPerc > 50 && purityPerc <= 75)
                toReturn = '<div class="cooler-list-image-mini cooler-list-humidity75">&nbsp;</div>';
            else if (purityPerc > 75)
                toReturn = '<div class="cooler-list-image-mini cooler-list-humidity100">&nbsp;</div>';

            return toReturn;
        },
        getPurityStatus: function (PurityIssue) {
            return PurityIssue ? 'Yes' : 'No';
        },
        getStockImg: function (Stock, baseCls) {
            var stockPerc = (((Stock) * 100) / Stock);

            var base = baseCls || 'cooler-list-image-small';
            var toReturn = '<div class="cooler-list-image-mini cooler-list-stock100">&nbsp;</div>'

            if (stockPerc <= 25) {
                toReturn = '<div class="cooler-list-image-mini cooler-list-stock25">&nbsp;</div>'
            } else if (stockPerc > 25 && stockPerc <= 50) {
                toReturn = '<div class="cooler-list-image-mini cooler-list-stock50">&nbsp;</div>'
            } else if (stockPerc > 50 && stockPerc <= 75) {
                toReturn = '<div class="cooler-list-image-mini cooler-list-stock75">&nbsp;</div>'
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