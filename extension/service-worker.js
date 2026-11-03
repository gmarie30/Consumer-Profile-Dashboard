const MAX_URLS = 500, MAX_VISITS = 3000;
let pending = null, generation = 0, dashboardTab = null;
function isApprovedDashboard(raw) {
  try { const u = new URL(raw); return (u.origin === 'https://gmarie30.github.io' && u.pathname.startsWith('/Consumer-Profile-Dashboard/')) || ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'].includes(u.origin); } catch { return false; }
}
function approvedSender(sender) { return sender.frameId === 0 && sender.tab?.id !== undefined && isApprovedDashboard(sender.url) && isApprovedDashboard(sender.tab.url); }
function popupSender(sender) { return sender.id === chrome.runtime.id && sender.url === chrome.runtime.getURL('popup.html'); }
function redactUrl(raw) { try { const u = new URL(raw); if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password || /token|auth|session|password|secret|credential/i.test(u.pathname)) return null; u.search = ''; u.hash = ''; return u.toString(); } catch { return null; } }
async function readHistory(days) {
  const startTime = Date.now() - days * 864e5, endTime = Date.now();
  const items = await chrome.history.search({ text: '', startTime, endTime, maxResults: MAX_URLS });
  const records = [];
  for (let i = 0; i < items.length && records.length < MAX_VISITS; i += 20) {
    const batch = items.slice(i, i + 20);
    const visits = await Promise.all(batch.map(item => chrome.history.getVisits({ url: item.url })));
    batch.forEach((item, j) => { const url = redactUrl(item.url); if (!url) return;
      for (const visit of visits[j]) if (records.length < MAX_VISITS && visit.visitTime >= startTime && visit.visitTime <= endTime) records.push({ url, title: item.title || url, lastVisitTime: visit.visitTime });
    });
  }
  return { records, truncated: items.length >= MAX_URLS || records.length >= MAX_VISITS };
}
async function handle(message, sender) {
  if (message?.type === 'CIL_HISTORY_QUERY') {
    if (!approvedSender(sender)) return { ok: false, error: 'Unapproved dashboard origin or frame.' };
    if (!Number.isInteger(message.days) || message.days < 1 || message.days > 3650 || !/^[a-f0-9-]{36}$/i.test(message.requestId ?? '')) return { ok: false, error: 'Invalid request.' };
    if (pending) return { ok: false, error: 'A connection is already awaiting your approval in the extension.' };
    dashboardTab = sender.tab.id;
    pending = { tabId: sender.tab.id, days: message.days, requestId: message.requestId, at: Date.now(), generation: ++generation };
    try { await chrome.action.openPopup(); } catch { /* User can open the toolbar popup. */ }
    return { ok: true, pending: true };
  }
  if (message?.type === 'CIL_PENDING' && popupSender(sender)) return { ok: true, days: pending?.days, pending: !!pending && Date.now() - pending.at < 120000 };
  if (message?.type === 'CIL_APPROVE' && popupSender(sender)) {
    const request = pending; pending = null;
    if (!request || Date.now() - request.at > 120000) return { ok: false, error: 'Request expired. Connect again from the dashboard.' };
    if (!await chrome.permissions.contains({ permissions: ['history'] })) return { ok: false, error: 'History permission was not granted.' };
    try {
      const result = await readHistory(request.days);
      if (request.generation !== generation) return { ok: false, error: 'Session was disconnected.' };
      await chrome.tabs.sendMessage(request.tabId, { type: 'CIL_HISTORY_RESULT', requestId: request.requestId, ...result });
      return { ok: true, count: result.records.length };
    } catch { return { ok: false, error: 'Could not deliver records. Reload the dashboard and connect again.' }; }
  }
  if (message?.type === 'CIL_DISCONNECT' && (approvedSender(sender) || popupSender(sender))) {
    generation++; pending = null;
    await chrome.permissions.remove({ permissions: ['history'] });
    if (dashboardTab !== null) { try { await chrome.tabs.sendMessage(dashboardTab, { type: 'CIL_DISCONNECTED' }); } catch { /* Dashboard may have closed. */ } }
    dashboardTab = null;
    return { ok: true };
  }
  return { ok: false, error: 'Unauthorized message.' };
}
chrome.runtime.onMessage.addListener((message, sender, respond) => { handle(message, sender).then(respond).catch(() => respond({ ok: false, error: 'Connector operation failed.' })); return true; });
