(function (global) {
    var app = global.app = global.app || {};
    var SummaryDetailDataModel = kendo.data.ObservableObject.extend({
        summaryDetailDataSource: null,
        init: function (e) {
            var that = this,
                dataSource,
                jsonUrlToLoad;

            kendo.data.ObservableObject.fn.init.apply(that, []);
            jsonUrlToLoad = "http://cooler.insigmainc.com/Controllers/AssetInfo.ashx?action=load";
            dataSource = new kendo.data.DataSource({
                group: {
                    field: "SerialNumber"
                },
                schema: {
                    parse: function (response) {
                        var model = new app.models.SummaryList(response.data);
                        model.AssetId = model.Id;
                        return [model];
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
            that.set("summaryDetailDataSource", dataSource);
        }
    });
    app.summaryDetailService = {
        assetId: null,
        viewModel: new SummaryDetailDataModel(),
        loadChart: function () {
            debugger;
        },
        loadDistributionData: function () {
            debugger;
        },
        show: function (e) {
            app.summaryDetailService.assetId = e.view.params.assetId;
            app.summaryDetailService.viewModel.summaryDetailDataSource.read({
                Id: e.view.params.assetId
            });
        }
    };

})(window);