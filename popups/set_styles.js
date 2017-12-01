/**
* Update the styles for the domain in the data object. Then save the data object to the browser
* storage.
*
* @param hostname String
* @param styles String
*/
function saveStyles(hostname, styles) {
    browser.storage.local.get().then(function(data) {
        data[btoa(hostname)] = styles;

        browser.storage.local.set(data);
    });
}

/**
*
* @param data Object
*/
function setupPresetSelect(data) {
    var $select = document.getElementById('PresetSelect');
    let $textarea = document.getElementById('StylesTextarea');

    Object.keys(data).forEach(function(key) {
        var $option = document.createElement('option');

        $option.value = key;
        $option.innerText = atob(key);

        $select.appendChild($option);
    });

    $select.addEventListener('change', function(ev) {
        var targetStyles = data[ev.target.value];

        if (targetStyles) {
            $textarea.value = data[ev.target.value];
        }
    });
}

browser.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
    var $textarea       = document.getElementById('StylesTextarea');
    var hostname        = tabs[0].url;
    var hostnameMatches = tabs[0].url.match(/[^:]+:\/\/[^\/]+/);

    // if a hostname was found, use that instead of the full url
    if (hostnameMatches) {
        hostname = hostnameMatches[0];
    }

    // show the domain in the placeholder so the user can see it
    document.getElementById('HostnamePlaceholder').innerText = hostname;

    browser.storage.local.get().then(function(data) {
        // if saved data exists for the current domain, load it into the textarea
        if (data[btoa(hostname)]) {
            $textarea.value = data[btoa(hostname)];
        }

        setupPresetSelect(data);
    });

    /**
    * When the Save button is clicked, add the styles to the page and save them in the browser's
    * storage.
    */
    document.getElementById('SaveButton').addEventListener('click', function() {
        var styles = $textarea.value;

        browser.tabs.insertCSS(tabs[0].id, { code: styles });

        saveStyles(hostname, styles);
    });
});