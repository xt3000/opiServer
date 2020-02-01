// JavaScript Document
// JavaScript Document
var wrap = document.getElementById("wrapper");
wrapperSize();
window.addEventListener("resize", function() {wrapperSize()}, false);

//wrapper with menu
/*
function wrapperSize() {
	if ((document.documentElement.clientHeight * 1.5) > document.documentElement.clientWidth) {
    wrap.style.marginLeft = "calc(50% - 45vw + 70px)";
  	wrap.style.height = "calc(60vw - 46px)";
 		wrap.style.width = "calc(90vw - 70px)";
  } else {
    wrap.style.marginLeft = "calc(50% - 67.5vh + 70px)";
    wrap.style.height = "calc(90vh - 45px)";
    wrap.style.width = "calc(135vh - 70px)";
  }
}
*/

//wrapper without menu
function wrapperSize() {
	if ((document.documentElement.clientHeight * 1.5) > document.documentElement.clientWidth) {
    wrap.style.margin = "auto";
  	wrap.style.height = "60vw";
 		wrap.style.width = "90vw";
  } else {
    wrap.style.margin = "auto";
    wrap.style.height = "90vh";
    wrap.style.width = "135vh";
  }
}
