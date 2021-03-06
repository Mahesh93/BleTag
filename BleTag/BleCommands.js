(function (global) {
    var app = global.app = global.app || {};
    app.BleCommands = {
        FETCH_DATA: 1,
        FIRMWARE_DETAIL: 2,
        CURRENT_TIME: 3,
        SERIALNUMBER: 4,
        RESTART_DEVICE: 5,
        RESET_DEVICE: 6,
        SENSOR_ON: 7,
        SENSOR_OFF: 8,
        CURRENT_SENSOR_DATA: 9,
        EVENT_COUNT: 10,
        LATEST_N_EVENTS: 11,
        EVENT_DATA_FROM_IDX_IDY: 12,
        ERASE_EVENT_DATA: 13,
        SOUND_BUZZER: 14,
        SET_INTERVAL: 15,
        SET_REAL_TIME_CLOCK: 16,
        SET_GPS_LOCATION: 17,
        SET_MAJOR_MINOR_VERSION: 18,
        SET_SERIAL_NUMBER: 19,
        SET_ADVERTISING_PERIOD: 20,
        SET_SENSOR_THRESHOLD: 21,
        SET_STANDBY_MODE: 22,
        SET_DEVICE_IN_DFU: 23,
        SET_VALIDATE_PASSWORD: 24,
        SET_CHANGE_PASSWORD: 25,
        SET_RSSI_FOR_IBEACON_FRAME: 26,
        READ_CONFIGURATION_PARAMETER: 27,
        READ_IMAGE_HEADER: 33,
        READ_IMAGE_DATA: 34,
        TAKE_PICTURE: 36,
        READ_GYROSCOPE_DATA: 37
    }
})(window);