var app = app || {};

app.Summary = (function () {
    'use strict'

    var summaryListData = [];

    var summaryViewModel = (function () {

        var locationId;

        var init = function (e) {
            locationId = e.view.params.LocationId;
            $.ajax({
                url: "http://cooler.insigmainc.com/Controllers/AssetInfo.ashx?action=list&asArray=0&limit=0&sort=AssetId&dir=DESC&locationId=" + locationId,
                async: false,
                dataType: "json",
                success: function (result) {
                    summaryListData = result.records;
                }

            });
        };

        var summaryDataSource = new kendo.data.DataSource({
            data: [{ id: 1, SerialNumber: 'DF:34:4F:74:BC:24',Stock: '0',Humidity: '35',LightIntensity: '3',Temperature: '60.8' }, { id: 2, SerialNumber: 'F3:32:33:20:4D:78',Stock: '',Humidity: '0',LightIntensity: '0',Temperature: '0' }]
        });

        return {
            init: init,
            summaryList: summaryDataSource
        };

    }());

    return summaryViewModel;

}());