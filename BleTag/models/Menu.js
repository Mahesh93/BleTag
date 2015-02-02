(function (global) {
    var app = global.app = global.app || {};
    var model = kendo.data.Model.define({
        id: "MenuId", // the identifier of the model
        fields: {
            'Title': {
                type: 'string'
            },
            'MenuId': {
                type: 'number'
            }            
        }
    });
    app.models.Menu = model;
})(window);