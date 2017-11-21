var searchMainViewAndCustomize = function() {
  var mainView = $('#formbuybtc');
  if($('#formbuybtc').length == 0 || $('#formconfirm').length == 0) {
    setTimeout(searchMainViewAndCustomize, 1000);
  } else {
    viewCustomize();
  }
};

var viewCustomize = function() {
  bitcoinView.setup($("#buybtc-loading").parent().parent().parent());
};

$(function(){
	searchMainViewAndCustomize();
});
