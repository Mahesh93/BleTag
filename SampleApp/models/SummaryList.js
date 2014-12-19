(function (global) {
    var  app = global.app = global.app || {};   
    var model = kendo.data.Model.define({
    id: "AssetId", // the identifier of the model
    fields: {
        'LocationId':{ type: 'int ' },
        'AssetTypeId': { type: 'int ' },
        'SerialNumber': { type: 'auto' },
        'IsActive': { type: 'boolean' },
        'Latitude': { type: 'float' },
        'Longitude': { type: 'float' },
        'LatestCoolerInfoId': { type: 'int' },
        'StockDetails':{ type: 'string' },
        'DoorOpen': { type: 'date' },
        'DoorClose':{ type: 'date' },
        'DoorOpenDuration':{ type: 'int' },
        'LightIntensity':{ type: 'int' },
        'Temperature': { type: 'float' },
        'Humidity':{ type: 'int' },
        'SoundLevel':{ type: 'int' },
        'LatestLatitude': { type: 'float' },
        'LatestLongitude': { type: 'float' },
        'StockRemoved': { type: 'int' },
        'PurityIssue':{ type: 'boolean' },
        'Location':{ type: 'string' },
        'AssetType':{ type: 'string' },
        'City':{ type: 'string' },
        'Street':{ type: 'string ' },
        'Street2': { type: 'string ' },
        'Street3':{ type: 'string ' },
        'Zip':{ type: 'auto ' },
        'State':{ type: 'string ' },
        'Country':{ type: 'string ' },
        'StateId':{ type: 'int ' },
        'CountryId':{ type: 'int ' },
        'IsSmart':{ type: 'boolean ' },
        'IsUnhealthy':{ type: 'boolean ' },
        'Columns':{ type: 'int ' },
        'Shelves':{ type: 'int ' },
        'ItemsPerColumn':{ type: 'int ' },
        'ForeignProduct':{ type: 'auto ' },
        'LatestProcessedImageId':{ type: 'int ' },
        'Stock':{ type: 'int ' },
        'AssetId':{ type: 'int' },        
        'DeviceStatus':{ defaultValue: 0, type: 'int' }       
        }        
    });    
    app.models = {
        SummaryList: model
    };    
})(window);