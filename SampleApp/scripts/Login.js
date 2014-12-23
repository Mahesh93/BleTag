(function (global) {
    var app = global.app = global.app || {};
    var loginViewModel = kendo.data.ObservableObject.extend({
        loginDataSource: null,
        init: function () {
            var that = this,
                dataSource,
                jsonUrlToLoad;

            kendo.data.ObservableObject.fn.init.apply(that, []);
            //When you build for Apache Cordova 3.0.0, apply this code instead of using relative URLs. In Apache Cordova 3.0.0, relative URLs might not work properly.
            //jsonUrlToLoad = app.makeUrlAbsolute("data/weather.json");
            jsonUrlToLoad = "http://cooler.insigmainc.com/Controllers/Location.ashx?action=List&asArray=0&limit=0&sort=Name&dir=DESC";

            dataSource = new kendo.data.DataSource({
                schema: {
                    parse: function (response) {
                        //console.log(JSON.stringify(response, null, 4));                        
                        return response.records;
                    }
                },
                transport: {
                    read: {
                        url: jsonUrlToLoad,
                        dataType: "json",
                        type: "GET"
                    }
                }

            });

            that.set("loginDataSource", dataSource);
        }
    });

    app.loginService = {
        viewModel: new loginViewModel(),
        filterinit: function (e) {
            debugger;
            $("#settingsApplyBtn").click(function () {
                debugger;
                history.go(-1);
            });
            $("#settingsCancelBtn").click(function () {
                debugger;
                history.go(-1);
            });
        },
    };

})(window);