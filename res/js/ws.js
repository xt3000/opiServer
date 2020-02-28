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
    getSensor(str);
  }else if (str.type == 'req') {
    getRequest(str);
  }else if (str.type == 'setOptions') {
    getOptions(str);
  }
}

function onError(error) {
  alert('ws: error(' + error.message + ')');
}

function wsSend(com, place, num) {
  console.log('WS: Send');
  var str = {
    type: "interface",
    command: com,     //    'req' - запрос массива данных,
                      // ...'setOptions' - отправка настроек на сервер,
                      // ...'getOptions' - запрос настроек
    place: place,
    num: num
  };
  var jsonMsg = JSON.stringify(str);
  ws.send(jsonMsg);
}
