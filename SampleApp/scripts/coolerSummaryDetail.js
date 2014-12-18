var app = app || {};

app.SummaryDetail = (function () {
    'use strict'
    var summaryDetailModel = (function () {
        var summaryDetailData = [];
        var summaryModel = {

            id: 'Id',
            fields: {
                Text: {
                    field: 'Text',
                    defaultValue: ''
                },
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                Picture: {
                    fields: 'Picture',
                    defaultValue: null
                },
                UserId: {
                    field: 'UserId',
                    defaultValue: null
                },
                Likes: {
                    field: 'Likes',
                    defaultValue: []
                }
            },
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
            getLightIntensity: function () {
                var lightIntensity = this.get('LightIntensity');
                return (80 - lightIntensity);
            },
            getPurityPerc: function () {
                var toReturn;
                if (this.get('Stock') === null || this.get('Stock') === 0) {
                    toReturn = (0).toFixed(1); // to avoid divide by zero
                } else {
                    toReturn = (((this.get('Stock') - this.get('ForeignProduct')) * 100) / this.get('Stock')).toFixed(1);
                    toReturn = Math.floor(toReturn).toFixed(1);
                }
                if (this.get('ForeignProduct') === 0) {
                    toReturn = toReturn;
                }
                return toReturn;
            },
            getStockPerc: function () {
                var spaces = this.get('Columns') * this.get('Shelves');
                var foreignProduct = this.get('ForeignProduct');
                var toReturn;
                if (foreignProduct === null || foreignProduct === 0 || spaces < 0) {
                    toReturn = (0).toFixed(2); // to avoid divide by zero
                }
                toReturn = (((this.get('Stock') - foreignProduct) * 100) / spaces).toFixed(1);
                toReturn = Math.floor(toReturn);

                return toReturn;
            },
            getTemperatureText: function () {
                var toReturn = "In Range";
                if (this.get('Temperature') < 35.6) {
                    toReturn = "Too Cold";
                } else if (this.get('Temperature') > 39.2) {
                    toReturn = "Too Hot";
                }
                return toReturn
            },
            getLightIntensityText: function () {
                var toReturn;

                if (this.get('LightIntensity') < 5) {
                    toReturn = "Bright";
                } else if (this.get('LightIntensity') > 10 && this.get('LightIntensity') < 12) {
                    toReturn = "Low";
                } else if (this.get('LightIntensity') > 12) {
                    toReturn = "Dark";
                }
                return toReturn;
            },
            getPurityPercText: function () {
                var toReturn = "Impure";
                if (this.get('ForeignProduct') == 0) {
                    toReturn = "Pure";
                }
                return toReturn;
            },
            getStockPercText: function () {
                var spaces = this.get('Columns') * this.get('Shelves');
                var toReturn = "Sos";
                if (this.get('Stock') >= ((spaces * 60) / 100)) {
                    toReturn = toReturn;
                }
                return toReturn;
            },
        };
        var init = function (e) {
            var locationId;
            $("#detail-listview").kendoMobileListView({
                dataSource: {
                    data: summaryDetailData,
                    group: "SerialNumber",
                    schema: {
                        model: summaryModel
                    },
                },
                template: kendo.template($("#summaryTemplate").html()),
                fixedHeaders: true
            });
        };
        return {
            init: init
        };
    }());
    return summaryDetailModel;
}());