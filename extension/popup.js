const status = document.getElementById('status'), approve = document.getElementById('approve');
chrome.runtime.sendMessage({ type: 'CIL_PENDING' }, response => {
  approve.disabled = !response?.pending;
  status.textContent = response?.pending ? `Dashboard requested ${response.days} days. Approve below to read and transfer that history locally.` : 'Click Connect Chrome in the dashboard first. No history has been read.';
});
approve.addEventListener('click', async () => {
  // permissions.request must run directly from this user gesture in extension UI.
  const granted = await chrome.permissions.request({ permissions: ['history'] });
  if (!granted) { status.textContent = 'Permission declined. No history was accessed.'; return; }
  approve.disabled = true; status.textContent = 'Reading the approved period locally…';
  const result = await chrome.runtime.sendMessage({ type: 'CIL_APPROVE' });
  status.textContent = result?.ok ? `${result.count} visit records delivered locally. Return to the dashboard.` : result?.error || 'Could not connect. Try again.';
});
document.getElementById('disconnect').addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ type: 'CIL_DISCONNECT' });
  approve.disabled = true; status.textContent = 'History permission revoked. Clear dashboard session data separately to remove previously imported records.';
});
