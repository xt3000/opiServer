var ws = new WebSocket(location.origin.replace(/^http/, 'ws') + '/ws?type=interface');

ws.onopen = function() { onOpen() };
ws.onclose = function(evt) { onClose(evt) };
ws.onmessage = function(evt) { onMessage(evt) };
ws.onerror = function(error) { onError(error) };


//функции..
function onOpen() {
  console.log('WS: Open');
  //TODO

}

function onClose(evt) {
  if (evt.wasClean) {
    console.log('WS: Close');
    //TODO 'ws: close'
  } else {
    console.log('WS: Disconnect');
    //TODO 'ws: disconnect'
  }
}

function onMessage(evt) {
  console.log(evt.data);
  var str = JSON.parse(evt.data, function(key, value) {
    if (key == 'inDate') {return new Date(value);}
    return value;
  });
  console.log('inDate: ' + str.inDate);
  if (str.type === 'sensor') { //если Сенсор

    if (str.light != undefined) {  //датчик света
      var idDiv = str.place + '_light';
      var msgList = document.getElementById(idDiv);
      msgList.innerHTML = '<i class="fas fa-sun"></i> ' + str.light;
    }

    if (str.temp != undefined) {  // датчик темпиратуры
      var idDiv = str.place + '_temp';
      var msgList = document.getElementById(idDiv);
      msgList.innerHTML = '<i class="fas fa-thermometer-half fa-lg"></i> ' + Math.round(str.temp) + '&deg;C';
    }

    if (str.pres != undefined) {  // датчик давления
      var idDiv = str.place + '_pres';
      var msgList = document.getElementById(idDiv);
      msgList.innerHTML = '<i class="fas fa-sort-amount-down fa-lg"></i> ' + Math.round(str.pres) + 'hPa';
    }

    if (str.hum != undefined) {  // датчик влажности
      var idDiv = str.place + '_hum';
      var msgList = document.getElementById(idDiv);
      msgList.innerHTML = '<i class="fas fa-tint fa-lg"></i> ' + Math.round(str.hum) + '%';
    }

    if(str.sw1 != undefined){
    		var idDiv = str.place + '_sw1';
      var msgList = document.getElementById(idDiv);
      if(str.sw1 === false) msgList.innerHTML = '<i class="far fa-lightbulb lg sw_off"></i>';
      if(str.sw1 === true) msgList.innerHTML = '<i class="fas fa-lightbulb lg sw_on"></i>';
    }

    if(str.people != undefined){
    		var idDiv = str.place + '_people';
      var msgList = document.getElementById(idDiv);
      msgList.innerHTML = '<i class="fas fa-male lg people"></i> ' + str.people;
    }


    if (str.inDate != undefined) {     // время показаний датчиков
    	if(str.temp != undefined){
      outTermTime.setTime(str.inDate);
      console.log('outTermTime: ' + outTermTime);
     }
    }
  }
}

function onError(error) {
  alert('ws: error(' + error.message + ')');
}

function wsSend(msg) {
  console.log('WS: Send');
  var str = {
    type: "interface",
    msg: msg
  };
  var jsonMsg = JSON.stringify(str);
  ws.send(jsonMsg);
}
