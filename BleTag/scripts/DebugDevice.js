(function (global) {
    var app = global.app = global.app || {};
    var DebugDeviceModel = kendo.data.ObservableObject.extend({
        DebugDeviceDataSource: null,
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
            $(document).on('click', '.km-shim', function (event) {
                if (event.target.className == "km-shim km-modalview-root k-state-border-down") {
                    $("#modalview-sample").kendoMobileModalView("close");
                }
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
        }

    };

})(window);