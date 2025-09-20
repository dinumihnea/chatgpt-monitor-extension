import { ChatGPTEmailMonitor } from "./chat-gpt-text-monitor";

console.log('Secure Browser Extension: ChatGPT Email Monitor loaded');

const monitor = new ChatGPTEmailMonitor()

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    monitor.start();
  });
} else {
  monitor.start();
}

window.addEventListener('beforeunload', () => {
  monitor.destroy();
});
