(function (global) {
    var app = global.app = global.app || {};
    var model = kendo.data.Model.define({
        id: "MacAddress", // the identifier of the model
        fields: {
            'MacAddress': {
                type: 'string'
            },
            'DeviceName': {
                type: 'string'
            },
            'Advertisement': {
                type: 'number'
            },
            'ManufacturerUUID': {
                type: 'string'
            },
            'Major': {
                type: 'number'
            },
            'Minor': {
                type: 'number'
            },
            'Rssi': {
                type: 'string'
            },
            'IsConnected': {
                type: 'boolean'
            }           
        }
    });
    app.models.BleTag = model;
})(window);