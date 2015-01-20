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
            var buffer = BleTag.util.Utility.stringToBytes(password);
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
        }
    }
})(window);