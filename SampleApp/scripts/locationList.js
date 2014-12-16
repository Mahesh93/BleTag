var app = app || {};

app.Activities = (function () {
    'use strict'
    // Activities model
    var activitiesModel = (function () {
        var activityModel = {

            id: 'LocationTypeId',
            fields: {
                Name: {
                    field: 'Name',
                    defaultValue: ''
                },
                Street: {
                    field: 'Street',
                    defaultValue: ''
                },
                Street2: {
                    fields: 'Street2',
                    defaultValue: ''
                },
                Street3: {
                    field: 'Street3',
                    defaultValue: ''
                },
                City: {
                    field: 'City',
                    defaultValue: ''
                },
                Zip: {
                    field: 'Zip',
                    defaultValue: ''
                }
            }
        };
        var locationDataSource = [];
        // Activities data source. The Backend Services dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations.
        var activitiesDataSource = new kendo.data.DataSource({
            data: app.locationData
        });       
        return {
            activities: activitiesDataSource
        };

    }());
    var activitiesViewModel = (function () {
        var activitySelected = function (e) {
            
            app.mobileApp.navigate('views/summaryList.html?LocationId=' + e.data.LocationId);
        };
        return {
            activities: activitiesModel.activities,
            activitySelected: activitySelected
        };

    }());

    return activitiesViewModel;


}());