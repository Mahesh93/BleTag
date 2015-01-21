(function (global) {
    var app = global.app = global.app || {};
    var model = kendo.data.Model.define({
        id: "EventId", // the identifier of the model
        fields: {
            'DoorStatus': {
                type: 'string'
            },
            'TemperatureValue': {
                type: 'number'
            },
            'HumidityValue': {
                type: 'number'
            },
            'AmbientlightValue': {
                type: 'number'
            },
            'Angle': {
                type: 'number'
            },
            'MagnetX': {
                type: 'number'
            },
            'MagnetY': {
                type: 'number'
            },
            'MagnetZ': {
                type: 'number'
            },
            'Latitude': {
                type: 'number'
            },
            'Longitude': {
                type: 'number'
            },
            'RecordType': {
                type: 'number'
            },
            'RecordTypeText': {
                type: 'string'
            },
            'BatteryLevel': {
                type: 'number'
            },
            'SoundLevel': {
                type: 'number'
            },
            'SwitchStatus': {
                type: 'number'
            },
            'PosX': {
                type: 'number'
            },
            'PosY': {
                type: 'number'
            },
            'NegX': {
                type: 'number'
            },
            'NegY': {
                type: 'number'
            },
            'PosZ': {
                type: 'number'
            },
            'NegZ': {
                type: 'number'
            },
            'DistanceLsb': {
                type: 'number'
            },
            'DistanceMsb': {
                type: 'number'
            },
            'EventId': {
                type: 'number'
            },
            'ImageSize': {
                type: 'number'
            },
            'EventTime': {
                type: 'number'
            },
            'StartTimeMovement': {
                type: 'number'
            },
            'EndTimeMovement': {
                type: 'number'
            }
        }
    });
    app.models.DeviceData = model;
})(window);