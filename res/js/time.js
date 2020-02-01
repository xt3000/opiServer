var outTermTime = new Date();
// console.log(outTermTime);
// outTermTime.setHours(outTermTime.getHours()-3);
// console.log(outTermTime);
// outTermTime.setMinutes(outTermTime.getMinutes()-21);
// console.log(outTermTime);

function gTime() {
  //получаем дату
  var tm = new Date();
  //парсим время
  var h = tm.getHours();
  var m = tm.getMinutes();
  m = check(m);
  document.getElementById('clock').innerHTML = h+":"+m;

  //парсим дату
  var dat = tm.getDate();
  var mon = tm.getMonth()+1;
  var yer = tm.getFullYear();
  dat = check(dat);
  mon = check(mon);
  document.getElementById('date').innerHTML = dat + "." + mon + "." + yer;

  //console.log('time: ' + tm.getHours()+":"+tm.getMinutes());
  tm.setHours(tm.getHours()-2);
  //console.log('OTT: '+outTermTime.getHours()+":"+outTermTime.getMinutes());

  if (tm.getTime() > outTermTime.getTime()) {
    var t = new Date(tm - outTermTime);
    // console.log(t);
    //document.getElementById('outside_temp').style.color = "#b80000";
    //document.getElementById('outside_light').style.color = "#b80000";
    var termDate = document.getElementById('termDate');
    termDate.style.color = "#b80000";
    termDate.style.background = "transparent";
    termDate.style.fontSize = "60%";
    termDate.style.display = "block";
    termDate.style.textAlign = "center";
    termDate.innerHTML = "Обновлено больше" + '</br>' + (t.getUTCHours()+2) + "ч. назад";
  }else {
    //document.getElementById('outside_temp').style.color = "";
    //document.getElementById('outside_light').style.color = "";
    var termDate = document.getElementById('termDate');
    termDate.innerHTML = "";
  }

  setTimeout('gTime()', 500);
}


function check(i) {
  if (i<10) { i="0" + i;}
return i;
}
