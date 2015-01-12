(function (global) {
    var app = global.app = global.app || {};
    var model = kendo.data.Model.define({
        id: "AssetId", // the identifier of the model
        fields: {
            'AssetId': {
                type: 'int '
            },
            'AssignedToUserId': {
                type: 'int '
            },
            'Columns': {
                type: 'int '
            },
            'CoolerImageId': {
                type: 'int '
            },
            'ForeignProduct': {
                type: 'int '
            },
            'ImageDateTime': {
                type: 'date '
            },
            'ImageName': {
                type: 'string '
            },
            'IsVerified': {
                type: 'boolean '
            },
            'ItemsPerColumn': {
                type: 'int '
            },
            'Priority': {
                type: 'int '
            },
            'ProcessSecond': {
                type: 'int '
            },
            'PurityIssue': {
                type: 'int '
            },
            'PurityPerc': {
                type: 'int '
            },
            'PurityStatus': {
                type: 'string '
            },
            'RowNumber': {
                type: 'int '
            },
            'Shelves': {
                type: 'int '
            },
            'StatusId': {
                type: 'int '
            },
            'Stock': {
                type: 'int '
            },
            'VerifiedOn': {
                type: 'date '
            }
        }
    });    
    app.models.CoolerImageList = model;    
})(window);