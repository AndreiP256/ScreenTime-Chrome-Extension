let seconds = 0;
let updateInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', start);
    document.getElementById('stopButton').addEventListener('click', stop);
    document.getElementById('resetButton').addEventListener('click', reset);

    // Get the current timer state from the background script
    chrome.runtime.sendMessage({ action: 'get' }, (response) => {
        seconds = response.seconds;
        document.getElementById('screenTime').innerText = formatTime(seconds);
        if (response.running) {
            document.getElementById('startButton').setAttribute('disabled', 'disabled');
            startUpdating();
        }
    });
});

function start() {
    chrome.runtime.sendMessage({ action: 'start' });
    document.getElementById('startButton').setAttribute('disabled', 'disabled');
    startUpdating();
}

function stop() {
    chrome.runtime.sendMessage({ action: 'stop' });
    document.getElementById('startButton').removeAttribute('disabled');
    stopUpdating();
}

function reset() {
    chrome.runtime.sendMessage({ action: 'reset' });
    document.getElementById('startButton').removeAttribute('disabled');
    seconds = 0;
    document.getElementById('screenTime').innerText = formatTime(seconds);
    stopUpdating();
}

function startUpdating() {
    if (!updateInterval) {
        updateInterval = setInterval(() => {
            chrome.runtime.sendMessage({ action: 'get' }, (response) => {
                seconds = response.seconds;
                document.getElementById('screenTime').innerText = formatTime(seconds);
            });
        }, 1000);
    }
}

function stopUpdating() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}