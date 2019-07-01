/**
 * @type {{get: (function(string): Promise<*>)}}
 */
const Ajax = {
    get: url => new Promise((resolve, reject) => {
        if (!url) return reject('No url given');
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onreadystatechange = function () {
            if (request.readyState !== XMLHttpRequest.DONE)
                return;
            return request.status >= 200 && request.status < 300
                ? resolve(request.responseText)
                : reject(request.responseText);
        };
        request.send();
    })
};

/**
 * @param request
 * @return {string|undefined}
 */
const constructUrl = request => {
    switch (request.type) {
        case 'symbols':
            return 'https://fixer-middle-endpoint.azurewebsites.net/api/symbols';
        case 'rates':
            return 'https://fixer-middle-endpoint.azurewebsites.net/api/rates';
    }
};

/**
 * @param {{type:string, base:undefined|string}} request
 * @param sender
 * @param senderResponse
 * @return {boolean}
 */
function corsHandler(request, sender, senderResponse) {
    Ajax.get(constructUrl(request))
        .then(JSON.parse)
        .then(r => senderResponse({success: true, data: r}))
        .catch(error => senderResponse({success: false, data: JSON.stringify(error)}));
    return true;
}

function getSelectedText(request, sender, senderResponse) {
    senderResponse({success: true, data: window.getSelection().toString()});
    return true;
}

function handleError(request, senderResponse) {
    senderResponse({success: false, data: `Unknown method ${request.method}`});
    return true;
}

chrome.runtime.onMessage.addListener(function (request, sender, senderResponse) {
    if (request.method === 'openPopup') {
        senderResponse({success: true, data: null});
    } else if (request.method === 'getSelectedText') {
        return getSelectedText(request, sender, senderResponse);
    } else if (request.method === 'HttpGet') {
        return corsHandler(request, sender, senderResponse);
    } else {
        return handleError(request, senderResponse);
    }
    return true;
});


const openOptionsIfNew = async () => {
    const isFirstTime = await Browser.load(Utils.storageIds()).then(r => Object.keys(r).length === 0);
    if (isFirstTime) {
        chrome.tabs.create({
            url: 'options/options.html',
            active: true
        });
    }
};

openOptionsIfNew().finally();

chrome.contextMenus.create({
    title: `Add to mini converter`,
    contexts: ["selection"],
    onclick: data => {
        Browser.messageTab({
            method: 'contextMenu',
            text: data.selectionText
        }).finally();
    }
});