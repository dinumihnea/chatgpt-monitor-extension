console.log('ChatGPTMonitor loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log(`ChatGPTMonitor installed ${new Date().toString()}`);

  chrome.storage.sync.set({
    enabled: true,
  });
});

chrome.action.onClicked.addListener(tab => {
  console.log('Extension icon clicked for tab:', tab.id);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    console.log('Storage changed:', changes);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request, sender, sendResponse);
});
