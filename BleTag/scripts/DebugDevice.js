(function (global) {
    var app = global.app = global.app || {};
    var DebugDeviceModel = kendo.data.ObservableObject.extend({
        debugDeviceDataSource: null,
        debugDeviceListDataSource: null,
        commandDataSource: null,
        debugSelectedDataSource: null,
        debugMenuDataSource: null,
        config: {
            commandParamData: [],
            formValues: [],
            form: []
        },
        init: function (e) {
            var that = this,
                dataSource,
                jsonUrlToLoad;

            kendo.data.ObservableObject.fn.init.apply(that, []);
            //When you build for Apache Cordova 3.0.0, apply this code instead of using relative URLs. In Apache Cordova 3.0.0, relative URLs might not work properly.           

            var debugSelectedDataSource = new kendo.data.DataSource({
                schema: {
                    model: app.models.BleTag
                },
                data: []
            });

            that.set("debugSelectedDataSource", debugSelectedDataSource);

            var dataSource = new kendo.data.DataSource({
                schema: {
                    model: app.models.BleTag
                },
                data: []
            });

            that.set("debugDeviceDataSource", dataSource);

            var listDataSource = new kendo.data.DataSource({
                schema: {
                    model: app.models.DeviceData
                },
                data: []
            });

            that.set("debugDeviceListDataSource", listDataSource);

            var commandSource = new kendo.data.DataSource({
                schema: {
                    model: app.models.CommandData
                },
                data: []
            });

            that.set("commandDataSource", commandSource);

            var debugMenuDataSource = new kendo.data.DataSource({
                schema: {
                    model: app.models.Menu
                },
                data: [{
                        Title: 'Request all saved sensor event/data',
                        MenuId: app.BleCommands.FETCH_DATA
                },
                    {
                        Title: 'Get Firmware Detail',
                        MenuId: app.BleCommands.FIRMWARE_DETAIL
                }, {
                        Title: 'Get current time',
                        MenuId: app.BleCommands.CURRENT_TIME
                }, {
                        Title: 'Get Serial Number of Device',
                        MenuId: app.BleCommands.SERIALNUMBER
                }, {
                        Title: 'Restart Device',
                        MenuId: app.BleCommands.RESTART_DEVICE
                }, {
                        Title: 'Reset device',
                        MenuId: app.BleCommands.RESET_DEVICE
                }, {
                        Title: 'Turn sensor on',
                        MenuId: app.BleCommands.SENSOR_ON
                }, {
                        Title: 'Turn sensor off',
                        MenuId: app.BleCommands.SENSOR_OFF
                }, {
                        Title: 'Read current sensor data',
                        MenuId: app.BleCommands.CURRENT_SENSOR_DATA
                }, {
                        Title: 'Get event count',
                        MenuId: app.BleCommands.EVENT_COUNT
                }, {
                        Title: 'Get latest n events',
                        MenuId: app.BleCommands.LATEST_N_EVENTS
                }, {
                        Title: 'Event/data from ID x to ID Y',
                        MenuId: app.BleCommands.EVENT_DATA_FROM_IDX_IDY
                }, {
                        Title: 'Erase all event data',
                        MenuId: app.BleCommands.ERASE_EVENT_DATA
                }, {
                        Title: 'Sound Buzzer',
                        MenuId: app.BleCommands.SOUND_BUZZER
                }, {
                        Title: 'Set interval to read sensor periodically',
                        MenuId: app.BleCommands.SET_INTERVAL
                }, {
                        Title: 'Set real time clock',
                        MenuId: app.BleCommands.SET_REAL_TIME_CLOCK
                }, {
                        Title: 'Set GPS location of device',
                        MenuId: app.BleCommands.SET_GPS_LOCATION
                }, {
                        Title: 'Set Major/ Minor versoin of device',
                        MenuId: app.BleCommands.SET_MAJOR_MINOR_VERSION
                }, {
                        Title: 'Set Serial of device',
                        MenuId: app.BleCommands.SET_SERIAL_NUMBER
                }, {
                        Title: 'Set Advertising period',
                        MenuId: app.BleCommands.SET_ADVERTISING_PERIOD
                }, {
                        Title: 'Set sensor threshold',
                        MenuId: app.BleCommands.SET_SENSOR_THRESHOLD
                }, {
                        Title: 'Set standby mode on',
                        MenuId: app.BleCommands.SET_STANDBY_MODE
                }, {
                        Title: 'Set standby mode off',
                        MenuId: app.BleCommands.SET_STANDBY_MODE
                }, {
                        Title: 'Put device in DFU',
                        MenuId: app.BleCommands.SET_DEVICE_IN_DFU
                }, {
                        Title: 'Change Password',
                        MenuId: app.BleCommands.SET_CHANGE_PASSWORD
                }, {
                        Title: 'Set RSSI for iBeacon Frame',
                        MenuId: app.BleCommands.SET_RSSI_FOR_IBEACON_FRAME
                }, {
                        Title: 'Read Configuration Parameter',
                        MenuId: app.BleCommands.READ_CONFIGURATION_PARAMETER
                }]
            });

            that.set("debugMenuDataSource", debugMenuDataSource);

        }
    });
    app.DebugDeviceService = {
        scanListSelection: function (obj) {
            var data = obj.dataItem;
            console.log(data.MacAddress);
            var store = app.DebugDeviceService.debugModel.debugSelectedDataSource;
            store.data([data]);

            app.bluetoothService.bluetooth.onConnectWithPassword(data.MacAddress, "ins!gm@?", data);
            $("#scanningList").kendoMobileModalView("close");
        },
        modelShow: function (e) {
            console.log('On Show');
            app.bluetoothService.bluetooth.initializeBluetooth();
        },
        menuClick: function (item) {
            debugger;
            var command = item.dataItem.MenuId;
            var me = app.DebugDeviceService;
            switch (command) {
                case app.BleCommands.FETCH_DATA:
                    me.onFetchDataButtonClick();
                    break;
                case app.BleCommands.FIRMWARE_DETAIL:
                    me.executeCommand(app.BleCommands.FIRMWARE_DETAIL);
                    break;
                case app.BleCommands.CURRENT_TIME:
                    me.executeCommand(app.BleCommands.CURRENT_TIME);
                    break;
                case app.BleCommands.SERIALNUMBER:
                    me.executeCommand(app.BleCommands.SERIALNUMBER);
                    break;
                case app.BleCommands.RESTART_DEVICE:
                    me.executeCommand(app.BleCommands.RESTART_DEVICE);
                    break;
                case app.BleCommands.RESET_DEVICE:
                    me.executeCommand(app.BleCommands.RESTART_DEVICE);
                    break;
                case app.BleCommands.SENSOR_ON:
                case app.BleCommands.SENSOR_OFF:
                    var data = {
                        command: app.BleCommands.SENSOR_OFF,
                        title: "(0x01 = sensor group, 0x02 = acc group)",
                        fields: [{
                            field: "Sensor Group Id (0x0)",
                            labelWidth: "90px",
                            dataType: "number"
                    }]
                    };
                    app.DebugDeviceService.createWindow(data);
                    break;
                case app.BleCommands.CURRENT_SENSOR_DATA:
                    me.executeCommand(app.BleCommands.CURRENT_SENSOR_DATA);
                    break;
                case app.BleCommands.EVENT_COUNT:
                    me.executeCommand(app.BleCommands.EVENT_COUNT);
                    break;
                case app.BleCommands.LATEST_N_EVENTS:
                    var data = {
                        command: app.BleCommands.LATEST_N_EVENTS,
                        title: "Get latest n event",
                        fields: [{
                            field: "Latest Event",
                            dataType: "number"
                    }]
                    };
                    app.DebugDeviceService.createWindow(data);
                    break;
                case app.BleCommands.EVENT_DATA_FROM_IDX_IDY:
                    var data = {
                        command: app.BleCommands.EVENT_DATA_FROM_IDX_IDY,
                        title: "Get Event / data records from Event ID X to Event ID Y",
                        fields: [{
                                field: "Event Id X",
                                labelWidth: "60px",
                                dataType: "number"
                    },
                            {
                                field: "Event Id Y",
                                labelWidth: "60px",
                                dataType: "number"
                    }]
                    };
                    app.DebugDeviceService.createWindow(data);
                    break;
                case app.BleCommands.ERASE_EVENT_DATA:
                    me.executeCommand(app.BleCommands.ERASE_EVENT_DATA);
                    break;
                case app.BleCommands.SOUND_BUZZER:
                    me.executeCommand(app.BleCommands.SOUND_BUZZER);
                    break;
                case app.BleCommands.SET_INTERVAL:
                    var data = {
                        command: app.BleCommands.SET_INTERVAL,
                        title: "Set interval to read sensor periodically",
                        fields: [{
                            field: "Periodic Interval (In Minutes)",
                            labelWidth: "130px",
                            dataType: "number"
                    }]
                    };
                    app.DebugDeviceService.createWindow(data);
                    break;
                case app.BleCommands.SET_REAL_TIME_CLOCK:

                    var data = {
                        command: app.BleCommands.SET_REAL_TIME_CLOCK,
                        title: "Since 1st Oct 2014(MM/dd/yyy HH:mm:ss)",
                        fields: [{
                            field: "Date",
                            labelWidth: "40px",
                            dataType: "text",
                            defaultValue: app.Utility.getTodayDate()
                    }]
                    };
                    app.DebugDeviceService.createWindow(data);

                    break;
                case app.BleCommands.SET_GPS_LOCATION:

                    var data = {
                        command: app.BleCommands.SET_GPS_LOCATION,
                        title: "Set GPS location of device",
                        fields: [{
                                field: "Latitude",
                                labelWidth: "60px",
                                dataType: "number"
                        },
                            {
                                field: "Longitude",
                                labelWidth: "60px",
                                dataType: "number"
                        }]
                    };
                    app.DebugDeviceService.createWindow(data);

                    break;
                case app.BleCommands.SET_MAJOR_MINOR_VERSION:
                    var data = {
                        command: app.BleCommands.SET_MAJOR_MINOR_VERSION,
                        title: "Set Major/ Minor version of device",
                        fields: [{
                                field: "Major Version",
                                labelWidth: "80px",
                                dataType: "number"
                        },
                            {
                                field: "Minor Version",
                                labelWidth: "80px",
                                dataType: "number"
                        }]
                    };
                    app.DebugDeviceService.createWindow(data);
                    break;
                case app.BleCommands.SET_SERIAL_NUMBER:
                    var data = {
                        command: app.BleCommands.SET_SERIAL_NUMBER,
                        title: "Set Serial# of device(14 byte device serial number)",
                        fields: [{
                            field: "Serial",
                            labelWidth: "40px",
                            dataType: "text",
                            defaultValue: ""
                        }],
                    };
                    app.DebugDeviceService.createWindow(data);
                    break;
                case app.BleCommands.SET_ADVERTISING_PERIOD:

                    var data = {
                        command: app.BleCommands.SET_ADVERTISING_PERIOD,
                        title: "Set Advertising period",
                        fields: [{
                            field: "Milli Seconds",
                            labelWidth: "50px",
                            dataType: "number"
                        }],
                    };
                    app.DebugDeviceService.createWindow(data);
                    break;
                case app.BleCommands.SET_SENSOR_THRESHOLD:
                    var data = {
                        command: app.BleCommands.SET_SENSOR_THRESHOLD,
                        title: "Set sensor thershold",
                        fields: [{
                                field: "Temperature out of threshold",
                                labelWidth: "130px",
                                dataType: "number"
                        },
                            {
                                field: "Light out of threshold",
                                labelWidth: "130px",
                                dataType: "number"
                        },
                            {
                                field: "Humidity out of threshold",
                                labelWidth: "130px",
                                dataType: "number"
                        },
                            {
                                field: "Sound out of threshold",
                                labelWidth: "130px",
                                dataType: "number"
                        }],
                    };
                    app.DebugDeviceService.createWindow(data);
                    break;
                case app.BleCommands.SET_STANDBY_MODE:
                    me.executeCommand(app.BleCommands.SET_STANDBY_MODE, [record.raw.flag]);
                    break;
                case app.BleCommands.SET_DEVICE_IN_DFU:
                    me.executeCommand(app.BleCommands.SET_DEVICE_IN_DFU);
                    break;
                case app.BleCommands.SET_CHANGE_PASSWORD:
                    var data = {
                        command: app.BleCommands.SET_CHANGE_PASSWORD,
                        title: "Set password(Max 19 bytes)",
                        fields: [{
                            field: "Password",
                            labelWidth: "50px",
                            dataType: "text",
                            defaultValue: ""
                        }]
                    };
                    app.DebugDeviceService.createWindow(data);
                    break;
                case app.BleCommands.SET_RSSI_FOR_IBEACON_FRAME:
                    var data = {
                        command: app.BleCommands.SET_RSSI_FOR_IBEACON_FRAME,
                        title: "RSSI value for 1 meter distance(0-255)",
                        fields: [{
                            field: "value",
                            labelWidth: "40px",
                            dataType: "number"
                        }]
                    };
                    app.DebugDeviceService.createWindow(data);
                    break;
                case app.BleCommands.READ_CONFIGURATION_PARAMETER:
                    me.executeCommand(app.BleCommands.READ_CONFIGURATION_PARAMETER);
                    break;
                default:
                    break;
            }
        },
        show: function (e) {
            var record = new app.models.BleTag({
                MacAddress: '',
                Advertisement: '',
                DeviceName: '',
                ManufacturerUUID: '',
                Major: 0,
                Minor: 0,
                Rssi: 0,
                IsConnected: false
            });

            var store = app.DebugDeviceService.debugModel.debugSelectedDataSource;
            store.add(record);

            /*
                        store = app.DebugDeviceService.debugModel.debugDeviceListDataSource;

                        var model = new app.models.DeviceData({
                            EventId: 1,
                            DoorStatus: 'doorState'
                        });
                        store.add(model);
                        model = new app.models.DeviceData({
                            EventId: 2,
                            DoorStatus: 'doorState 1'
                        });
                        store.add(model);
                        model = new app.models.DeviceData({
                            EventId: 3,
                            DoorStatus: 'doorState 2'
                        });

                        store.add(model);
                        model = new app.models.DeviceData({
                            EventId: 4,
                            DoorStatus: 'doorState 3'
                        });
                        store.add(model);
                        model = new app.models.DeviceData({
                            EventId: 5,
                            DoorStatus: 'doorState 4'
                        });
                        store.add(model);
                        model = new app.models.DeviceData({
                            EventId: 6,
                            DoorStatus: 'doorState 5'
                        });
                        store.add(model);
                        model = new app.models.DeviceData({
                            EventId: 7,
                            DoorStatus: 'doorState 6'
                        });
                        store.add(model);
            */
        },
        onDisconnectButtonClick: function (e) {
            app.BluetoothDeviceActor.showResponseWindow();
        },
        closeScanWindow: function (e) {
            $("#scanningList").kendoMobileModalView("close");
        },
        scanButtonClick: function (e) {
            app.bluetoothService.bluetooth.initializeBluetooth();
        },
        debugModel: new DebugDeviceModel(),
        createWindow: function (obj) {
            app.DebugDeviceService.debugModel.config.formValues = obj;
            var table = document.createElement("table");
            table.width = "100%";
            table.style = "table-layout:fixed";
            var tr, td;

            var childWindow = $("#commandDialog")[0];
            var attrLen = childWindow.attributes.length;
            childWindow.innerHTML = "";
            var remIndex = 0;
            for (var i = 0; i < attrLen; i++) {
                var attr = childWindow.attributes[remIndex];
                var name = attr.name;
                if (name == "id")
                    remIndex += 1;
                else
                    childWindow.removeAttribute(name);

            }


            for (var i = 0; i < obj.fields.length; i++) {
                tr = document.createElement("tr");
                table.appendChild(tr);

                labelTd = document.createElement("td");
                fieldtd = document.createElement("td");

                var label = document.createElement("label");
                labelTd.appendChild(label);
                label.textContent = obj.fields[i].field;
                label.width = obj.fields[i].width;
                label.style = "font-size: 12px;";

                var field = document.createElement("input");               
                fieldtd.appendChild(field);

                field.className = "TextBoxCmd";
                field.type = obj.fields[i].dataType;
                field.defaultValue = obj.fields[i].defaultValue;
                field.id = "textValue" + [i];

                tr.appendChild(labelTd);
                tr.appendChild(fieldtd);

            }

            var footerRow = document.createElement("tr");
            table.appendChild(footerRow);

            var footerCol0Td = document.createElement("td");
            footerCol0Td.colSpan = "2";
            footerRow.appendChild(footerCol0Td);

            var footerDiv = document.createElement("div");
            footerDiv.className = "footer-container";
            footerCol0Td.appendChild(footerDiv);

            var button = document.createElement("button");
            button.className = "debugBtn";
            button.textContent = "Cancel";
            button.id = "cancelCmdBtn";
            footerDiv.appendChild(button);

            var buttonOk = document.createElement("button");
            buttonOk.className = "debugBtn";
            buttonOk.textContent = "Ok";
            buttonOk.id = "okCmdBtn";
            buttonOk.type = "button"
            footerDiv.appendChild(buttonOk);

            table.appendChild(footerRow);

            var commandWindow = $("#commandDialog");
            commandWindow.append(table);
            app.DebugDeviceService.debugModel.config.form = table;

            var accessWindow = $("#commandDialog").kendoWindow({
                actions: {},
                draggable: false,
                modal: true,
                resizable: false,
                visible: false,
                title: obj.title,
                width: "90%"
            }).data("kendoWindow");

            $('#commandDialog').parent().addClass("CommandWinTitlebar");

            accessWindow.center();
            accessWindow.open();

            $("#okCmdBtn").on("click", app.DebugDeviceService.onCommandWindowOkButtonClick);
            $("#cancelCmdBtn").on("click", function (button) {
                $("#commandDialog").data("kendoWindow").close();
            });

        },
        executeCommand: function (command, param) {
            app.BluetoothDeviceActor.config.commandData = [];
            app.bluetoothService.bluetooth.writeBleCommand(command, param);
        },
        onFetchDataButtonClick: function (button) {
            var bluetooth = app.bluetoothService.bluetooth;
            /* if (!bluetooth || !bluetooth.config.isConnected) {
                 alert('Please connect device');
                 return;
             } */
            app.DebugDeviceService.debugModel.debugDeviceListDataSource.read([]);

            app.DebugDeviceService.executeCommand(app.BleCommands.FETCH_DATA);
        },
        addCommandParamData: function (value, isDirect) {
            var param = this.debugModel.config.commandParamData || [];
            if (isDirect) {
                for (var i = 0; i < value.length; i++) {
                    param.push(value[i]);
                }
            } else {
                for (var i = value.length; i--;) {
                    param.push(value[i]);
                }
            }
            this.debugModel.config.commandParamData = param;
        },
        setIntervalToRead: function () {
            var data = {
                command: app.BleCommands.SET_INTERVAL,
                title: "Set interval to read sensor periodically",
                fields: [{
                    field: "Periodic Interval (In Minutes)",
                    dataType: "number"
                    }],
            };
            app.DebugDeviceService.createWindow(data);
        },
        setRealTime: function () {
            var data = {
                command: app.BleCommands.SET_REAL_TIME_CLOCK,
                title: "Since 1st Oct 2014(MM/dd/yyy HH:mm:ss)",
                fields: [{
                    field: "Date",
                    dataType: "text",
                    defaultValue: app.Utility.getTodayDate()
                    }],
            };
            app.DebugDeviceService.createWindow(data);
        },
        setGPSLocation: function () {
            var data = {
                command: app.BleCommands.SET_GPS_LOCATION,
                title: "Set GPS location of device",
                fields: [{
                        field: "Latitude",
                        dataType: "number"
                        },
                    {
                        field: "Longitude",
                        dataType: "number"
                        }],
            };
            app.DebugDeviceService.createWindow(data);
        },
        setMajorMinor: function () {
            var data = {
                command: app.BleCommands.SET_MAJOR_MINOR_VERSION,
                title: "Set Major/ Minor version of device",
                fields: [{
                        field: "Major Version",
                        dataType: "number"
                        },
                    {
                        field: "Minor Version",
                        dataType: "number"
                        }],
            };
            app.DebugDeviceService.createWindow(data);
        },
        setSerialOfDevice: function () {
            var data = {
                command: app.BleCommands.SET_SERIAL_NUMBER,
                title: "Set Serial# of device(14 byte device serial number)",
                fields: [{
                    field: "Serial",
                    dataType: "text",
                    defaultValue: ""
                        }],
            };
            app.DebugDeviceService.createWindow(data);
        },
        setAdvertising: function () {
            var data = {
                command: app.BleCommands.SET_ADVERTISING_PERIOD,
                title: "Set Advertising period",
                fields: [{
                    field: "Milli Seconds",
                    dataType: "number"
                        }],
            };
            app.DebugDeviceService.createWindow(data);
        },
        setSenorThreshold: function () {
            var data = {
                command: app.BleCommands.SET_SENSOR_THRESHOLD,
                title: "Set sensor thershold",
                fields: [{
                        field: "Temperature out of threshold",
                        dataType: "number"
                        },
                    {
                        field: "Light out of threshold",
                        dataType: "number"
                        },
                    {
                        field: "Humidity out of threshold",
                        dataType: "number"
                        }],
            };
            app.DebugDeviceService.createWindow(data);
        },
        changePassword: function () {
            var data = {
                command: app.BleCommands.SET_CHANGE_PASSWORD,
                title: "Set password(Max 19 bytes)",
                fields: [{
                    field: "Password",
                    dataType: "text",
                    defaultValue: ""
                        }],
            };
            app.DebugDeviceService.createWindow(data);
        },
        setRSSI: function () {
            var data = {
                command: app.BleCommands.SET_RSSI_FOR_IBEACON_FRAME,
                title: "RSSI value for 1 meter distance(0-255)",
                fields: [{
                    field: "value",
                    dataType: "number"
                        }]
            };
            app.DebugDeviceService.createWindow(data);
        },
        onCommandWindowOkButtonClick: function (button) {
            debugger;
            var command = formValues.command,
                formValues = app.DebugDeviceService.debugModel.config.formValues,
                form = app.DebugDeviceService.debugModel.config.form;
            this.debugModel.config.commandParamData = [];
            var values = formValues;

            switch (command) {
                case app.BleCommands.SENSOR_ON:
                case app.BleCommands.SENSOR_OFF:
                    this.addCommandParamData(app.Utility.decimalToBytes($("#textValue0").val(), 1));
                    break;
                case app.BleCommands.LATEST_N_EVENTS:
                    var store = Ext.getStore('DeviceData');
                    store.removeAll();
                    this.addCommandParamData(app.Utility.decimalToBytes($("#textValue0").val(), 2));
                    break;
                case app.BleCommands.EVENT_DATA_FROM_IDX_IDY:
                    this.addCommandParamData(app.Utility.decimalToBytes($("#textValue0").val(), 2));
                    this.addCommandParamData(app.Utility.decimalToBytes($("#textValue1").val(), 2));
                    break;
                case app.BleCommands.SET_INTERVAL:
                    var interval = $("#textValue0").val();
                    if (interval < 1 || interval > 60) {
                        alert("Minutes between 1 to 60");
                        return;
                    }
                    this.addCommandParamData(app.Utility.decimalToBytes(interval, 1));
                    break;
                case app.BleCommands.SET_REAL_TIME_CLOCK:
                    var date = new Date($("#textValue0").val());

                    if (!Ext.isDate(date)) {
                        alert("Invalid Date");
                        return;
                    }
                    this.addCommandParamData(app.Utility.decimalToBytes(date.getTime() / 1000, 4));
                    break;
                case app.BleCommands.SET_GPS_LOCATION:
                    this.addCommandParamData(app.Utility.decimalToBytes($("#textValue0").val(), 4));
                    this.addCommandParamData(app.Utility.decimalToBytes($("#textValue1").val(), 4));
                    break;
                case app.BleCommands.SET_MAJOR_MINOR_VERSION:
                    this.addCommandParamData(app.Utility.decimalToBytes($("#textValue0").val(), 2));
                    this.addCommandParamData(app.Utility.decimalToBytes($("#textValue1").val(), 2));
                    break;
                case app.BleCommands.SET_SERIAL_NUMBER:
                    //14 bytes max
                    var buffer = app.Utility.stringToBytes($("#textValue0").val());
                    this.addCommandParamData(new Uint8Array(buffer), true);
                    break;
                case app.BleCommands.SET_ADVERTISING_PERIOD:
                    this.addCommandParamData(app.Utility.decimalToBytes($("#textValue0").val(), 2));
                    break;
                case app.BleCommands.SET_SENSOR_THRESHOLD:
                    this.addCommandParamData(app.Utility.decimalToBytes($("#textValue0").val(), 2));
                    this.addCommandParamData(app.Utility.decimalToBytes($("#textValue1").val(), 2));
                    this.addCommandParamData(app.Utility.decimalToBytes($("#textValue2").val(), 2));
                    break;
                case app.BleCommands.SET_CHANGE_PASSWORD:
                    console.log('Password  - ' + $("#textValue0").val());
                    var bytes = app.Utility.getPasswordBytes($("#textValue0").val());
                    this.addCommandParamData(bytes, true);
                    break;
                case app.BleCommands.SET_RSSI_FOR_IBEACON_FRAME:
                    this.addCommandParamData(app.Utility.decimalToBytes($("#textValue0").val(), 1));
                    break;
                default:
                    break;
            }
            this.executeCommand(command, this.debugModel.config.commandParamData);
        }

    };

})(window);