var app = (function (win) {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app;
    var locationData = [];

    $.ajax({
        url: "http://cooler.insigmainc.com/Controllers/Location.ashx?action=List&asArray=0&limit=0&sort=Name&dir=DESC",
        async: false,
        dataType: "json",
        success: function (result) {
            locationData = result.records;
        }

    });
   
    var onBackKeyDown = function (e) {
        e.preventDefault();

        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
            var exit = function () {
                navigator.app.exitApp();
            };

            if (confirmed === true || confirmed === 1) {
                // Stop EQATEC analytics monitor on app exit
                if (analytics.isAnalytics()) {
                    analytics.Stop();
                }
            }
        }, 'Exit', ['OK', 'Cancel']);
    };
    var onDeviceReady = function () {
        // Handle "backbutton" event
        document.addEventListener('backbutton', onBackKeyDown, false);

        navigator.splashscreen.hide();
    };
    // create an object to store the models for each view

    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', onDeviceReady, false);

    // hide the splash screen as soon as the app is ready. otherwise
    // Cordova will wait 5 very long seconds to do it for you.


    var os = kendo.support.mobileOS,
        statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';

    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
        transition: 'slide',
        statusBarStyle: statusBarStyle,
        skin: 'flat',
        initial: 'views/locations.html'
    });
    return {
        mobileApp: mobileApp,
        locationData: locationData
    };



}(window));