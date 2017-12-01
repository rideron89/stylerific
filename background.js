/**
* Load custom styles for a page, by finding the styles associated with the page's hostname.
*
* @param tab
*/
function loadTabStyles(tab) {
    // extract the hostname from the tab's URL
    var hostnameMatches = tab.url.match(/[^:]+:\/\/[^\/]+/);

    if (hostnameMatches !== null) {
        var hostname = hostnameMatches[0];

        browser.storage.local.get().then(function(data) {
            var target = data[btoa(hostname)];

            if (target) {
                browser.tabs.insertCSS(tab.tabId, { code: target });
            }
        });
    }
}

// when the page has finished loading, attempt to load the custom styles onto the page
browser.webNavigation.onDOMContentLoaded.addListener(loadTabStyles);