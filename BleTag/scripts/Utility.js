(function (global) {
    var app = global.app = global.app || {};
    app.Utility = {
        getDate: function (date) {
            var options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            };
            var dateArray = date.match(app.dateRegex).slice(1);
            var dt = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0] + " " + dateArray[3] + ":" + dateArray[4] + ":" + dateArray[5] + ":" + dateArray[6];
            var currentDate = new Date(dt);
            return currentDate.toLocaleString("en-us", options).replace(/,/g, "");
        },
        getTodayDate: function () {
            var options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            };
            var currentDate = new Date();
            return currentDate.toLocaleString("en-us", options).replace(/,/g, "");
        },
        getPasswordBytes: function (password) {
            var buffer = app.Utility.stringToBytes(password);
            var passwordBytes = new Uint8Array(buffer);
            var bytes = [];
            for (var i = 0; i < 19; i++) {

                if (i < passwordBytes.length)
                    bytes[i] = passwordBytes[i];
                else
                    bytes[i] = 0;
            }

            return bytes;
        },
        bytesToHex: function (buffer, start, end) {
            var bytes = new Uint8Array(buffer);
            var result = "";
            var len = end ? end : bytes.length;
            for (var i = start || 0; i < len; i++) {
                result += bytes[i].toString(16);
            }
            return result;
        },
        base64ToArrayBuffer: function (string) {
            var binaryString = window.atob(string);
            var len = binaryString.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        },
        bytesToEncodedString: function (bytes) {
            return btoa(String.fromCharCode.apply(null, bytes));
        },
        encodedStringToBytes: function (string) {
            var data = atob(string);
            var bytes = new Uint8Array(data.length);
            for (var i = 0; i < bytes.length; i++) {
                bytes[i] = data.charCodeAt(i);
            }
            return bytes;
        },
        arrayBufferToBase64: function (arrayBuffer) {
            return window.btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
        },
        bytesToString: function (buffer) {
            return String.fromCharCode.apply(null, new Uint8Array(buffer));
        },
        stringToBytes: function (string) {
            var array = new Uint8Array(string.length);
            for (var i = 0, l = string.length; i < l; i++) {
                array[i] = string.charCodeAt(i);
            }
            return array.buffer;
        },
        base64ToHex: function (str, start, end) {
            for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
                var tmp = bin.charCodeAt(i).toString(16);
                if (tmp.length === 1) tmp = "0" + tmp;
                hex[hex.length] = tmp;
            }
            if (start)
                return Ext.Array.toArray(hex, start, end ? end : hex.length).join(" ");

            return hex.join(" ");
        },
        readWord: function (bytes) {
            return bytes[0] + bytes[1] * 256;
        },
        readThreeByte: function (bytes) {
            return bytes[0] + bytes[1] * 256 + bytes[2] * 256 * 256;
        },
        readFourByte: function (bytes) {
            return bytes[0] + bytes[1] * 256 + bytes[2] * 256 * 256 + bytes[3] * 256 * 256 * 256;
        },
        readSingle: function (bytes) {
            return bytes[0];
        },
        isInt: function (n) {
            return Number(n) === n && n % 1 === 0;
        },
        getDateFromMilliseconds: function (val) {
            if (!val)
                return null;

            var date = new Date(val * 1000);
            return Ext.Date.format(date, app.Localization.DateTimeWithSecondFormat);
        },
        decimalToBytes: function (val, len) {
            var bytes = [];
            var i = len;
            do {
                bytes[--i] = val & (255);
                val = val >> 8;
            } while (i)
            return bytes;
        },
        dec2Bin: function (dec) {
            if (dec >= 0) {
                return dec.toString(2);
            } else {
                /* Here you could represent the number in 2s compliment but this is not what 
                   JS uses as its not sure how many bits are in your number range. There are 
                   some suggestions http://stackoverflow.com/questions/10936600/javascript-decimal-to-binary-64-bit 
                */
                return (~dec).toString(2);
            }
        },
        renderDeviceData: function (values) {
            debugger;
            var template = null;

            switch (values.RecordType) {
                case app.RecordTypes.HELTHY_EVENT:

                    template = '<table style="margin-left: 10px; width:100%">'+
                        '<tr><td class="device-data-subtitle">' + "Record Type" + '</td><td class="device-data-value">{RecordTypeText}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Door" + '</td><td class="device-data-value">{DoorStatus}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Temperature" + '</td><td class="device-data-value">{TemperatureValue}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Humidity" + '</td><td class="device-data-value">{HumidityValue} %rH</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "AmbientLight" + '</td><td class="device-data-value">{AmbientlightValue} lux</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "SoundLevel" + '</td><td class="device-data-value">{SoundLevel}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "BatteryLevel" + '</td><td class="device-data-value">{BatteryLevel}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Time" + '</td><td class="device-data-value">' + app.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>'+
                        '</table>';
                    break;
                case app.RecordTypes.LINEAR_MOTION:

                    var measurement = "N/A";
                    if (values.DistanceMsb == 0)
                        measurement = "cm";
                    if (values.DistanceMsb == 1)
                        measurement = "m";

                    if (values.DistanceMsb > 1) {
                        var distMsb = app.Utility.dec2Bin(values.DistanceMsb).substring(0, 2);
                        if (distMsb === "00")
                            measurement = "cm";
                        if (distMsb === "01")
                            measurement = "m";
                        if (distMsb === "10")
                            measurement = "ft";
                    }

                    template ='<table style="margin-left: 10px; width:100%">'+
                        '<tr><td class="device-data-subtitle">' + "Record Type" + '</td><td class="device-data-value">{RecordTypeText}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Door" + '</td><td class="device-data-value">{DoorStatus}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Distance" + '</td><td class="device-data-value">{DistanceLsb} ' + measurement + '</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Angle" + '</td><td class="device-data-value">{Angle}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "MagnetX" + '</td><td class="device-data-value">{MagnetX}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "MagnetY" + '</td><td class="device-data-value">{MagnetY}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Time" + '</td><td class="device-data-value">' + app.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>'+
                        '</table>';
                    break;
                case app.RecordTypes.ANGULAR_MOTION:

                    template ='<table style="margin-left: 10px; width:100%">'+
                        '<tr><td class="device-data-subtitle">' + "Record Type" + '</td><td class="device-data-value">{RecordTypeText}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Door" + '</td><td class="device-data-value">{DoorStatus}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "PosXNegX" + '</td><td class="device-data-value">{PosX}/ {NegX}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "PosYNegY" + '</td><td class="device-data-value">{PosY}/ {NegY}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "PosZNegZ" + '</td><td class="device-data-value">{PosZ}/ {NegZ}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Time" + '</td><td class="device-data-value">' + app.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>'+
                        '</table>';
                    break;
                case app.RecordTypes.MAGNET_MOTION:
                    template = '<table style="margin-left: 10px; width:100%">'+
                        '<tr><td class="device-data-subtitle">' + "Record Type" + '</td><td class="device-data-value">{RecordTypeText}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Door" + '</td><td class="device-data-value">{DoorStatus}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "MagnetX" + '</td><td class="device-data-value">{MagnetX}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "MagnetY" + '</td><td class="device-data-value">{MagnetY}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "MagnetZ" + '</td><td class="device-data-value">{MagnetZ}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Time" + '</td><td class="device-data-value">' + app.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>'+
                        '</table>';
                    break;
                case app.RecordTypes.DOOR_EVENT:
                    template ='<table style="margin-left: 10px; width:100%">'+
                        '<tr><td class="device-data-subtitle">' + "RecordType" + '</td><td class="device-data-value">{RecordTypeText}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Door" + '</td><td class="device-data-value">{DoorStatus}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Time" + '</td><td class="device-data-value">' + app.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>'+
                        '</table>';
                    break;
                case app.RecordTypes.IMAGE_EVENT:
                    template ='<table style="margin-left: 10px; width:100%">'+
                        '<tr><td class="device-data-subtitle">' + "Record Type" + '</td><td class="device-data-value">{RecordTypeText}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "PosX" + '</td><td class="device-data-value">{PosX}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "NegX" + '</td><td class="device-data-value">{NegX}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "PosY" + '</td><td class="device-data-value">{PosY}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "NegY" + '</td><td class="device-data-value">{NegY}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "PosZ" + '</td><td class="device-data-value">{PosZ}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "NegZ" + '</td><td class="device-data-value">{NegZ}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "ImageSize" + '</td><td class="device-data-value">{ImageSize}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Time" + '</td><td class="device-data-value">' + app.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>'+
                        '</table>';
                    break;
                case app.RecordTypes.GPS_EVENT:
                    template ='<table style="margin-left: 10px; width:100%">'+
                        '<tr><td class="device-data-subtitle">' + "RecordType" + '</td><td class="device-data-value">{RecordTypeText}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Door" + '</td><td class="device-data-value">{DoorStatus}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Latitude" + '</td><td class="device-data-value">{Latitude}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Longitude" + '</td><td class="device-data-value">{Longitude}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Time" + '</td><td class="device-data-value">' + app.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>'+
                        '</table>';
                    break;
                case app.RecordTypes.MOTION_TIME:
                    template ='<table style="margin-left: 10px; width:100%">'+
                        '<tr><td class="device-data-subtitle">' + "Record Type" + '</td><td class="device-data-value">{RecordTypeText}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Door" + '</td><td class="device-data-value">{DoorStatus}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "StartTimeMovement" + '</td><td class="device-data-value">' + app.Utility.getDateFromMilliseconds(values.StartTimeMovement) + '</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "EndTimeMovement" + '</td><td class="device-data-value">' + app.Utility.getDateFromMilliseconds(values.EndTimeMovement) + '</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Time" + '</td><td class="device-data-value">' + app.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>'+
                        '</table>';
                    break;
                default:
                    template = '<table style="margin-left: 10px; width:100%">'+
                        '<tr><td class="device-data-subtitle">' + "Record Type" + '</td><td class="device-data-value">{RecordTypeText}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Door" + '</td><td class="device-data-value">{DoorStatus}</td></tr>'+
                        '<tr><td class="device-data-subtitle">' + "Time" + '</td><td class="device-data-value">' + app.Utility.getDateFromMilliseconds(values.EventTime) + '</td></tr>'+
                        '</table>';
                    break;
            }

            return template.apply(values);
        }
    }
})(window);