(function (global) {
    var app = global.app = global.app || {};
    var model = kendo.data.Model.define({
        id: "AssetId", // the identifier of the model
        fields: {
            'AssetId': {
                type: 'number '
            },
            'AssignedToUserId': {
                type: 'number '
            },
            'Columns': {
                type: 'number '
            },
            'CoolerImageId': {
                type: 'number '
            },
            'ForeignProduct': {
                type: 'number '
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
                type: 'number '
            },
            'Priority': {
                type: 'number '
            },
            'ProcessSecond': {
                type: 'number '
            },
            'PurityIssue': {
                type: 'number '
            },
            'PurityPerc': {
                type: 'number '
            },
            'PurityStatus': {
                type: 'string '
            },
            'RowNumber': {
                type: 'number '
            },
            'Shelves': {
                type: 'number '
            },
            'StatusId': {
                type: 'number '
            },
            'Stock': {
                type: 'number '
            },
            'VerifiedOn': {
                type: 'date '
            }
        }
    });    
    app.models.CoolerImageList = model;    
})(window);