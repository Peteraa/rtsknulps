// helper.js

/*
  The purpose of this file is to house code shared between
  the other .js files.
*/

var helper = {
  // update the right-click menu
  update_context_menu: function () {
    chrome.storage.sync.get({
      list: 'No queries saved',
      }, function (data) {
      query_list = data.list;
      // check if list is empty
      if (query_list == 'No queries saved'){
        console.log('No list present')
      } else {
        console.log('Updating context menu')
        chrome.contextMenus.removeAll();
        for (i = 0; i < query_list.length; i++) {
          query = query_list[i];

          chrome.contextMenus.create({
            title: query.name + ': %s',
            contexts:["selection"],
            "id":i.toString(),
          });
        }
      }
    });
  },
  // show feedback message to user
  set_status: function (message) {
    var status = document.getElementById('task_status');
    if (status != null) {
      status.textContent = message;
      setTimeout(function () {
        status.textContent = '';
      }, 4000);
    }
  },
  save_query_list: function (query_list) {
    // set query_list
    chrome.storage.sync.set({list:query_list}, function () {
      helper.set_status('Query saved.');
      var list_div = document.getElementById('saved_queries');
      if (list_div != null) {
        show_updated_query_list();
      }
      helper.update_context_menu();
    });
  },
  build_initial_ES_searches: function () {
    var query_list = new Array();

    first = 'search?q=%7C%20%60reverse_asset_lookup(';
    last = ')%60';
    name = 'Reverse asset lookup';

    var query = {
      'first': first,
      'last': last,
      'name': name
    };

    query_list.push(query);

    first = 'search?q=search%20index%3D*%20sourcetype%3D"wineventlog%3Asecurity"%20EventCode%3D4624%20Logon_Type%3D*%20src%3D';
    last = '%20Account_Name%3D*%20src!%3DOSI*%20%7C%20timechart%20span%3D4h%20c%20BY%20Account_Name&display.page.search.mode=verbose&dispatch.sample_ratio=1&earliest=-24h%40h&latest=now';
    name = 'User from IP/hostname';

    var query = {
      'first': first,
      'last': last,
      'name': name
    };

    query_list.push(query);

    first = 'search?q=search%20index%3D*%20sourcetype%3D"wineventlog%3Asecurity"%20EventCode%3D4624%20Logon_Type%3D*%20src%3D*%20Account_Name%3D';
    last = '%20src!%3DOSI*%20%7C%20timechart%20span%3D4h%20c%20BY%20src&display.page.search.mode=verbose&dispatch.sample_ratio=1&earliest=-24h%40h&latest=now&display.page.search.tab=statistics&display.general.type=statistics&display.visualizations.trellis.enabled=0&display.visualizations.charting.legend.placement=right&display.visualizations.charting.axisTitleX.visibility=visible&display.visualizations.charting.axisTitleY.visibility=visible&display.visualizations.charting.axisTitleY2.visibility=visible&display.visualizations.trellis.scales.shared=1&display.visualizations.trellis.splitBy=Account_Name&display.visualizations.charting.chart=column&display.visualizations.charting.chart.stackMode=stacked100';
    name = 'IP/hostname from user';

    var query = {
      'first': first,
      'last': last,
      'name': name
    };

    query_list.push(query);

    helper.save_query_list(query_list);
  }
}
