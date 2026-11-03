# Chrome Web Store submission package

Status: prepared for review, NOT submitted or publicly published. There is no verified store URL.

Single purpose: transfer a user-approved, bounded browsing-history period to this Consumer Intelligence Lab dashboard for local classroom analysis.

Optional `history` justification: the user clicks Connect Chrome on the dashboard, sees the period in the extension popup, and clicks Approve. Only then does Chrome request the History permission and the extension query actual visit timestamps with `chrome.history.search` and `chrome.history.getVisits`. No history is read at install time. The 500-URL / 3,000-visit cap is disclosed in the dashboard.

Dashboard access: content script matches only `https://gmarie30.github.io/Consumer-Profile-Dashboard/*` and the two development origins on port 5173. It cannot run on arbitrary retailer pages. There are no cookies, credential, tabs, scripting, storage, or broad host permissions. Product capture uses the dashboard form or catalog import; automatic retailer-page capture is intentionally not implemented.

Data disclosures: browsing activity (page titles, sanitized URLs, visit timestamps) is used only for the explicitly approved analysis. No sale, advertising, analytics, external AI, or server transfer. Query strings, fragments, embedded URL credentials, and obvious credential paths are discarded. Page titles can still include personal text. Raw records stay in dashboard memory, with no default persistence. Keyword exclusions reduce sensitive-topic analysis but cannot guarantee perfect classification. The History permission itself is broader than the subset read by this extension.

Publisher tasks before submitting: review all source and disclosures, supply verified publisher identity/contact, publish the privacy policy on an approved public URL, capture actual application screenshots, complete the store's data-use questionnaire, pay any publisher registration fee, and submit for Google review. The included PNG icons are 16, 48, and 128 pixels. Do not advertise a store listing or install button until the approved listing exists.

External review: Chrome Web Store publication requires the owner's approval and Google's review. Automated API mocks are not a real Chrome permission-prompt or installation test.
