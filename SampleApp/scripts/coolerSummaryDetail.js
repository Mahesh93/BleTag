var app = app || {};

app.SummaryDetail = (function () {
    'use strict'
    var summaryDetailModel = (function () {
        var summaryDetailData = [];

        var init = function (e) {
            var summaryStockData = [];
            var assetId = app.Summary.summaryData[0].AssetId;
            $("#detail-listview").kendoMobileListView({
                dataSource: {
                    data: app.Summary.summaryData,
                    group: "SerialNumber",
                    schema: {
                        model: app.Summary.summaryModel
                    },
                },
                template: kendo.template($("#summaryTemplate").html()),
                fixedHeaders: true
            });

            $.ajax({
                url: "http://cooler.insigmainc.com/Controllers/AssetInfo.ashx?action=load&id=" + assetId,
                async: false,
                dataType: "json",
                success: function (result) {
                    summaryDetailData = result.data;
                    var stockDetails = result.data.StockDetails;
                    stockDetails.forEach(function (item) {
                        summaryStockData.push({
                            label: item.ProductName,
                            value: item.Qty,
                            color: item.GraphColor
                        });
                    })
                }

            });

            var chart = new FusionCharts({
                type: "pie2d",
                id: 'fu-distributionchart',
                height: 220,
                width: 320,
                dataFormat: "json",
                dataSource: {
                    "chart": {                        
                        "palette": "2",
                        "animation": "1",
                        "formatnumberscale": "1",
                        "decimals": "0",
                        "pieslicedepth": "30",
                        "startingangle": "125",
                        "showBorder": "0"
                    },
                    "data": summaryStockData
                }
            });
            chart.render("fusioncharts");
            $("#distributionData").ready(function () {
                var details = summaryDetailData.Details;
                var columns = summaryDetailData.Columns;
                var table = document.createElement("table");
                table.style.width = "100%";
                var row;
                var td;
                for (var i = 0; i < details.length; i++) {
                    var dataItem = details[i];
                    if ((i / columns) % 1 == 0) {
                        row = document.createElement("tr");
                        table.appendChild(row);
                    }
                    td = document.createElement("td");
                    var valueDiv = document.createElement("div");
                    valueDiv.textContent = dataItem.Name;
                    valueDiv.style.fontSize = "4px";
                    td.appendChild(valueDiv);

                    var iconDiv = document.createElement("div");
                    iconDiv.textContent = " ";
                    iconDiv.className = "circle";

                    iconDiv.style.backgroundColor = dataItem.GraphColor;
                    td.appendChild(iconDiv);

                    row.appendChild(td);
                }
                document.getElementById("distributionData").innerHTML = table.outerHTML;


            });
        };       
        return {
            init: init           
        };
    }());
    return summaryDetailModel;
}());