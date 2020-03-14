$("input[name=login]").on('focusin', function(){
  $("#hrLogin").addClass("inputActive");
  $("#login").addClass("moveUp");
});

$("input[name=login]").on('focusout', function(){
  if (!$("input[name=login]").val()) {
    $("#hrLogin").removeClass("inputActive");
    $("#login").removeClass("moveUp");
  }
});

$("input[name=password]").on('focusin', function(){
  $("#hrPass").addClass("inputActive");
  $("#pass").addClass("moveUp");
});

$("input[name=password]").on('focusout', function(){
  if (!$("input[name=password]").val()) {
    $("#hrPass").removeClass("inputActive");
    $("#pass").removeClass("moveUp");
  }
});

function onSubmit(){
  document.querySelector("#forma").submit();
  return true;
}
