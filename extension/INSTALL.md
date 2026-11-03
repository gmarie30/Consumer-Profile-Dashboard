# Temporary Chrome installation

This connector is not published on the Chrome Web Store. Install only after reviewing the source and privacy disclosure. Do not treat this as a verified public listing.

1. Download the connector ZIP from the dashboard and extract it.
2. Open `chrome://extensions`, turn on Developer mode, click **Load unpacked**, and select the extracted folder containing `manifest.json`.
3. Reload the dashboard. Choose the history period and click **Connect Chrome**.
4. In the connector popup, review the requested period, click **Approve selected history period**, and accept Chrome’s optional History permission if you agree. If the popup does not open, open it from Chrome’s Extensions toolbar menu.
5. Return to the dashboard to explore the actual imported records. There is a two-minute approval timeout; reconnect if it expires.

Production scope: `https://gmarie30.github.io/Consumer-Profile-Dashboard/`. Development scope: explicit localhost and 127.0.0.1 origins on ports 5173/5174. No other site can request history. The extension never reads retailer page contents. Use the dashboard’s product form or catalog import for product capture.

Limits: 500 URLs and 3,000 actual visits per request. Chrome may retain less history than the selected period. Query strings and fragments are removed. Titles and paths may still contain personal text.

Disconnect in the dashboard or popup to revoke optional History permission and cancel pending reads. Delete session data separately to remove records already delivered. Remove the extension at `chrome://extensions` to uninstall it. Reset/reload clears dashboard records and feedback. Revoking permission never deletes Chrome’s underlying browsing history.

Automated tests mock Chrome APIs. They do not prove real installation, browser permission prompts or a live user-history transfer. Those tests require the owner’s explicit approval and have not been run on the owner’s personal profile.
