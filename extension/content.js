if (window.top === window) {
  let pendingId = null;
  window.addEventListener('message', event => {
    if (event.source !== window || event.origin !== location.origin) return;
    if (event.data?.type === 'CIL_DISCONNECT') {
      pendingId = null;
      chrome.runtime.sendMessage({ type: 'CIL_DISCONNECT' }, () => { void chrome.runtime.lastError; window.postMessage({ type: 'CIL_DISCONNECTED' }, location.origin); }); return;
    }
    if (event.data?.type !== 'CIL_REQUEST_HISTORY' || pendingId) return;
    const { days, requestId } = event.data;
    if (!Number.isInteger(days) || days < 1 || days > 3650 || typeof requestId !== 'string') return;
    pendingId = requestId;
    chrome.runtime.sendMessage({ type: 'CIL_HISTORY_QUERY', days, requestId }, response => {
      const error = chrome.runtime.lastError;
      if (error || !response?.ok) { pendingId = null; window.postMessage({ type: 'CIL_HISTORY_ERROR', requestId, message: response?.error || 'Extension is unavailable.' }, location.origin); }
    });
  });
  chrome.runtime.onMessage.addListener(message => {
    if (message?.type === 'CIL_DISCONNECTED') { pendingId = null; window.postMessage(message, location.origin); return; }
    if (message?.type === 'CIL_HISTORY_RESULT' && message.requestId === pendingId) {
      pendingId = null; window.postMessage(message, location.origin);
    }
  });
}
