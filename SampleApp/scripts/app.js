(function (global) {

    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var  app = global.app = global.app || {};
    // this function is called by Cordova when the application is loaded by the device
    document.addEventListener('deviceready', function () {  
      
        // Handle "backbutton" event
        document.addEventListener("backbutton", function (e) {
                e.preventDefault();
                navigator.app.backHistory();
            }, true);

      // hide the splash screen as soon as the app is ready. otherwise
      // Cordova will wait 5 very long seconds to do it for you.
      navigator.splashscreen.hide();
      var os = kendo.support.mobileOS,
                    statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';
      app = new kendo.mobile.Application(document.body, {       
        transition: 'slide',    
        statusBarStyle: statusBarStyle,
        skin: 'flat',
        initial: 'views/LocationList.html'
      });

    }, false);  

}(window));