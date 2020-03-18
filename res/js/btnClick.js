function onUpdClick(name, place) {
  let room = {
    'k0': 'Коридоре',
    'k1': 'Спальне',
    'k2': 'Детской',
    'k3': 'Гостинной',
    'k4': 'Туалете',
  }
  event.stopPropagation();
  result = confirm('Вы уверены что хотите обновить прошивку датчика в ' + room[place] + '?');
  if(result) wsSend(name, place, 'upd', 0);
}
