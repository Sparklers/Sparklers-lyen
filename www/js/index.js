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

var shapeArray = {};

var x = 0;
var y = 0;
var z = 0;

var vfx = 0;
var vfy = 0;
var vfz = 0;

var freq = 100;

var idx = 0;

function getDistance(v0, a, t) {
    return v0*t + 0.5*a*t;
}

function onSuccess(acceleration) {
    // alert('onSuccess');
    acceleration.x = acceleration.x;
    acceleration.y = acceleration.y - 9.8;
    acceleration.z = acceleration.z;

    dx = getDistance(vfx, acceleration.x, freq/1000);
    dy = getDistance(vfy, acceleration.y, freq/1000);
    dz = getDistance(vfz, acceleration.z, freq/1000);

    vfx = acceleration.x * freq/1000;
    vfy = acceleration.y * freq/1000;
    vfz = acceleration.z * freq/1000;

    document.getElementById('accelerationX').innerHTML = acceleration.x.toFixed(2);
    document.getElementById('accelerationY').innerHTML = acceleration.y.toFixed(2);
    document.getElementById('accelerationZ').innerHTML = acceleration.z.toFixed(2);
    document.getElementById('distanceX').innerHTML = dx.toFixed(2)*100;
    document.getElementById('distanceY').innerHTML = dy.toFixed(2)*100;
    document.getElementById('distanceZ').innerHTML = dz.toFixed(2)*100;
    document.getElementById('velocityX').innerHTML = vfx.toFixed(2);
    document.getElementById('velocityY').innerHTML = vfy.toFixed(2);
    document.getElementById('velocityZ').innerHTML = vfz.toFixed(2);
    shapeArray[idx] = [];
    shapeArray[idx].push(x+dx, y+dy, z+dz);
    idx += 1;
};

function onError() {
    alert('onError!');
};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
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
        //alert('onDeviceReady');
        app.receivedEvent('deviceready');
        var options = { frequency: freq };
        shapeArray.push([x, y, z]);
        var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
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