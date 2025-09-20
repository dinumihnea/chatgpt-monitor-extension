import { clearBadgeError, setBadgeError } from "@/background/badge-helper";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Action received:', request);

  const tabId = sender.tab?.id;
  switch (request.type) {
    case 'EMAIL_DETECTED': setBadgeError(tabId); break;
    case 'EMAIL_NOT_DETECTED': clearBadgeError(tabId); break;
    // other actions here
  }

  sendResponse({ received: true });
  return true
});
