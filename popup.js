// popup.js

// save query from url
function grab_query_from_url() {
  get_base_url();
}

function get_base_url(query) {
  // get url
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    base_url = url.match(/^https:\/\/[a-z0-9,-._:]{2,300}\/[a-zA-Z-]{5}\/app\/[a-zA-Z]{1,300}\//g)

    // present url to user in editable format
    var query_space = document.getElementById('query_space');
    var query_input = document.getElementById('query_input');
    query_input.value = url;
  });
}

function save_query_from_url() {
  // Get url
  var query_input = document.getElementById('query_input').value;

  // Get name
  var name = document.getElementById('name_input').value;

  // Remove base_url
  var query = query_input.replace(/^https:\/\/[a-z0-9,-._:]{2,300}\/[a-zA-Z-]{5}\/app\/[a-zA-Z]{1,300}\//g,'');

  // Extract query
  var split_query = query.split('$$$');
  if (split_query.length == 3) {
    var first = split_query[0];
    var last = split_query[2];
    save_query(first, last, name);
  } else if (split_query.length == 2) {
    var first = split_query[0];
    var last = '';
    save_query(first, last, name);
  }
}

// Saves options to chrome.storage
function save_query(first, last, name) {

  var query = {
    'first': first,
    'last': last,
    'name': name
  };

  chrome.storage.sync.get({
    list: 'No queries saved',
  }, function (data) {
    query_list = data.list;
    if (query_list == 'No queries saved'){

      var query_list = new Array();
    }
    update_queryList(query_list, query);
  });
}

// update query_list and save
function update_queryList(query_list, query){
  query_list.push(query);
  save_query_list(query_list);
}

function save_query_list(query_list){
  // set query_list
  chrome.storage.sync.set({list:query_list}, function () {
    set_status('Query saved.');
    helper.updateContextMenu();
    console.log('HIT');
  });
}

// set status
function set_status(message) {
  var status = document.getElementById('task_status');
  status.textContent = message;
  setTimeout(function () {
    status.textContent = '';
  }, 4000);
}

document.getElementById('grab_query_button').addEventListener('click', grab_query_from_url);
document.getElementById('save_query_button').addEventListener('click', save_query_from_url);
