// helper.js

var helper = {
  updateContextMenu: function () {
    chrome.storage.sync.get({
      list: 'No queries saved',
      }, function (data) {
      query_list = data.list;
      // check if list is empty
      if (query_list == 'No queries saved'){
        console.log('No list present')
      } else {
        console.log('Updating context menu')
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
  }
}
