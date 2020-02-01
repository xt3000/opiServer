var ws = new WebSocket(location.origin.replace(/^http/, 'ws') + '/ws?type=interface');

ws.onopen = function() { onOpen() };
ws.onclose = function(evt) { onClose(evt) };
ws.onmessage = function(evt) { onMessage(evt) };
ws.onerror = function(error) { onError(error) };


//функции..
function onOpen() {

  //TODO

}

function onClose(evt) {
  if (evt.wasClean) {
    //TODO 'ws: close'
  } else {
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
  if (str.type === 'sensor') {
    if (str.light) {
      var idDiv = str.place + '_light'
      var msgList = document.getElementById(idDiv);
      msgList.innerHTML = '<i class="fas fa-sun"></i> ' + str.light;
    } else {msgList.innerHTML = '<i class="fas fa-sun"></i> <span style="color: red"> offline</span>'}

    if (str.temp) {
      var idDiv = str.place + '_temp'
      var msgList = document.getElementById(idDiv);
      msgList.innerHTML = '<i class="fas fa-thermometer-half fa-lg"></i> ' + str.temp + '&deg;C';
    } else {msgList.innerHTML = '<i class="fas fa-thermometer-half fa-lg"></i> <span style="color: red"> offline</span>'}

    if (str.inDate) {
      outTermTime.setTime(str.inDate);
      console.log('outTermTime: ' + outTermTime);
    }
  }
}

function onError(error) {
  alert('ws: error(' + error.message + ')');
}

function wsSend(msg) {
  var str = {
    type: "interface",
    msg: msg
  };
  var jsonMsg = JSON.stringify(str);
  ws.send(jsonMsg);
}
