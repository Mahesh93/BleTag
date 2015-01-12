(function (global) {
    var app = global.app = global.app || {};
    var model = kendo.data.Model.define({
        id: "LocationId", // the identifier of the model
        fields: {
            'LocationId': {
                type: 'int '
            },
            'LocationTypeId': {
                type: 'int '
            },
            'SalesRepId': {
                type: 'int '
            },
            'StateId': {
                type: 'int '
            },
            'Zip': {
                type: 'int '
            },
            'Latitude': {
                type: 'float '
            },
            'Longitude': {
                type: 'float '
            },
            'IsKeyAccount': {
                type: 'boolean '
            },
            'City': {
                type: 'string '
            },
            'Name': {
                type: 'string '
            },
            'Street': {
                type: 'string '
            },
            'Street2': {
                type: 'string '
            },
            'Street3': {
                type: 'string '
            },
            'PurityStatus': {
                type: 'string '
            },
            'LocationIndex': {
                type: 'int '
            }
        }
    });
    app.models.LocationList = model;
})(window);