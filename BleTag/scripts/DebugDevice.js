(function (global) {
    var app = global.app = global.app || {};
    var DebugDeviceModel = kendo.data.ObservableObject.extend({
        debugDeviceDataSource: null,
        debugDeviceListDataSource: null,
        commandDataSource: null,
        debugSelectedDataSource: null,
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
        }
    });
    app.DebugDeviceService = {
        scanListSelection: function (obj) {
            var data = obj.dataItem;
            console.log(data.MacAddress);
            app.bluetoothService.bluetooth.onConnectWithPassword(data.MacAddress, "ins!gm@?", data);
            $("#scanningList").kendoMobileModalView("close");
        },
        modelShow: function (e) {
            console.log('On Show');
            app.bluetoothService.bluetooth.initializeBluetooth();
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
            
            var store = app.DebugDeviceService.debugModel.debugDeviceListDataSource;
             debugger;
            var model = new app.models.DeviceData({
                DoorStatus: 'doorState'          
            });
            store.add(model);
            model = new app.models.DeviceData({
                DoorStatus: 'doorState 1'          
            });
            store.add(model);
            model = new app.models.DeviceData({
                DoorStatus: 'doorState 2'          
            });
            
            store.add(model);  
            model = new app.models.DeviceData({
                DoorStatus: 'doorState 3'          
            });            
            store.add(model); 
            model = new app.models.DeviceData({
                DoorStatus: 'doorState 4'          
            });            
            store.add(model); 
            model = new app.models.DeviceData({
                DoorStatus: 'doorState 5'          
            });            
            store.add(model); 
            model = new app.models.DeviceData({
                DoorStatus: 'doorState 6'          
            });           
            store.add(model); 
            
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
            var tr;
            var td;
            for (var i = 0; i < obj.fields.length; i++) {
                tr = document.createElement("tr");
                fieldLabel = document.createElement("td");
                fieldText = document.createElement("td");
                var label = document.createElement("label");
                label.textContent = obj.fields[i].field;
                var box = document.createElement("input");
                box.className = "TextBoxCmd";
                box.type = obj.fields[i].dataType;
                box.defaultValue = obj.fields[i].defaultValue;
                box.id = "textValue" + [i];
                fieldLabel.appendChild(label);
                fieldText.appendChild(box);
                tr.appendChild(fieldLabel);
                tr.appendChild(fieldText);
                table.appendChild(tr);
            }
            var toolRow = document.createElement("tr");
            toolRow.className = "window-footer";
            var toolCancel = document.createElement("td")
            var button = document.createElement("button");
            button.className = "debugBtn";
            button.textContent = "Cancel";
            button.id = "CancelCmdBtn";
            var toolOk = document.createElement("td")
            var buttonOk = document.createElement("button");
            buttonOk.className = "debugBtn";
            buttonOk.textContent = "Ok";
            buttonOk.id = "OkCmdBtn";
            buttonOk.type = "button"
            buttonOk.setAttribute('onclick', 'app.DebugDeviceService.onCommandWindowOkButtonClick(app.DebugDeviceService.debugModel.config.formValues,app.DebugDeviceService.debugModel.config.form)');
            toolCancel.appendChild(button);
            toolRow.appendChild(toolCancel);
            toolOk.appendChild(buttonOk);
            toolRow.appendChild(toolOk);
            table.appendChild(toolRow);
            var commandWindow = $("#commandDialog");
            commandWindow.append(table.innerHTML);
            app.DebugDeviceService.debugModel.config.form = table.innerHTML;

            var accessWindow = $("#commandDialog").kendoWindow({
                actions: {},
                draggable: false,
                modal: true,
                resizable: false,
                minWidth: 250,
                visible: false,
                //width:"100%",
            }).data("kendoWindow");
            $("#commandDialog").data("kendoWindow").title(obj.title);
            $('#commandDialog').parent().addClass("CommandWinTitlebar");

            accessWindow.center();
            accessWindow.open();
        },
        executeCommand: function (command, param) {
            app.DebugDeviceService.debugModel.commandDataSource.read([]);
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
        onCommandWindowOkButtonClick: function (formValues, form) {
            var command = formValues.command;
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
        },

    };

})(window);