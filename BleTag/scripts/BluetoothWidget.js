(function (global) {
    var app = global.app = global.app || {};
    var bluetooth = kendo.ui.Widget.extend({
        config: {
            scanDuration: 10000,
            record: null,
            isConnected: false,
            password: null,
            activeDeviceAddress: null
        },
        init: function (element, options) {
            if (typeof ble === "undefined") {
                console.log('Ble not Available new');
            } else {
                console.log("Ble available new");
            }
            // base call to initialize widget
            kendo.ui.Widget.fn.init.call(this, element, options);
        },
        onConnectWithPassword: function (deviceAddress, password, record) {
            var me = this;
            console.log("onConnectWithPassword : " + deviceAddress);
            me.config.isConnected = false;
            me.config.record = record;
            me.config.password = password;
            ble.connect(deviceAddress, me.connectSuccess, me.connectError);
        },
        connectSuccess: function (obj) {
            console.log("Connected initial");
            var me = app.bluetoothService.bluetooth;
            me.config.isConnected = false;
            me.activeDeviceAddress = obj.id;
            ble.startNotification(obj.id, me.config.serviceUuid, me.config.noitfyCharacteristicUuid, me.onData, me.onError);

            var password = app.Utility.getPasswordBytes(me.config.password);

            me.writeBleCommand(app.BleCommands.SET_VALIDATE_PASSWORD, password);
        },
        connectError: function (reason) {
            console.log("CONNECT ERROR: " + reason);
            var me = Ext.ComponentQuery.query('ble-bluetooth')[0];            
            me.stopNotification();
            me.fireEvent('updatestatus', "CONNECT ERROR: " + reason, true);
            me.fireEvent('connectError', reason);
        },
        startScan: function () {
            console.log('start scan');
            var me = this;
            var paramsObj = { /*"serviceUuids":[heartRateServiceUuid] */ };
            ble.scan([], (me.config.scanDuration / 1000), me.startScanSuccess, me.startScanError, paramsObj);
            //Ext.Function.defer(this.scanTimeout, this.getScanDuration(), this);

        },
        onDisconnectDevice: function () {
            var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
            var record = me.getRecord();
            if (!record) {
                Ext.Msg.alert(BleTag.Localization.Error, BleTag.Localization.ConnectDeviceErrorMessage);
                return;
            }
            ble.disconnect(record.get('MacAddress'), this.disconnectSuccess, this.disconnectError);
        },
        disconnectSuccess: function (obj) {
            console.log("disconnectSuccess");
            var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
            me.fireEvent('disconnectSuccess', obj);
            me.fireEvent('stopNotification');
        },
        disconnectError: function (error) {
            console.log("disconnectError : " + error);
            var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
            me.fireEvent('disconnectError', error);
        },
        startScanSuccess: function (obj) {
            console.log("Scan result... - " + obj.id);
            //var store = this.getScanningDeviceList().getStore();
            // var index = store.findExact('MacAddress', obj.id);
            if (-1 === -1) {
                var bytes = new Uint8Array(obj.advertising);

                var BEACON_LENGTH = app.Utility.readSingle(bytes.subarray(0, 1));
                var AD_TYPE = app.Utility.readSingle(bytes.subarray(1, 2));
                var BEACON_FLAGS = app.Utility.readSingle(bytes.subarray(2, 3));
                var BEACON_DATA_LENGTH = app.Utility.readSingle(bytes.subarray(3, 4));
                var BEACON_AD_TYPE = app.Utility.readSingle(bytes.subarray(4, 5));

                var BEACON_COMPANY_IDENTIFIER = app.Utility.bytesToString(bytes.subarray(5, 7));

                var BEACON_TYPE = app.Utility.readWord(bytes.subarray(7, 9));
                var uuid = app.Utility.bytesToHex(obj.advertising, 9, 25);

                var MAJOR_VER = app.Utility.bytesToHex(obj.advertising, 25, 27);
                var MINOR_VER = app.Utility.bytesToHex(obj.advertising, 27, 29);
                var MEASURED_POWER = app.Utility.readSingle(bytes.subarray(29, 30));
                //Second part
                var DEVICE_DATA_LENGTH = app.Utility.readSingle(bytes.subarray(30, 31));
                var DEVICE_AD_TYPE = app.Utility.readSingle(bytes.subarray(31, 32));
                var DEVICE_NAME = app.Utility.readSingle(bytes.subarray(33, 34));
                console.log('before add');
                var record = new app.models.BleTag({
                    MacAddress: obj.id,
                    Advertisement: app.Utility.arrayBufferToBase64(obj.advertising),
                    DeviceName: obj.name,
                    ManufacturerUUID: uuid,
                    Major: MAJOR_VER,
                    Minor: MINOR_VER,
                    Rssi: MEASURED_POWER,
                    IsConnected: false
                });
                app.DebugDeviceService.debugModel.DebugDeviceDataSource.add(record);
            }
        },
        startScanError: function (obj) {
            console.log("Start scan error: " + obj.error + " - " + obj.message);
        },
        initializeBluetooth: function () {
            var me = this;
            console.log('initialize bluetooth');
            //bluetoothle is an global object of third party    	
            ble.isEnabled(me.initializeSuccess, me.initializeError);
        },
        initializeSuccess: function (obj) {
            console.log("initializeSuccess");
            // var store = this.getScanningDeviceList().getStore();
            // store.removeAll();
            app.bluetoothService.bluetooth.startScan();
        },
        initializeError: function () {
            alert("Please enable bluetooth and try again");
        },
        writeBleCommand: function (command, param) {
            var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
            me.setActiveCommand(command);
            me.setResponseCount(0);

            console.log("Command write : " + command + " Param : " + param);

            console.log("writeBleCommand : " + me.getResponseCount());
            me.fireEvent('updatestatus', 'Writing command...', false);
            var bytes = [];
            bytes.push(command);

            if (param) {
                for (var i = 0; i < param.length; i++) {
                    bytes.push(param[i]);
                }
            }
            console.log("Command Bytes : " + bytes + " Param : " + param);
            var cmd = BleTag.util.Utility.bytesToEncodedString(bytes);
            ble.write(me.getActiveDeviceAddress(), me.getServiceUuid(), me.getCharacteristicUuid(), cmd, me.writeSuccess, me.writeFailure);
        },
        writeSuccess: function (data) {
            console.log("Write success");
            var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
            me.fireEvent('updatestatus', 'Writing command completed...', true);
            console.log(data);
        },
        writeFailure: function (reason) {
            var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
            me.fireEvent('updatestatus', 'Writing command completed...', true);
            me.fireEvent('stopNotificatoin');
            console.log("WRITE ERROR: " + reason);
        },
        onData: function (data) {

            var me = Ext.ComponentQuery.query('ble-bluetooth')[0];

            var resCount = me.getResponseCount();
            resCount++;

            me.setResponseCount(resCount);

            console.log("notify success " + (resCount) + ": " + me.getActiveCommand());
            console.log(new Uint8Array(data));

            me.fireEvent('bleresponse', data);

        },
        onError: function (reason) {
            var me = Ext.ComponentQuery.query('ble-bluetooth')[0];
            me.fireEvent('stopNotificatoin');
            console.log("ERROR: " + reason); // real apps should use notification.alert
        }

    });

    app.bluetoothService = {
        bluetooth: new bluetooth()
    };

})(window);