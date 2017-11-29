function saveStyles(hostname, styles) {
    browser.storage.local.get().then(function(data) {
        data[btoa(hostname)] = styles;

        browser.storage.local.set(data);
    });
}

browser.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
    let hostname = tabs[0].url.match(/[^:]+:\/\/[^\/]+/)[0];
    let $hostnamePlaceholder = document.getElementById('HostnamePlaceholder');
    let $saveButton = document.getElementById('SaveButton');
    let $stylesTextarea = document.getElementById('StylesTextarea');

    $hostnamePlaceholder.innerText = hostname;

    browser.storage.local.get().then(function(data) {
        let target = data[btoa(hostname)];

        if (data[btoa(hostname)]) {
            $stylesTextarea.value = target;
        }
    });

    $saveButton.addEventListener('click', function() {
        let styles = $stylesTextarea.value;

        browser.tabs.insertCSS(tabs[0].id, { code: styles });

        saveStyles(hostname, styles);
    });
});