/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var shapeArray = [];

var x = 0;
var y = 0;
var z = 0;

var vfx = 0;
var vfy = 0;
var vfz = 0;

var minX = 9999;
var minY = 9999;
var minZ = 9999;

var freq = 50;

var idx = 0;

var PathData;

function resetData() {
    shapeArray = [];
    idx = 0;
    minX = 9999;
    minY = 9999;
}

function getDistance(v0, a, t) {
    return v0*t + 0.5*a*t;
}

function onSuccess(acceleration) {
    acceleration.x = acceleration.x.toFixed(2);
    acceleration.y = acceleration.y.toFixed(2) - 9.8;
    acceleration.z = acceleration.z.toFixed(2);

    dx = getDistance(vfx, acceleration.x, freq/1000);
    dy = getDistance(vfy, acceleration.y, freq/1000);
    dz = getDistance(vfz, acceleration.z, freq/1000);

    vfx = acceleration.x * freq/1000;
    vfy = acceleration.y * freq/1000;
    vfz = acceleration.z * freq/1000;
    //alert('dx' + dx);

    shapeArray[idx] = [];
    var tmpX = (x+dx)*500;
    var tmpY = (y+dy)*500;
    var tmpZ = (z+dz)*500;
    shapeArray[idx].push(tmpX, tmpY, tmpZ);
    idx += 1;
    if(tmpX < minX) { minX = tmpX; }
    if(tmpY < minY) { minY = tmpY; }
    if(tmpZ < minZ) { minZ = tmpZ; }
};

function onError() {
    alert('onError!');
};

function submit() {
    alert('shapeArray.length: ' + shapeArray.length);
    for(var i = 0; i < shapeArray.length; i++) {
        var data = new PathData();
        xPos = (minX < 0) ? shapeArray[i][0]*1000 - minX : shapeArray[i][0]*1000;
        yPos = (minY < 0) ? shapeArray[i][1]*1000 - minY : shapeArray[i][1]*1000;
        data.set("X", xPos);
        data.set("Y", yPos);
        data.set("PointNo", i);
        data.save(null, {
            success: function(user) {
                //alert("資料上傳成功");
            },
            error: function(user, error) {
            // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
    resetData();
}

function getData() {
    query = new Parse.Query(PathData);
    query.equalTo("X", 123.11);
    query.find({
    success: function (results) {
        console.log("Successfully retrieved " + results.length + " scores.");
        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) {
        var object = results[i];
        console.log(object.id + ' - ' + object.get('X'));
        }
    },
    error: function (error) {
        alert("Error: " + error.code + " " + error.message);
    }
    });
}

function drawPath() {
    //console.log('drawPath');
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(0, 0);
    //alert('shapeArray.length: ' + shapeArray.length);
    //alert('minX: ' + minX);
    var xPos;
    var yPos;
    for(var i = 0; i < shapeArray.length; i++) {
        xPos = (minX < 0) ? shapeArray[i][0] - minX : shapeArray[i][0];
        yPos = (minY < 0) ? shapeArray[i][1] - minY : shapeArray[i][1];
        //alert('x: ' + shapeArray[i][0] + ', y: ' + shapeArray[i][1]);
        context.lineTo(xPos, yPos); 
    }
    context.stroke();
    resetData();
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        resetData();
        Parse.initialize("BktVGHGrlbewaB8zQYr2Ggb9czE6XVkodvyZTP9l", "mxf2wEBpjCXSAksg09BBiFcCfi6mPXHrzBxu4LX1");
        PathData = Parse.Object.extend("PathData");
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        shapeArray.push([x, y, z]);
    	var options = { frequency: freq };
    	var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    	app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
};

app.initialize();