'use strict';

var bg = chrome.extension.getBackgroundPage();
var count;
window.onload = function() {
  bg.callback();
}

var main = function() {
  if(count != bg.info.count) {
    count = bg.info.count;

    var content = '<ul>';
    if (bg.info.infos.length > 0) {
      $.each(bg.info.infos, function(i, e) {
        if (!e.action_id || e.read) {
          content += '<li>';
        } else {
          content += '<li class="not-yet-read">';
        }
        if(e.action_id) {
          content += '<span class="icon-message"></span>';
          content += '<div class="message-container">';
          content += '<a target="_blank" href="' + senseConnector.URI + '/action_show/' + e.action_id + '">' + $('<div>').text(e.message).html() + '</a>';
        } else {
          content += '<span class="icon-info"></span>';
          content += '<div class="message-container">';
          content += '<span>' + e.message + '</span>';
        }
        content += '<div class="created-at">' + moment(e.created_at).format('MM/DD HH:mm') + '</div>';
        content += '</div>';
        content += '</li>';
      });
    } else {
      content = content + '<li>お知らせはありません</li>';
    }
    $('#content').html(content + '</ul>');
  }
}

document.getElementById('header-logo').addEventListener('click', function(){
  chrome.tabs.create({ url: senseConnector.URI });
}, false);

var onReadyTo = function(f) {
  if (document.readyState !== 'loading'){
    f();
  } else {
    document.addEventListener('DOMContentLoaded', f);
  }
}
onReadyTo(function() {
  var mainId = setInterval(main, 1000);
});

bg.callback();
