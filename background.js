// background.js

/*
  The purpose of this file is to provide the long running task_status
  like when the user is interacting with the context (right-click) menu.
*/

function open_new_tab(query, base_url) {
  chrome.tabs.create({
    url: base_url + query,
  });
}

function get_base_url(query) {
  base_url = chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    base_url = url.match(/^https:\/\/[a-z0-9,-._:]{2,300}\/[a-zA-Z-]{5}\/app\/[a-z0-9,-._:]{1,300}\//g);
    open_new_tab(query, base_url);
    });
}

// When a user click a context menu item (right click menu)
// we handle it according to menuItemId
function menu_clicked(info,tab) {
  execute_query_with_id(info, info.menuItemId);
}

function execute_query_with_id(info, id) {
  chrome.storage.sync.get({
    list: 'No queries saved',
  }, function (data) {
    query_list = data.list;
    // check if list is empty
    if (query_list == 'No queries saved'){
      console.log('No list present');
    } else {
      query_item = query_list[id];
      query = query_item.first + info.selectionText + query_item.last;
      get_base_url(query);
    }
  });
}

chrome.storage.sync.get({
  list: 'No queries saved',
  }, function (data) {
  query_list = data.list;
  // check if list is empty
  if (query_list == 'No queries saved'){
    console.log('No list present')
  } else {

    chrome.contextMenus.removeAll();
    for (i = 0; i < query_list.length; i++) {
      query = query_list[i];

      chrome.contextMenus.create({
        title: query.name,
        contexts:["selection"],
        "id":i.toString(),
      });
    }
  }
});

// add listener to custom context menu (right click menu)
chrome.contextMenus.onClicked.addListener(menu_clicked);
