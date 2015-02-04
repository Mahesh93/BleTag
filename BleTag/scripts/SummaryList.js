(function (global) {
    var app = global.app = global.app || {};
    var SummaryListViewModel = kendo.data.ObservableObject.extend({
        summaryListDataSource: null,
        init: function (e) {
            var that = this,
                dataSource,
                summaryMenuDataSource,
                jsonUrlToLoad;
            kendo.data.ObservableObject.fn.init.apply(that, []);
            jsonUrlToLoad = "http://cooler.insigmainc.com/Controllers/AssetInfo.ashx?action=list&asArray=0&limit=0&sort=AssetId&dir=DESC";
            dataSource = new kendo.data.DataSource({
                group: {
                    field: "SerialNumber"
                },
                schema: {
                    model: app.models.SummaryList,
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
            that.set("summaryListDataSource", dataSource);

            var summaryMenuDataSource = new kendo.data.DataSource({
                schema: {
                    model: app.models.Menu
                },
                data: [{
                        Title: 'Scan',
                        MenuId: 1,
                        ImageCls: 'scan-nav'
                },
                    {
                        Title: 'Debug',
                        MenuId: 2,
                        ImageCls: 'debug-nav'
                }, {
                        Title: 'Switch Language',
                        MenuId: 3,
                        ImageCls: 'lang-nav'
                }, {
                        Title: 'Switch to Test Server',
                        MenuId: 4,
                        ImageCls: 'server-nav'
                }]
            });

            that.set("summaryMenuDataSource", summaryMenuDataSource);
        }
    });
    app.summaryListService = {
        show: function (e) {
            app.summaryListService.viewModel.summaryListDataSource.read({
                LocationId: e.view.params.locationId
            });

        },
        menuClick: function (item) {
            var menuId = item.dataItem.MenuId;
            var me = app.summaryListService;

            switch (menuId) {
                case 1:
                    break;
                case 2:
                    app.BleTag.main.navigate('views/DebugDeviceView.html');
                    break;
                case 3:
                    break;
                case 4:
                    break;
                default:
                    break;
            }
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
        getLightImg: function (lightIntensity) {
            var toReturn;
            if (lightIntensity > 15)
                toReturn = "<div class='cooler-list-image-small cooler-list-brightlight'></div>";
            else if (lightIntensity > 5)
                toReturn = "<div class='cooler-list-image-small cooler-list-lowlight'></div>";
            else
                toReturn = "<div class='cooler-list-image-small cooler-list-darklight'></div>";

            return toReturn;
        },
        getPurityImg: function (Stock, ForeignProduct, Columns, Shelves) {
            var toReturn;
            var stock = Stock - ForeignProduct;
            var foreignProduct = ForeignProduct;
            var spaces = Columns * Shelves;
            if (stock > 0 && spaces > 0) {
                var purityPerc = Math.round(stock * 100 / Stock);
                var stockPerc = Math.round(stock * 100 / spaces);
                if (purityPerc <= 25)
                    toReturn = "<div class='cooler-list-image-small cooler-list-humidity25'></div>";
                else if (purityPerc > 25 && purityPerc <= 50)
                    toReturn = "<div class='cooler-list-image-small cooler-list-humidity50'></div>";
                else if (purityPerc > 50 && purityPerc <= 75)
                    toReturn = "<div class='cooler-list-image-small cooler-list-humidity75'></div>";
                else if (purityPerc > 75)
                    toReturn = "<div class='cooler-list-image-small cooler-list-humidity100'></div>";
            } else
                toReturn = "<div class='cooler-list-image-small cooler-list-humidity100'></div>"
            return toReturn;
        },
        getStockImg: function (Stock, ForeignProduct, Columns, Shelves) {
            var spaces = Columns * Shelves;
            var stockPerc = (((Stock - ForeignProduct) * 100) / spaces);

            var toReturn = "<div class='cooler-list-image-small cooler-list-stock100'></div>"

            if (stockPerc <= 25) {
                toReturn = "<div class='cooler-list-image-small cooler-list-stock25'></div>"
            } else if (stockPerc > 25 && stockPerc <= 50) {
                toReturn = "<div class='cooler-list-image-small cooler-list-stock50'></div>"
            } else if (stockPerc > 50 && stockPerc <= 75) {
                toReturn = "<div class='cooler-list-image-small cooler-list-stock75'></div>"
            } else if (stockPerc > 75) {
                toReturn = "<div class='cooler-list-image-small cooler-list-stock100'></div>"
            }
            return toReturn;
        },
        getPurityPerc: function (Stock, ForeignProduct, Columns, Shelves) {
            var toReturn;
            var stock = Stock - ForeignProduct;
            var foreignProduct = ForeignProduct;
            var spaces = Columns * Shelves;
            if (stock > 0 && spaces > 0) {
                var purityPerc = Math.round(stock * 100 / Stock);
                var stockPerc = Math.round(stock * 100 / spaces);
                toReturn = purityPerc + "%";
                if (foreignProduct == 0) {
                    toReturn = "<div class='cooler-list-labelblack'>" + toReturn + "</div>"
                } else {
                    toReturn = "<div class='cooler-list-label'>" + toReturn + "</div>"
                }
            } else
                toReturn = "<div class='cooler-list-labelblack'>100%</div>"
            return toReturn;
        },
        getStockPerc: function (columns, shelves, Stock, ForeignProduct) {
            var spaces = columns * shelves;
            var toReturn;
            var clsReturn;
            var stock = Stock - ForeignProduct;
            if (ForeignProduct === null || ForeignProduct === 0 || spaces < 0) {
                toReturn = (0).toFixed(2); // to avoid divide by zero
            }
            toReturn = (((Stock - ForeignProduct) * 100) / spaces).toFixed(1);
            toReturn = Math.floor(toReturn);
            if (toReturn != 0)
                toReturn = toReturn + "%";
            if (stock > 0 && spaces > 0) {
                clsReturn = "<div class='cooler-list-label'>" + toReturn + "</div>"
                if (stock >= ((spaces * 60) / 100)) {
                    clsReturn = "";
                    clsReturn = "<div class='cooler-list-labelblack'>" + toReturn + "</div>"
                }
            } else
                clsReturn = "<div class='cooler-list-labelblack'>" + toReturn + "</div>"

            return clsReturn;
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
        getLightIntensityValue: function (lightIntensity) {
            var toReturn;
            if (lightIntensity > 15)
                toReturn = "<div class='cooler-list-labelblack'>" + lightIntensity.toFixed(1) + "</div>";
            else
                toReturn = lightIntensity.toFixed(1);

            return toReturn;
        },
        getLightIntensityText: function (lightIntensity) {
            var toReturn;
            if (lightIntensity > 15)
                toReturn = '<div class="cooler-list-labelblack">Bright</div>';
            else if (lightIntensity > 5)
                toReturn = "Low";
            else
                toReturn = "Dark";

            return toReturn;
        },
        getPurityPercText: function (Columns, Shelves, Stock, ForeignProduct) {
            var toReturn;
            var stock = Stock - ForeignProduct;
            var foreignProduct = ForeignProduct;
            var spaces = Columns * Shelves;
            if (stock > 0 && spaces > 0) {
                if (foreignProduct == 0) {
                    toReturn = '<div class="cooler-list-labelblack">Pure</div>'
                } else {
                    toReturn = '<div class="cooler-list-label">Pure</div>'
                }
            } else
                toReturn = '<div class="cooler-list-labelblack">Pure</div>'
            return toReturn;

        },
        getStockPercText: function (columns, shelves, Stock, ForeignProduct) {
            var toReturn;
            var spaces = columns * shelves;
            var stock = Stock - ForeignProduct;
            var foreignProduct = ForeignProduct;
            if (stock > 0 && spaces > 0) {
                toReturn = '<div class="cooler-list-label">SoS</div>'
                if (stock >= ((spaces * 60) / 100)) {
                    toReturn = '<div class="cooler-list-labelblack">SoS</div>'
                }
            } else
                toReturn = '<div class="cooler-list-labelblack">SoS</div>'
            return toReturn;
        }

    };

})(window);