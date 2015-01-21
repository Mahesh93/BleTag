(function (global) {
    var  app = global.app = global.app || {};   
    var model = kendo.data.Model.define({
    id: "AssetId", // the identifier of the model
    fields: {
        'LocationId':{ type: 'number ' },
        'AssetTypeId': { type: 'number ' },
        'SerialNumber': { type: 'string' },
        'IsActive': { type: 'boolean' },
        'Latitude': { type: 'number' },
        'Longitude': { type: 'number' },
        'LatestCoolerInfoId': { type: 'number' },
        'StockDetails':{ type: 'string' },
        'DoorOpen': { type: 'date' },
        'DoorClose':{ type: 'date' },
        'DoorOpenDuration':{ type: 'number' },
        'Lightnumberensity':{ type: 'number' },
        'Temperature': { type: 'number' },
        'Humidity':{ type: 'number' },
        'SoundLevel':{ type: 'number' },
        'LatestLatitude': { type: 'number' },
        'LatestLongitude': { type: 'number' },
        'StockRemoved': { type: 'number' },
        'PurityIssue':{ type: 'boolean' },
        'Location':{ type: 'string' },
        'AssetType':{ type: 'string' },
        'City':{ type: 'string' },
        'Street':{ type: 'string ' },
        'Street2': { type: 'string ' },
        'Street3':{ type: 'string ' },
        'Zip':{ type: 'string ' },
        'State':{ type: 'string ' },
        'Country':{ type: 'string ' },
        'StateId':{ type: 'number ' },
        'CountryId':{ type: 'number ' },
        'IsSmart':{ type: 'boolean ' },
        'IsUnhealthy':{ type: 'boolean ' },
        'Columns':{ type: 'number ' },
        'Shelves':{ type: 'number ' },
        'ItemsPerColumn':{ type: 'number ' },
        'ForeignProduct':{ type: 'string ' },
        'LatestProcessedImageId':{ type: 'number ' },
        'Stock':{ type: 'number ' },
        'AssetId':{ type: 'number' },        
        'DeviceStatus':{ defaultValue: 0, type: 'number' }       
        }        
    });    
   
    app.models.SummaryList = model;    
})(window);