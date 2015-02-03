(function (global) {
    var app = global.app = global.app || {};
    var bluetooth = kendo.ui.Widget.extend({
        config: {
            scanDuration: 10000,
            manufactureUuid: "48F8C9EFAEF9482D987F3752F1C51DA1",
            serviceUuid: "81469e83-ef6f-42af-b1c6-f339dbdce2ea",
            characteristicUuid: "8146c203-ef6f-42af-b1c6-f339dbdce2ea",
            noitfyCharacteristicUuid: "8146c201-ef6f-42af-b1c6-f339dbdce2ea",
            password: null,
            activeCommand: null,
            activeDeviceAddress: null,
            isConnected: false,
            record: null,
            responseCount: 0
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
            me.config.activeDeviceAddress = obj.id;
            ble.startNotification(obj.id, me.config.serviceUuid, me.config.noitfyCharacteristicUuid, me.onData, me.onError);

            var password = app.Utility.getPasswordBytes(me.config.password);

            me.writeBleCommand(app.BleCommands.SET_VALIDATE_PASSWORD, password);
        },
        connectError: function (reason) {
            console.log("CONNECT ERROR: " + reason);
            var me = app.bluetoothService.bluetooth;
            me.stopNotification();
            me.onUpdateStatus("CONNECT ERROR: " + reason, true);
        },
        onUpdateStatus: function (arg, canClose) {
            console.log("calling status  : param 1" + arg + " Param 2:" + canClose);            if (canClose) {
                console.log("disable mask");
                kendo.ui.progress($('body div[data-role=splitview]'), false);
                
                return;
            }
            kendo.ui.progress($('body div[data-role=splitview]'), true);
        },
        startScan: function () {
            console.log('start scan');
            var me = this;
            var paramsObj = { /*"serviceUuids":[heartRateServiceUuid] */ };
            ble.scan([], (me.config.scanDuration / 1000), me.startScanSuccess, me.startScanError, paramsObj);

        },
        onDisconnectDevice: function () {
            var me = app.bluetoothService.bluetooth;
            var record = me.config.record;

            if (!record) {
                alert('Please connect device first');
                return;
            }
            ble.disconnect(record.MacAddress, this.disconnectSuccess, this.disconnectError);
        },
        disconnectSuccess: function (obj) {
            console.log("disconnectSuccess");
            var me = app.bluetoothService.bluetooth;
            app.BluetoothDeviceActor.updateConnectionState(false);
            me.config.record = null;
            me.config.isConnected = false;
            me.stopNotification();
        },
        disconnectError: function (error) {
            console.log("disconnectError : " + error);
        },
        startScanSuccess: function (obj) {
            console.log("Scan result... - " + obj.id);
            var store = app.DebugDeviceService.debugModel.debugDeviceDataSource;
            // var index = store.findExact('MacAddress', obj.id);
            var data = store.get(obj.id);
            if (data)
                return;

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
                ManufacturerUUID: uuid.toUpperCase(),
                Major: MAJOR_VER,
                Minor: MINOR_VER,
                Rssi: MEASURED_POWER,
                IsConnected: false
            });
            store.add(record);

        },
        startScanError: function (obj) {
            console.log("Start scan error: " + obj.error + " - " + obj.message);
        },
        initializeBluetooth: function () {
            var me = this;
            console.log('initialize bluetooth');
            //ble is an global object of third party    	
            ble.isEnabled(me.initializeSuccess, me.initializeError);
        },
        initializeSuccess: function (obj) {
            console.log("initializeSuccess");
            app.DebugDeviceService.debugModel.debugDeviceDataSource.read([]);
            app.bluetoothService.bluetooth.startScan();
        },
        initializeError: function () {
            alert("Please enable bluetooth and try again");
        },
        writeBleCommand: function (command, param) {
            var me = app.bluetoothService.bluetooth;
            me.config.activeCommand = command;
            me.config.responseCount = 0;

            console.log("Command write : " + command + " Param : " + param);
            console.log("writeBleCommand : " + me.config.responseCount);
            me.onUpdateStatus('Writing command...', false);

            var bytes = [];
            bytes.push(command);

            if (param) {
                for (var i = 0; i < param.length; i++) {
                    bytes.push(param[i]);
                }
            }
            console.log("Command Bytes : " + bytes + " Param : " + param);
            var cmd = app.Utility.bytesToEncodedString(bytes);
            ble.write(me.config.activeDeviceAddress, me.config.serviceUuid, me.config.characteristicUuid, cmd, me.writeSuccess, me.writeFailure);
        },
        writeSuccess: function (data) {
            console.log("Write success");
            var me = app.bluetoothService.bluetooth;
            me.onUpdateStatus('Writing command completed...', true);
            console.log(data);
        },
        writeFailure: function (reason) {
            var me = app.bluetoothService.bluetooth;
            console.log("WRITE ERROR: " + reason);
            if (reason.indexOf('is not connected') != -1) {
                me.disconnectSuccess();
                return;
            }
            me.onUpdateStatus('Writing command error completed...', true);
            me.stopNotification();

        },
        onData: function (data) {
            var me = app.bluetoothService.bluetooth;
            var resCount = me.config.responseCount;
            resCount++;

            me.config.responseCount = resCount;

            console.log("notify success " + (resCount) + ": " + me.config.activeCommand);
            console.log(new Uint8Array(data));
            app.BluetoothDeviceActor.onBleResponse(data);
        },
        onError: function (reason) {
            var me = app.bluetoothService.bluetooth;
            me.stopNotification();
            console.log("ERROR: " + reason); // real apps should use notification.alert
        },
        stopNotification: function (obj) {
            console.log("Stop Notification");
            var me = app.bluetoothService.bluetooth;
            if (!me.config.activeDeviceAddress)
                return;
            ble.stopNotification(me.config.activeDeviceAddress, me.config.serviceUuid, me.config.noitfyCharacteristicUuid, me.onStopNotifySuccess, me.onStopNotifyError);
        },
        onStopNotifyError: function (reason) {
            console.log("Stop Notification error : " + reason);
        },
        onStopNotifySuccess: function (obj) {
            console.log("Stop Notification success : " + obj);
        }

    });

    app.bluetoothService = {
        bluetooth: new bluetooth()
    };

})(window);