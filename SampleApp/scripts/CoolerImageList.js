(function (global) {
    var app = global.app = global.app || {};
    var isComingfromFilterScreen = false;
    CoolerImageListViewModel = kendo.data.ObservableObject.extend({

        CoolerImageListDataSource: null,

        init: function (e) {
            var that = this,
                dataSource,
                jsonUrlToLoad;
            var assetId = app.summaryDetailService.assetId;
            kendo.data.ObservableObject.fn.init.apply(that, []);
            if (!isComingfromFilterScreen) {
                jsonUrlToLoad = "http://cooler.insigmainc.com/Controllers/CoolerImage.ashx?asArray=0&dir=DESC&action=list&assetId"+assetId;
            } else {
                var dateFrom = $("#fromDate").val();
                var dateTo = $("#toDate").val();
                var processed = $("#processedVal").val();
                var purityFrom = $("#purityFrom").val();
                var purityTo = $("#purityTo").val();
                var stockFrom = $("#stockFrom").val();
                var stockTo = $("#stockTo").val();
                var foreignProductFrom = $("#foreginFrom").val();
                var foreignProductTo = $("#foreginTo").val();
                var filters = "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&processed=" + processed + "&stockFrom=" + stockFrom + "&stockTo=" + stockTo + "&purityFrom=" + purityFrom + "&purityTo=" + purityTo + "&foreignProductFrom=" + foreignProductFrom + "&foreignProductTo=" + foreignProductTo;
                jsonUrlToLoad = "http://cooler.insigmainc.com/Controllers/CoolerImage.ashx?asArray=0&dir=DESC&action=list&assetId=" + assetId + filters;
            }
            dataSource = new kendo.data.DataSource({
                schema: {
                    parse: function (response) {
                        debugger;
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
        imageModel: new CoolerImageListViewModel(),
        show: function (e) {
            app.viewImageListService.imageModel.CoolerImageListDataSource.read({
                AssetId: app.summaryDetailService.assetId
            });
        },
        filterinit: function (e) {
            app.viewImageListService.setDate();
            $("#filterBtn").click(function () {
                isComingfromFilterScreen = true;
                app.viewImageListService.imageModel.init();
                history.go(-1);
            })
        },
        setDate: function () {
            var currentDate = new Date();
            var currentMonth = currentDate.getMonth() + 1;
            var currentDay = currentDate.getDate();
            var currentYear = currentDate.getFullYear();
            var curDate = currentYear + "-" + currentMonth + "-" + currentDay;
            var previousDate = new Date(currentYear, currentMonth - 1, currentDay);
            var previoustMonth = previousDate.getMonth();
            var previousDay = previousDate.getDate();
            var previousYear = previousDate.getFullYear();
            var prevDate = previousYear + "-" + previoustMonth + "-" + previousDay;
            document.getElementById("fromDate").value = prevDate;
            document.getElementById("toDate").value = curDate;

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