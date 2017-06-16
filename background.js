// background.js

/*
  The purpose of this file is to provide the long running task_status
  like when the user is interacting with the context (right-click) menu.
  This is updated to the more memory efficient event page
  and is therefor not the old school background version.
*/

// get splunk query url and extract query and base url from it
// then execute that query in a new tab
function get_base_url(query) {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;

    // use regex to extract the base url
    base_url = url.match(/^https:\/\/[A-Za-z0-9,-._:]{2,300}\/[a-zA-Z-]{5}\/app\/[A-Za-z0-9,-._:]{1,300}\//g);

    // execute query in new tab
    chrome.tabs.create({
      url: base_url + query,
    });
  });
}

// When a user click a context menu item (right click menu)
// we handle it according to menuItemId
function menu_clicked(info,tab) {
  execute_query_with_id(info, info.menuItemId);
}

// execute the query selected from menu item with id
function execute_query_with_id(info, id) {
  chrome.storage.sync.get({
    list: 'No queries saved',
  }, function (data) {
    query_list = data.list;
    // check if list is empty
    if (query_list == 'No queries saved'){
      console.log('No list present');
    } else {
      // build query from storage and insert the selected text
      query_item = query_list[id];
      query = query_item.first + info.selectionText + query_item.last;

      // execute query
      get_base_url(query);
    }
  });
}

// update the right click menu (context menu)
chrome.storage.sync.get({
  list: 'No queries saved',
  }, function (data) {
  query_list = data.list;
  // check if list is empty
  if (query_list == 'No queries saved'){
    // no need to update right click menu
    console.log('No list present')
  } else {
    // purging right click menu
    chrome.contextMenus.removeAll();

    // adding all queries to right click menu
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
