// options.js

// Saves options to chrome.storage
function save_query() {
  // Get the values to save
  var first = document.getElementById('first').value;
  var last = document.getElementById('last').value;
  var name = document.getElementById('name').value;

  // build a query container
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
      // No list is saved, so we create one
      query_list = new Array();
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
    set_status('Options saved successfully.');
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

// check options
function check_options() {
  chrome.storage.sync.get({
    list: 'No queries saved',
  }, function (data) {
    query_list = data.list;
    // check if list is empty
    var list_div = document.getElementById('list');
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
  set_status('Options checked successfully.');
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    'query_list': 'No queries saved',
  }, function (options) {
    document.getElementById('url').value = options.url;
  });
}

// clear options
function clear_options() {
  chrome.storage.sync.clear();
  set_status('Options cleared successfully.');
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

document.getElementById('save').addEventListener('click', save_query);
document.getElementById('check').addEventListener('click', check_options);
document.getElementById('clear').addEventListener('click', clear_options);
document.getElementById('remove_selected').addEventListener('click', remove_selected);
