export function setBadgeError(tabId?: number) {
  chrome.action.setBadgeText({
    text: '!',
    tabId,
  });

  chrome.action.setBadgeBackgroundColor({
    color: '#ff4444',
    tabId,
  });
}


export function clearBadgeError(tabId?: number) {
  chrome.action.setBadgeText({
    text: '',
    tabId,
  });
}
