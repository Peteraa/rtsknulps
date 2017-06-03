// background.js

function openNewTab(query, base_url) {
  chrome.tabs.create({
    url: base_url + query,
  });
}

function getBaseUrl(query) {
  // console.log(info.selectionText)
  base_url = chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    console.log(url);
    base_url = url.match(/^https:\/\/[a-z0-9,-._:]{2,300}\/[a-zA-Z-]{5}\/app\/[a-z0-9,-._:]{1,300}\//g);
    console.log(base_url);
    openNewTab(query, base_url);
    });
}

// When a user click a context menu item (right click menu)
// we handle it according to menuItemId
function menuClicked(info,tab) {
  if (info.menuItemId == "reverseAssetLookupID") {
    reverseAssetLookup(info,tab);
  } else if (info.menuItemId == "userFromIpHost"){
    userFromIpHost(info,tab);
  } else if (info.menuItemId == "ipHostFromUser"){
    ipHostFromUser(info,tab);
  } else {
    execute_query_with_id(info, info.menuItemId);
  }
}

function execute_query_with_id(info, id) {
  chrome.storage.sync.get({
    list: 'No queries saved',
  }, function (data) {
    query_list = data.list;
    // check if list is empty
    if (query_list == 'No queries saved'){
      console.log('No list present')
    } else {
      query_item = query_list[id];
      query = query_item.first + info.selectionText + query_item.last;
      getBaseUrl(query);
    }
  });
}

// reverseAssetLookup
function reverseAssetLookup(info,tab) {
  query = 'search?q=%7C%20%60reverse_asset_lookup(' + info.selectionText + ')%60'
  getBaseUrl(query);
}

// userFromIpHost
function userFromIpHost(info,tab) {
  query = 'search?q=search%20index%3D*%20sourcetype%3D"wineventlog%3Asecurity"%20EventCode%3D4624%20Logon_Type%3D*%20src%3D' + info.selectionText + '%20Account_Name%3D*%20src!%3DOSI*%20%7C%20timechart%20span%3D4h%20c%20BY%20Account_Name&display.page.search.mode=verbose&dispatch.sample_ratio=1&earliest=-24h%40h&latest=now'
  getBaseUrl(query);
}

// ipHostFromUser
function ipHostFromUser(info,tab) {
  query = 'search?q=search%20index%3D*%20sourcetype%3D"wineventlog%3Asecurity"%20EventCode%3D4624%20Logon_Type%3D*%20src%3D*%20Account_Name%3D' + info.selectionText + '%20src!%3DOSI*%20%7C%20timechart%20span%3D4h%20c%20BY%20src&display.page.search.mode=verbose&dispatch.sample_ratio=1&earliest=-24h%40h&latest=now&display.page.search.tab=statistics&display.general.type=statistics&display.visualizations.trellis.enabled=0&display.visualizations.charting.legend.placement=right&display.visualizations.charting.axisTitleX.visibility=visible&display.visualizations.charting.axisTitleY.visibility=visible&display.visualizations.charting.axisTitleY2.visibility=visible&display.visualizations.trellis.scales.shared=1&display.visualizations.trellis.splitBy=Account_Name&display.visualizations.charting.chart=column&display.visualizations.charting.chart.stackMode=stacked100'
  getBaseUrl(query);
}

// creating context menu (right click menu) item
chrome.contextMenus.create({
  title: "Reverse asset lookup: %s",
  contexts:["selection"],
  "id":"reverseAssetLookupID",
});

// creating context menu (right click menu) item
chrome.contextMenus.create({
  title: "User from IP/hostname: %s",
  contexts:["selection"],
  "id":"userFromIpHost",
});

// creating context menu (right click menu) item
chrome.contextMenus.create({
  title: "IP/hostname from user: %s",
  contexts:["selection"],
  "id":"ipHostFromUser",
});

chrome.storage.sync.get({
  list: 'No queries saved',
  }, function (data) {
  query_list = data.list;
  // check if list is empty
  if (query_list == 'No queries saved'){
    console.log('No list present')
  } else {

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
chrome.contextMenus.onClicked.addListener(menuClicked);
