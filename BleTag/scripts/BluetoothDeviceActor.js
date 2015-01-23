(function (global) {
    var app = global.app = global.app || {};
    app.BluetoothDeviceActor = {
        config: {
            totalRecords: 0,
            listData: null,
            deviceData: null,
            selectedRecord: null,
            commandData: null
        },
        onBleResponse: function (data) {
            debugger;
            var me = this,
                bluetooth = app.bluetoothService.bluetooth;

            var bytes = new Uint8Array(data);
            var command = bluetooth.config.activeCommand
            console.log("response : " + bluetooth.config.responseCount + " cmd : " + command);

            if (command == app.BleCommands.SET_VALIDATE_PASSWORD) {
                me.handlePasswordResponse(bytes);
                bluetooth.config.activeCommand = null;
                return;
            }

            if (bluetooth.config.responseCount == 1) {
                bluetooth.onUpdateStatus('Status received...', true);
                me.processData(bytes);
            } else {
                if (command == app.BleCommands.READ_CONFIGURATION_PARAMETER) {
                    me.processData(bytes);
                    return;
                }
                if (bluetooth.config.responseCount == 2) {
                    bluetooth.onUpdateStatus('Processing device data...', false);
                }
                me.processListData(bytes);
            }
        },
        processData: function (bytes) {
            debugger;
            console.log("first response  : " + new Uint8Array(bytes));
            var me = this,
                bluetooth = app.bluetoothService.bluetooth,
                command = bluetooth.config.activeCommand;
            me.config.totalRecords = 0;
            var isSuccess = bytes.subarray(0, 1)[0];
            var packetId = 0;
            me.config.listData = null;

            var success = isSuccess === 1 ? 'Success' : 'Failed';
            var labelWidth = '50%';
            if (command === app.BleCommands.EVENT_DATA_FROM_IDX_IDY)
                labelWidth = "240px";
            if (command === app.BleCommands.CURRENT_TIME)
                labelWidth = "140px";

            if (command === app.BleCommands.READ_CONFIGURATION_PARAMETER) {
                packetId = app.Utility.readSingle(bytes.subarray(1, 2));
                labelWidth = "230px";
                if (packetId > 1)
                    me.addCommandDataModel("-------------------------------------------------", "--------------", isSuccess, command, labelWidth);
            }

            me.addCommandDataModel('Status', success, isSuccess, command, labelWidth);

            switch (command) {
                case app.BleCommands.EVENT_DATA_FROM_IDX_IDY:
                case app.BleCommands.LATEST_N_EVENTS:
                case app.BleCommands.FETCH_DATA:
                case app.BleCommands.CURRENT_SENSOR_DATA:
                    var totalRecords = app.Utility.readWord(bytes.subarray(1, 3));
                    me.config.totalRecords = totalRecords;
                    var label = command === app.BleCommands.EVENT_DATA_FROM_IDX_IDY ? 'Number of event that will be sent' : 'Total Event';
                    me.addCommandDataModel(label, totalRecords, isSuccess, command, labelWidth);
                    break;
                case app.BleCommands.FIRMWARE_DETAIL:
                    var majorVersion = app.Utility.readSingle(bytes.subarray(1, 2));
                    var minorVersion = app.Utility.readSingle(bytes.subarray(2, 3));

                    me.addCommandDataModel('Major Version', majorVersion, isSuccess, command, labelWidth);
                    me.addCommandDataModel('Minor Version', minorVersion, isSuccess, command, labelWidth);
                    break;
                case app.BleCommands.CURRENT_TIME:
                    var time = app.Utility.readFourByte(bytes.subarray(1, 5));
                    me.addCommandDataModel('Time of device', app.Utility.getDateFromMilliseconds(time), isSuccess, command, labelWidth);
                    break;
                case app.BleCommands.SERIALNUMBER:
                    var serialNumber = app.Utility.bytesToString(bytes.subarray(1, 15));
                    me.addCommandDataModel('Device Serial Number', serialNumber, isSuccess, command, labelWidth);
                    break;
                case app.BleCommands.EVENT_COUNT:
                    var currentEventIndex = app.Utility.readWord(bytes.subarray(1, 3));
                    var rangeOfEventId = app.Utility.readWord(bytes.subarray(3, 5));

                    me.addCommandDataModel('Current Event Index', currentEventIndex, isSuccess, command, labelWidth);
                    me.addCommandDataModel('Range of Event Id', rangeOfEventId, isSuccess, command, labelWidth);

                    break;
                case app.BleCommands.READ_CONFIGURATION_PARAMETER:
                    if (packetId === 1) {
                        me.addCommandDataModel('Packet Id', packetId, isSuccess, command, labelWidth);
                        me.addCommandDataModel('Periodic Interval (In Minutes)', app.Utility.readSingle(bytes.subarray(2, 3)), isSuccess, command, labelWidth);
                        me.addCommandDataModel('Latitude', app.Utility.readFourByte(bytes.subarray(3, 7)), isSuccess, command, labelWidth); //4 byte
                        me.addCommandDataModel('Longitude', app.Utility.readFourByte(bytes.subarray(7, 11)), isSuccess, command, labelWidth); //4 byte
                        me.addCommandDataModel('Major Version', app.Utility.readWord(bytes.subarray(11, 13)), isSuccess, command, labelWidth); //2bytes
                        me.addCommandDataModel('Minor Version', app.Utility.readWord(bytes.subarray(13, 15)), isSuccess, command, labelWidth);
                        me.addCommandDataModel('Advertising Period (MilliSeconds)', app.Utility.readWord(bytes.subarray(15, 17)), isSuccess, command, labelWidth);
                        me.addCommandDataModel('Standby Control', app.Utility.readSingle(bytes.subarray(17, 18)), isSuccess, command, labelWidth);
                        me.addCommandDataModel('Sensor Group-1 Power status', app.Utility.readSingle(bytes.subarray(18, 19)), isSuccess, command, labelWidth);
                        me.addCommandDataModel('Sensor Group-2 Power status', app.Utility.readSingle(bytes.subarray(19, 20)), isSuccess, command, labelWidth);
                        return;
                    } else {
                        me.addCommandDataModel('Packet Id', packetId, isSuccess, command, labelWidth);
                        me.addCommandDataModel('Periodic Interval (In Minutes)', app.Utility.readSingle(bytes.subarray(2, 3)), isSuccess, command, labelWidth);
                        me.addCommandDataModel('Temperature out of threshold', app.Utility.readWord(bytes.subarray(3, 5)), isSuccess, command, labelWidth); //2 byte				
                        me.addCommandDataModel('Light out of threshold', app.Utility.readWord(bytes.subarray(5, 7)), isSuccess, command, labelWidth); //2 byte				
                        me.addCommandDataModel('Humidity out of threshold', app.Utility.readWord(bytes.subarray(7, 9)), isSuccess, command, labelWidth); //2bytes				
                        me.addCommandDataModel('Sound out of threshold', app.Utility.readWord(bytes.subarray(9, 11)), isSuccess, command, labelWidth);
                        me.addCommandDataModel('RSSI value for 1 meter distance', app.Utility.readSingle(bytes.subarray(11, 12)), isSuccess, command, labelWidth);
                    }
                    break;
                default:
                    break;
            }
            console.log("first response total count : " + me.config.totalRecords + " Command : " + command);

            if (command == app.BleCommands.SET_VALIDATE_PASSWORD) {
                app.DebugDeviceService.debugModel.DebugDeviceListDataSource.read([]);
            } else
                me.showResponseWindow();
        },
        showResponseWindow: function () {
            console.log('show response window');
            /*
        var panel = this.getResponsePanel();
        if (!panel) {
            panel = Ext.Viewport.add({ xtype: 'responsePanel' });
        }
        panel.show();
        */
        },
        processListData: function (bytes) {
            debugger;
            if (bytes == null || bytes.bytesLength == 0)
                return;

            var me = this,
                bluetooth = app.bluetoothService.bluetooth;

            me.addListData(bytes);

            console.log("List records " + (bluetooth.config.responseCount - 1) + " of " + me.config.totalRecords);

            if (me.config.totalRecords == (bluetooth.config.responseCount - 1)) {
                console.log("List result completed");
                bluetooth.onUpdateStatus('Processing list data...');
                var data = me.config.listData;
                var storeData = [];
                var store = app.DebugDeviceService.debugModel.DebugDeviceListDataSource;
                for (var i in data) {
                    console.log(data[i].data);
                    var record = me.processDeviceDataToStore(data[i].data);
                    storeData.push(record);
                }
                me.config.deviceData = storeData;
                store.applyData(storeData);
                me.fireEvent('updatestatus', 'Process completed.', true);
            }

        },
        processDeviceDataToStore: function (bytes) {
            debugger;
            var recordType = app.Utility.readSingle(bytes.subarray(0, 1)); //Read single byte		
            var eventId = app.Utility.readWord(bytes.subarray(1, 3)); //Two byte
            var eventTime = app.Utility.readFourByte(bytes.subarray(3, 7)); //Four byte		
            var switchStatus = app.Utility.readSingle(bytes.subarray(7, 8));

            var temperature = 0,
                humidity = 0,
                angle = 0,
                magnetX = 0,
                magnetY = 0,
                magnetZ = 0,
                latitude = 0,
                longitude = 0;
            var ambientLight = 0,
                soundLevel = 0,
                batteryLevel = 0,
                posX = 0,
                posY = 0,
                negX = 0,
                negY = 0,
                posZ = 0,
                negZ = 0,
                distanceLsb = 0,
                distanceMsb = 0;
            var imageSize = 0,
                startTimeMovement = 0,
                endTimeMovement = 0,
                recordTypeText;

            switch (recordType) {
                case app.RecordTypes.HELTHY_EVENT:
                    temperature = app.Utility.readWord(bytes.subarray(8, 10));
                    humidity = app.Utility.readSingle(bytes.subarray(10, 11));
                    ambientLight = app.Utility.readWord(bytes.subarray(11, 13));
                    soundLevel = app.Utility.readWord(bytes.subarray(13, 15));
                    batteryLevel = app.Utility.readSingle(bytes.subarray(15, 16));
                    recordTypeText = 'Healthy';
                    break;
                case app.RecordTypes.LINEAR_MOTION:

                    distanceLsb = app.Utility.readSingle(bytes.subarray(8, 9));
                    distanceMsb = app.Utility.readSingle(bytes.subarray(9, 10));

                    angle = app.Utility.readWord(bytes.subarray(10, 12));
                    magnetX = app.Utility.readWord(bytes.subarray(12, 14));
                    magnetY = app.Utility.readWord(bytes.subarray(14, 16));
                    recordTypeText = 'Linear Motion';
                    break;
                case app.RecordTypes.ANGULAR_MOTION:
                    posX = app.Utility.readSingle(bytes.subarray(8, 9));
                    negX = app.Utility.readSingle(bytes.subarray(9, 10));
                    posY = app.Utility.readSingle(bytes.subarray(10, 11));
                    negY = app.Utility.readSingle(bytes.subarray(11, 12));
                    posZ = app.Utility.readSingle(bytes.subarray(12, 13));
                    negZ = app.Utility.readSingle(bytes.subarray(13, 14));
                    recordTypeText = 'Angular Motion';
                    break;
                case app.RecordTypes.MAGNET_MOTION:
                    magnetX = app.Utility.readWord(bytes.subarray(8, 10));
                    magnetY = app.Utility.readWord(bytes.subarray(10, 12));;
                    magnetZ = app.Utility.readWord(bytes.subarray(12, 14));
                    recordTypeText = 'Magnet Motion';
                    break;
                case app.RecordTypes.DOOR_EVENT:
                    recordTypeText = 'Door Event';
                    break;
                case app.RecordTypes.IMAGE_EVENT:
                    posX = switchStatus;
                    negX = app.Utility.readSingle(bytes.subarray(8, 10));
                    posY = app.Utility.readSingle(bytes.subarray(10, 11));
                    negY = app.Utility.readSingle(bytes.subarray(11, 12));
                    posZ = app.Utility.readSingle(bytes.subarray(12, 13));
                    negZ = app.Utility.readSingle(bytes.subarray(13, 14));
                    imageSize = app.Utility.readThreeByte(bytes.subarray(14, 17));
                    recordTypeText = 'Image Event';
                    break;
                case app.RecordTypes.GPS_EVENT:
                    latitude = app.Utility.readThreeByte(bytes.subarray(8, 11));
                    longitude = app.Utility.readThreeByte(bytes.subarray(11, 14));
                    recordTypeText = 'GPS Event';
                    break;
                case app.RecordTypes.MOTION_TIME:
                    startTimeMovement = app.Utility.readFourByte(bytes.subarray(8, 12));
                    endTimeMovement = app.Utility.readFourByte(bytes.subarray(12, 16));
                    recordTypeText = 'Motion Time';
                    break;
                default:
                    recordTypeText = 'Unknown record type';
                    break;
            }

            var doorState = switchStatus == 0 ? "OPEN" : "CLOSE";
            var temp = temperature != 0 ? temperature / 10 : temperature;
            var model = new app.models.DeviceData({
                DoorStatus: doorState,
                RecordTypeText: recordTypeText,
                TemperatureValue: app.Utility.isInt(temp) ? temp.toFixed(1) : temp,
                HumidityValue: app.Utility.isInt(humidity) ? parseFloat(humidity.toFixed(1)) : humidity,
                AmbientlightValue: app.Utility.isInt(ambientLight) ? parseFloat(ambientLight.toFixed(1)) : ambientLight,
                Angle: app.Utility.isInt(angle) ? angle.toFixed(1) : angle,
                MagnetX: app.Utility.isInt(magnetX) ? magnetX.toFixed(1) : magnetX,
                MagnetY: app.Utility.isInt(magnetY) ? magnetY.toFixed(1) : magnetY,
                MagnetZ: app.Utility.isInt(magnetZ) ? magnetZ.toFixed(1) : magnetZ,
                Latitude: app.Utility.isInt(latitude) ? latitude.toFixed(1) : latitude,
                Longitude: app.Utility.isInt(longitude) ? longitude.toFixed(1) : longitude,
                RecordType: recordType,
                BatteryLevel: batteryLevel,
                SoundLevel: soundLevel,
                SwitchStatus: switchStatus,
                PosX: posX,
                PosY: posY,
                NegX: negX,
                NegY: negX,
                PosZ: posZ,
                NegZ: negZ,
                DistanceLsb: distanceLsb,
                DistanceMsb: distanceMsb,
                EventId: eventId,
                ImageSize: imageSize,
                EventTime: eventTime,
                StartTimeMovement: startTimeMovement,
                EndTimeMovement: endTimeMovement
            });
            var store = app.DebugDeviceService.debugModel.DebugDeviceListDataSource;
            store.add(model);
            return model;
        },
        addListData: function (bytes) {
            var me = this,
                bluetooth = app.bluetoothService.bluetooth;

            var listData = me.config.listData || {};
            listData[bluetooth.config.responseCount - 1] = {
                data: bytes
            };
            me.config.listData = listData;
        },
        addCommandDataModel: function (title, data, status, command, labelWidth) {
            var me = this,
                bluetooth = app.bluetoothService.bluetooth;
            var cmd = me.config.commandData || [];

            var record = new app.models.CommandData({
                Title: title,
                Data: data,
                StatusId: status,
                Command: command,
                LabelWidth: labelWidth
            });

            cmd.push(record);
            me.config.commandData = cmd;
        },
        handlePasswordResponse: function (bytes) {
            var me = this,
                bluetooth = app.bluetoothService.bluetooth;

            if (bluetooth.config.responseCount == 1 && bytes[0] == 1) {
                bluetooth.config.isConnected = true;
                localStorage.setItem("BlePassword", bluetooth.config.password);

                //var panel = this.getDebugDevicePanel();
                var record = bluetooth.config.record;
                record.IsConnected = true;
                console.log('connection success');
                //panel.fireEvent('updateselection', record);

            }
            if (bluetooth.config.responseCount == 1 && bytes[0] != 1) {
                bluetooth.config.isConnected = false;
                bluetooth.onDisconnectDevice();
                localStorage.setItem("BlePassword", '');
                alert('Please enter valid password');
            }
        }
    };
})(window);