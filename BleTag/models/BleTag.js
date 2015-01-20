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
                type: 'int'
            },
            'ManufacturerUUID': {
                type: 'string'
            },
            'Major': {
                type: 'int'
            },
            'Minor': {
                type: 'int'
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