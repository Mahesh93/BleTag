(function (global) {
    var  app = global.app = global.app || {};    
    var SummaryDetailDataModel = kendo.data.ObservableObject.extend({
        summaryDetailDataSource: null,        
        init: function (e) {
            var that = this,
                dataSource,
                jsonUrlToLoad;

            kendo.data.ObservableObject.fn.init.apply(that, []);    
            jsonUrlToLoad = "http://cooler.insigmainc.com/Controllers/AssetInfo.ashx?action=load";
            dataSource = new kendo.data.DataSource({  
                group: { field: "SerialNumber" }, 
                schema:{
                   parse: function(response) {                   
                       var model = new app.models.SummaryList(response.data);
                       model.AssetId = model.Id;                  
                       return [model];
                    }
                },                
                transport: {
                       read:  {
                           url: jsonUrlToLoad,
                           dataType: "json",
                           type: "GET"                           
                      }                               
                },
                change: function (data) {
                   var record = data.items[0].items[0];
                   app.summaryDetailService.record = record;
                   var id = record.get('Id');
                   if(id !=0){             
                    var summaryStockData = [];
                    var stockDetails = record.StockDetails;
                    stockDetails.forEach(function (item) {
                        summaryStockData.push({
                            label: item.ProductName,
                            value: item.Qty,
                            color: item.GraphColor
                        });
                     });                          
                     app.summaryDetailService.loadChart(summaryStockData);
                     app.summaryDetailService.loadDistributionData(record.Details, record.Columns);
                     app.summaryDetailService.loadImages(record);
                       
                    }
                },
                error: function (xhr, error) {
                    //Show error
                }
                
            });            
            that.set("summaryDetailDataSource", dataSource);
        }        
    });
    app.summaryDetailService = {  
        assetId: null,
        record: null,
        imageLoad: function(e){
            $("#coolerPageTitle").html(e.view.params.imageId + "-" + e.view.params.latestProcessedImageDateTime)
            $("#coolerImagePreview").attr("src", "http://cooler.insigmainc.com/Controllers/CoolerImage.ashx?action=other&otherAction=Download&id=" + e.view.params.imageId);
        },
        viewModel: new SummaryDetailDataModel(),
        loadChart: function(summaryStockData){
            var chart = new FusionCharts({
                type: "pie2d",
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
        },
        loadDistributionData: function(details, columns){               
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
        },
        loadImages: function(summaryDetailData){           
           if (summaryDetailData.LatestProcessedImageId > 0) {
                 $('#coolerImageTitle').text(summaryDetailData.LatestProcessedImageId + "-" + summaryDetailData.LatestProcessedImageDateTime);
                 $("#lastProcessedImage").attr("src", "http://cooler.insigmainc.com/Controllers/CoolerImage.ashx?action=other&otherAction=Download&width=320&height=220&id=" + summaryDetailData.LatestProcessedImageId);
                 $("#lastProcessedImage").click(function () {                 
                     app.BleTag.main.navigate('views/CoolerImageView.html?imageId= '+ app.summaryDetailService.record.LatestProcessedImageId +'&latestProcessedImageDateTime='+ app.summaryDetailService.record.LatestProcessedImageDateTime);                 
                 });   
            }
            if (summaryDetailData.LatestProcessedImageId != summaryDetailData.LatestImageId && summaryDetailData.LatestImageId > 0) {
                 $('#lastImageTitle').text(summaryDetailData.LatestImageId + "-" + summaryDetailData.LatestProcessedImageDateTime);
                 $("#lastImage").attr("src", "http://cooler.insigmainc.com/Controllers/CoolerImage.ashx?action=other&otherAction=Download&width=320&height=220&id=" + summaryDetailData.LatestImageId);
                 $("#lastImage").click(function () {                 
                     app.BleTag.main.navigate('views/CoolerImageView.html?imageId= '+ app.summaryDetailService.record.LatestImageId +'&latestProcessedImageDateTime='+ app.summaryDetailService.record.LatestProcessedImageDateTime);                 
                 }); 
            }
        },
        show: function(e){          
          app.summaryDetailService.assetId = e.view.params.assetId;
          app.summaryDetailService.viewModel.summaryDetailDataSource.read({Id : e.view.params.assetId});
        }        
    };    
  
})(window);