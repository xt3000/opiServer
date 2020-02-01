// JavaScript
// roomTransformer

function onHtmlClick() {
	goDefault();
}

function onK3Click() {
	event.stopPropagation();
	goOn("k3");

	goOut("k1");
	goOut("k2");
	goOut("k0");
	goOut("k4");
}

function onK2Click() {
	event.stopPropagation();
	goOn("k2");

	goOut("k1");
	goOut("k3");
	goOut("k0");
	goOut("k4");
}

function onK1Click() {
	event.stopPropagation();
	goOn("k1");

	goOut("k3");
	goOut("k2");
	goOut("k0");
	goOut("k4");
}

function onK0Click() {
	event.stopPropagation();
	goOn("k0");

	goOut("k1");
	goOut("k2");
	goOut("k3");
	goOut("k4");
}

function onK4Click() {
	event.stopPropagation();
	goOn("k4");

	goOut("k1");
	goOut("k2");
	goOut("k0");
	goOut("k3");
}

//======================

function goOut(elemId) {
	var elem = document.getElementById(elemId);
	elem.classList.add('goOut');

	var roomName = elem.querySelector('.room-name');
	roomName.style.letterSpacing = "1000px";
}

function goOn(elemId) {
	var elem = document.getElementById(elemId);

	var box = elem.querySelectorAll('.hbox');
	for (var i=0; i<box.length; i++) {
		box[i].style.color = "#fff";
	}

	var roomBox = elem.querySelector('.room-box');
	roomBox.style.height = "calc(100% - 40px)";

	var contentBox = elem.querySelectorAll('.content-box');
	for (var i=0; i<contentBox.length; i++) {
		contentBox[i].style.marginTop = "0.7em";
	}

	var room = elem.querySelector('.room');
	room.style.top = "0";

	elem.classList.add('goOn');
}

function goDefault() {
	var box = document.querySelectorAll('.hbox');
	for (var i=0; box.length>i; i++) {
		box[i].style.color = "";
	}
		goDef("k0");
		goDef("k1");
		goDef("k2");
		goDef("k3");
		goDef("k4");
}

function goDef(id) {
	var elem = document.getElementById(id);

	var roomBox = elem.querySelector('.room-box');
	roomBox.style.height = "";

	var roomName = elem.querySelector('.room-name');
	roomName.style.letterSpacing = "";

	var contentBox = elem.querySelectorAll('.content-box');
	for (var i=0; i<contentBox.length; i++) {
		contentBox[i].style.marginTop = "";
	}

	var room = elem.querySelector('.room');
	room.style.top = "";

	elem.classList.remove('goOn');
	elem.classList.remove('goOut');
}
