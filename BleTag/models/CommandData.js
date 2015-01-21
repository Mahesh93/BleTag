(function (global) {
    var app = global.app = global.app || {};
    var model = kendo.data.Model.define({        
        fields: {
            'Title': {
                type: 'string '
            },
            'Data': {
                type: 'string'
            },
            'StatusId': {
                type: 'number'
            },
            'Command': {
                type: 'string'
            },
            'LabelWidth': {
                type: 'string'
            }
        }
    });
    app.models.CommandData = model;
})(window);