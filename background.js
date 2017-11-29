browser.webNavigation.onDOMContentLoaded.addListener(function(details) {
    browser.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
        let hostname = tabs[0].url.match(/[^:]+:\/\/[^\/]+/)[0];

        if (hostname === null) {
            return;
        }

        browser.storage.local.get().then(function(data) {
            let target = data[btoa(hostname)];

            if (target) {
                browser.tabs.insertCSS(tabs[0].id, { code: target });
            }
        });
    });
});