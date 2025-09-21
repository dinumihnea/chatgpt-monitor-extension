/**
 * Sets browser extension badge to show error state with red background
 */
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


/**
 * Clears the browser extension badge error state
 */
export function clearBadgeError(tabId?: number) {
  chrome.action.setBadgeText({
    text: '',
    tabId,
  });
}
