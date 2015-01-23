(function (global) {
    var app = global.app = global.app || {};
    var DebugDeviceModel = kendo.data.ObservableObject.extend({
        DebugDeviceDataSource: null,
        DebugDeviceListDataSource: null,
        CommandDataSource: null,
        config: {
            commandParamData: [],
        },
        init: function (e) {
            var that = this,
                dataSource,
                jsonUrlToLoad;

            kendo.data.ObservableObject.fn.init.apply(that, []);
            //When you build for Apache Cordova 3.0.0, apply this code instead of using relative URLs. In Apache Cordova 3.0.0, relative URLs might not work properly.           

            var dataSource = new kendo.data.DataSource({
                schema: {
                    model: app.models.BleTag
                },
                data: []
            });

            that.set("DebugDeviceDataSource", dataSource);

            var listDataSource = new kendo.data.DataSource({
                schema: {
                    model: app.models.DeviceData
                },
                data: []
            });

            that.set("DebugDeviceListDataSource", listDataSource);

            var commandSource = new kendo.data.DataSource({
                schema: {
                    model: app.models.CommandData
                },
                data: []
            });

            that.set("CommandDataSource", commandSource);
        }
    });
    app.DebugDeviceService = {
        scanListSelection: function (obj) {
            var data = obj.dataItem;
            console.log(data.MacAddress);
            app.bluetoothService.bluetooth.onConnectWithPassword(data.MacAddress, "ins!gm@?", data);
            $("#scanningList").kendoMobileModalView("close");
        },
        show: function (e) {
            console.log('On Show');
            app.bluetoothService.bluetooth.initializeBluetooth();
        },
        closeScanWindow: function (e) {
            $("#scanningList").kendoMobileModalView("close");
        },
        scanButtonClick: function (e) {
            app.bluetoothService.bluetooth.initializeBluetooth();
        },
        debugModel: new DebugDeviceModel(),
        debugInit: function () {
            $("#debuglistview").kendoMobileListView({
                template: kendo.template($("#deviceStatusTemplate").html()),
                dataSource: kendo.data.DataSource.create([{
                    foo: "bar"
                }])
            });
            $("#popup-content").kendoMobileListView({
                template: kendo.template($("#deviceStatusTemplate").html()),
                dataSource: kendo.data.DataSource.create([{
                    foo: "bar"
                }])
            });
            $("#scanlist").kendoMobileListView({
                template: kendo.template($("#deviceStatusTemplate").html()),
                dataSource: kendo.data.DataSource.create([{
                    foo: "bar"
                }])
            });
            $(document).on('click', '#CancelCmdBtn', function () {
                $("#commandDialog").data("kendoWindow").close();
                $("#commandDialog").html("");
                $("#commandDialog").data("kendoWindow").title("");
            });
            $("#setIntervalToRead").click(function () {
                var data = {
                    title: "Set interval to read sensor periodically",
                    fields: [{
                        field: "Periodic Interval (In Minutes)",
                        dataType: "number"
                    }],
                };
                app.DebugDeviceService.createWindow(data);
            });
            $("#setRealTime").click(function () {
                var data = {
                    title: "Since 1st Oct 2014(MM/dd/yyy HH:mm:ss)",
                    fields: [{
                        field: "Date",
                        dataType: "text",
                        defaultValue: app.Utility.getTodayDate()
                    }],
                };
                app.DebugDeviceService.createWindow(data);
            });
            $("#setGPSLocation").click(function () {
                var data = {
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
            });
            $("#setMajorMinor").click(function () {
                var data = {
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
            });
            $("#setSerialOfDevice").click(function () {
                var data = {
                    title: "Set Serial# of device(14 byte device serial number)",
                    fields: [{
                        field: "Serial",
                        dataType: "text",
                        defaultValue: ""
                        }],
                };
                app.DebugDeviceService.createWindow(data);
            });
            $("#setAdvertising").click(function () {
                var data = {
                    title: "Set Advertising period",
                    fields: [{
                        field: "Milli Seconds",
                        dataType: "number"
                        }],
                };
                app.DebugDeviceService.createWindow(data);
            });
            $("#changePassword").click(function () {
                var data = {
                    title: "Set password(Max 19 bytes)",
                    fields: [{
                        field: "Password",
                        dataType: "text",
                        defaultValue: ""
                        }],
                };
                app.DebugDeviceService.createWindow(data);
            });
            $("#setRSSI").click(function () {
                var data = {
                    title: "RSSI value for 1 meter distance(0-255)",
                    fields: [{
                        field: "value",
                        dataType: "number"
                        }],
                };
                app.DebugDeviceService.createWindow(data);
            });
            $("#setSenorThreshold").click(function () {
                var data = {
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
            });
        },
        createWindow: function (obj) {
            debugger;
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
            buttonOk.setAttribute('onclick', 'app.DebugDeviceService.onCommandWindowOkButtonClick()');
            toolCancel.appendChild(button);
            toolRow.appendChild(toolCancel);
            toolOk.appendChild(buttonOk);
            toolRow.appendChild(toolOk);
            table.appendChild(toolRow);
            var commandWindow = $("#commandDialog");
            commandWindow.append(table.innerHTML);

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
            app.DebugDeviceService.debugModel.CommandDataSource.read([]);
            app.bluetoothService.bluetooth.writeBleCommand(command, param);
        },
        onFetchDataButtonClick: function (button) {
            debugger;
            var bluetooth = app.bluetoothService.bluetooth;
            /* if (!bluetooth || !bluetooth.config.isConnected) {
                 alert('Please connect device');
                 return;
             } */
            app.DebugDeviceService.debugModel.DebugDeviceListDataSource.read([]);

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
        onCommandWindowOkButtonClick: function (button) {
            debugger;
            var commandPanel = this.getCommandInputPanel();
            var form = this.getCommandInputForm();
            var command = commandPanel.getCommand();
            this.debugModel.config.commandParamData = [];
            var values = form.getValues();
            switch (command) {
                case app.BleCommands.SENSOR_ON:
                case app.BleCommands.SENSOR_OFF:
                    this.addCommandParamData(app.Utility.decimalToBytes(values.SensorGroupId, 1));
                    break;
                case app.BleCommands.LATEST_N_EVENTS:
                    var store = Ext.getStore('DeviceData');
                    store.removeAll();
                    this.addCommandParamData(app.Utility.decimalToBytes(values.LatestEvent, 2));
                    break;
                case app.BleCommands.EVENT_DATA_FROM_IDX_IDY:
                    this.addCommandParamData(app.Utility.decimalToBytes(values.EventIdX, 2));
                    this.addCommandParamData(app.Utility.decimalToBytes(values.EventIdY, 2));
                    break;
                case app.BleCommands.SET_INTERVAL:
                    if (values.Interval < 1 || values.Interval > 60) {
                        alert("Minutes between 1 to 60");
                        return;
                    }
                    this.addCommandParamData(app.Utility.decimalToBytes(values.Interval, 1));
                    break;
                case app.BleCommands.SET_REAL_TIME_CLOCK:
                    var date = new Date(values.Date);

                    if (!Ext.isDate(date)) {
                        alert("Invalid Date");
                        return;
                    }
                    this.addCommandParamData(app.Utility.decimalToBytes(date.getTime() / 1000, 4));
                    break;
                case app.BleCommands.SET_GPS_LOCATION:
                    this.addCommandParamData(app.Utility.decimalToBytes(values.Latitude, 4));
                    this.addCommandParamData(app.Utility.decimalToBytes(values.Longitude, 4));
                    break;
                case app.BleCommands.SET_MAJOR_MINOR_VERSION:
                    this.addCommandParamData(app.Utility.decimalToBytes(values.Major, 2));
                    this.addCommandParamData(app.Utility.decimalToBytes(values.Minor, 2));
                    break;
                case app.BleCommands.SET_SERIAL_NUMBER:
                    //14 bytes max
                    var buffer = app.Utility.stringToBytes(values.SerialNumber);
                    this.addCommandParamData(new Uint8Array(buffer), true);
                    break;
                case app.BleCommands.SET_ADVERTISING_PERIOD:
                    this.addCommandParamData(app.Utility.decimalToBytes(values.Milliseconds, 2));
                    break;
                case app.BleCommands.SET_SENSOR_THRESHOLD:
                    this.addCommandParamData(app.Utility.decimalToBytes(values.Temperature, 2));
                    this.addCommandParamData(app.Utility.decimalToBytes(values.Light, 2));
                    this.addCommandParamData(app.Utility.decimalToBytes(values.Humidity, 2));
                    this.addCommandParamData(app.Utility.decimalToBytes(values.Sound, 2));
                    break;
                case app.BleCommands.SET_CHANGE_PASSWORD:
                    console.log('Password  - ' + values.Password);
                    var bytes = app.Utility.getPasswordBytes(values.Password);
                    this.addCommandParamData(bytes, true);
                    break;
                case app.BleCommands.SET_RSSI_FOR_IBEACON_FRAME:
                    this.addCommandParamData(app.Utility.decimalToBytes(values.RssiValue, 1));
                    break;
                default:
                    break;
            }
            commandPanel.hide();
            this.executeCommand(command, this.getCommandParamData());
        },

    };

})(window);