'use strict';

// chrome.runtime.onInstalled.addListener(function (details) {
//   console.log('previousVersion', details.previousVersion);
// });

// var info = '';
// var apiUrl = '';
// var user = null;
// var portRead = null;
// var callback = null;
// var childId = 0;
// var mainPort = null;
// var gmailTabIds = [];
// chrome.browserAction.setBadgeText({text: ''});

// chrome.storage.onChanged.addListener(function(changes, namespace) {
//   if(changes.user !== undefined && changes.user.newValue !== undefined) {
//     user = changes.user.newValue;
//   }
//   if(changes.apiUrl !== undefined && changes.apiUrl.newValue !== undefined) {
//     apiUrl = changes.apiUrl.newValue;
//   }
// });

// chrome.extension.onConnect.addListener(function(port) {
//   switch(port.name) {
//   case "login_success":
//     if(gmailTabIds.indexOf(port.sender.tab.id) == -1) {
//       gmailTabIds.push(port.sender.tab.id);
//     }
//     break;
//   case "sense":
//     portRead = port;
//     port.onMessage.addListener(function(msg) {
//       if(info.count > 0) {
//         chrome.browserAction.setBadgeText({text: '' + info.count});
//       } else {
//         chrome.browserAction.setBadgeText({text: ''});
//       }
//       info = msg.info;
//     });
//     break;
//   case "login":
//     port.onMessage.addListener(function(msg) {
//       if(msg.url) {
//         mainPort = port;
//         chrome.windows.create({url: msg.url, focused: true, height: 900, width: 300}, function(child) {
//           childId = child.id;
//         });
//       }else{
//         mainPort.postMessage(msg);
//         chrome.windows.remove(childId);
//       }
//     });
//     break;
//   }
//   callback = function() {
//     portRead.postMessage('read');
//   };
// });


// chrome.tabs.onRemoved.addListener(function(tabId) {
//   var idx = gmailTabIds.indexOf(tabId);
//   if(idx != -1){ gmailTabIds.splice(idx, 1); }
//   if(gmailTabIds.length == 0){
//     chrome.browserAction.setBadgeText({text: ''});
//     info = '';
//   }
// });

// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) {
//     var cancel = null;
//     var uuid = pickupUuid(details.url);
//     if(blocking(uuid)) {
//       cancel = true;
//     } else {
//       cancel = false;
//     }
//     return { cancel: cancel };
//   },
//   { urls: ["https://*.googleusercontent.com/proxy/*"] },
//   [ "blocking" ]
// );

// function blocking(uuid){
//   return $.ajax({
//     type: 'POST',
//     url: apiUrl + '/mail/block_open_notice',
//     dataType: 'json',
//     data: {
//       user_id: user.id,
//       image_param: uuid
//     },
//     async: false
//   }).responseJSON.block;
// }

// function pickupUuid(url) {
//   var temp = url.split('?k=');
//   return temp[temp.length - 1];
// }
