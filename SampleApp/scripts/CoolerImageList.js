(function (global) {
    var app = global.app = global.app || {};
    var isComingfromFilterScreen = false,
        CoolerImageListViewModel = kendo.data.ObservableObject.extend({
            CoolerImageListDataSource: null,
            init: function (e) {
                var that = this,
                    dataSource,
                    jsonUrlToLoad;
                var assetId = app.summaryDetailService.assetId;
                kendo.data.ObservableObject.fn.init.apply(that, []);
                jsonUrlToLoad = "http://cooler.insigmainc.com/Controllers/CoolerImage.ashx?asArray=0&dir=DESC&action=list";

                dataSource = new kendo.data.DataSource({
                    group: {
                        field: "AssetId",
                        field: "ImageDateTime"
                    },
                    schema: {
                        model: app.models.CoolerImageList,
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
                that.set("CoolerImageListDataSource", dataSource);

            }

        });
    app.viewImageListService = {
        isFilterLoad: false,
        show: function (e) {
            if(app.viewImageListService.isFilterLoad){
                app.viewImageListService.isFilterLoad = false;
                return;
            }
                
            app.viewImageListService.imageModel.CoolerImageListDataSource.read({
                assetId: app.summaryDetailService.assetId
            });
        },
        imageModel: new CoolerImageListViewModel(),
        filterinit: function (e) {
            app.viewImageListService.setDate();
            $("#filterBtn").click(function () {

                var dateFrom = $("#fromDate").val();
                var dateTo = $("#toDate").val();
                var processed = $("#processedVal").val();
                var purityFrom = $("#purityFrom").val();
                var purityTo = $("#purityTo").val();
                var stockFrom = $("#stockFrom").val();
                var stockTo = $("#stockTo").val();
                var foreignProductFrom = $("#foreginFrom").val();
                var foreignProductTo = $("#foreginTo").val();                

            app.viewImageListService.imageModel.CoolerImageListDataSource.read({
                assetId: app.summaryDetailService.assetId,
                dateFrom: dateFrom,
                dateTo: dateTo,
                processed: processed,
                purityFrom: purityFrom,
                purityTo: purityTo,
                stockFrom: stockFrom,
                stockTo: stockTo,
                foreignProductFrom: foreignProductFrom,
                foreignProductTo: foreignProductTo
                });
                app.viewImageListService.isFilterLoad = true;
                history.go(-1);
            })
        },
        setDate: function () {
            document.getElementById("fromDate").value = new Date();
            document.getElementById("toDate").value = new Date();

        },
        getImgUrl: function (CoolerImageId) {
            return "http://cooler.insigmainc.com/Controllers/CoolerImage.ashx?action=other&otherAction=Download&width=100&height=100&id=" + CoolerImageId;
        },
        getPurityValue: function (ForeignProduct) {
            var toReturn;
            //if ForeignProduct == 0, show in Black else in Red
            if (ForeignProduct === 0) {
                toReturn = "Pure";
            } else {
                toReturn = "Impure";
            }
            return toReturn;
        },
        getStockValue: function (Stock, ForeignProduct) {

            var toReturn;
            if (ForeignProduct === null || ForeignProduct === 0) {
                toReturn = (0).toFixed(2); // to avoid divide by zero
            }
            toReturn = ((Stock - ForeignProduct));

            return toReturn;
        }
    };

})(window);