(function (global) {
    var app = global.app = global.app || {};
    app.RecordTypes = {
        HELTHY_EVENT: 0,
        LINEAR_MOTION: 1,
        ANGULAR_MOTION: 2,
        MAGNET_MOTION: 3,
        DOOR_EVENT: 4,
        IMAGE_EVENT: 5,
        GPS_EVENT: 6,
        MOTION_TIME: 7
    }
})(window);