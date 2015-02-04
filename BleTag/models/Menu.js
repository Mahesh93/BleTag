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
            },
            'Url': {
                type: 'string'
            },
            'ImageCls': {
                type: 'string'
            }
        }
    });
    app.models.Menu = model;
})(window);