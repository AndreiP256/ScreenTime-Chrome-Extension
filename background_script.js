let timer = null;
let seconds = 0;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ seconds: 0, running: false });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start') {
        if (!timer) {
            chrome.storage.local.get('seconds', (result) => {
                seconds = result.seconds || 0;
                timer = setInterval(() => {
                    seconds++;
                    chrome.storage.local.set({ seconds });
                }, 1000);
                chrome.storage.local.set({ running: true });
            });
        }
    } else if (message.action === 'stop') {
        clearInterval(timer);
        timer = null;
        chrome.storage.local.set({ running: false });
    } else if (message.action === 'reset') {
        clearInterval(timer);
        timer = null;
        seconds = 0;
        chrome.storage.local.set({ seconds, running: false });
    } else if (message.action === 'get') {
        chrome.storage.local.get(['seconds', 'running'], (result) => {
            sendResponse(result);
        });
        return true; // Keep the message channel open for sendResponse
    }
});