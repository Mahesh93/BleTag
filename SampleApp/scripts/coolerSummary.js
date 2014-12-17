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
            $("#flat-listview").kendoMobileListView({
                dataSource: kendo.data.DataSource.create({
                    data: summaryListData,
                    group: "SerialNumber"
                }),
                template: kendo.template($("#summaryTemplate").html()),            
                fixedHeaders: true
            });

        };

        var summaryDataSource = new kendo.data.DataSource({
            data: [{
                Temperature: '60.8'
            }, {
                Temperature: '0'
            }]
        });

        return {
            init: init,
            summaryList: summaryDataSource
        };

    }());

    return summaryViewModel;

}());