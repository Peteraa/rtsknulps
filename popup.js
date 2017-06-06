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

function remove_selected() {
  // get list
  chrome.storage.sync.get({
    list: 'No queries saved',
  }, function (data) {
    query_list = data.list;
    if (query_list == 'No queries saved'){
      console.log('No list present');
      set_status('List is empty.');
    } else {
      // get option selected (position)
      var selection = document.getElementById("selection");
      option_selected = selection.value;

      // remove selected element from list
      query_list.splice(option_selected,1);
      console.log('Trying to remove: ' + option_selected);

      // save updated list
      save_query_list(query_list);

      // tell user its removed
      set_status('Query removed successfully.');
      }
  });
}

/*
  If there are saved queries in chrome storage
  then show them to the user.
*/
chrome.storage.sync.get({
  list: 'No queries saved',
}, function (data) {
  query_list = data.list;
  // check if list is empty
  var list_div = document.getElementById('saved_queries');
  if (query_list == 'No queries saved'){
    console.log('No list present');
    list_div.innerHTML = '';
  } else {
    if (query_list.length < 1) {
      console.log('List is empty');
    } else {
      var html = '<select id="selection">';
      for (i = 0; i < query_list.length; i++) {
         html += '<option value="' + i + '">'  + query_list[i].name + '</option>';
      }
      html += '</select>';
      list_div.innerHTML = html;
    }
  }
});

function clearSavedQueries() {
  // clear saved queries
  chrome.storage.sync.clear();
  var list_div = document.getElementById('saved_queries');
  list_div.innerHTML = '';
  helper.setStatus('Options cleared successfully.');
}

document.getElementById('remove_selected').addEventListener('click', remove_selected);
document.getElementById('clear_saved_queries_button').addEventListener('click', clearSavedQueries);
document.getElementById('grab_query_button').addEventListener('click', grab_query_from_url);
document.getElementById('save_query_button').addEventListener('click', save_query_from_url);
