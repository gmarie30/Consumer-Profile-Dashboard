# Connector privacy disclosure

The connector's sole purpose is to deliver a selected browsing-history period to the Consumer Intelligence Lab for local classroom analysis. It requests optional `history` permission only after approval in its popup. It never reads passwords, cookies, raw tokens, credentials, or retailer page contents.

The selected subset contains page titles, sanitized URLs and actual visit timestamps, bounded to 500 URLs / 3,000 visits. Chrome grants broader history access than this subset, but the connector does not use it outside the requested period. Query strings and fragments are removed, embedded URL credentials and obvious credential paths rejected. Titles and remaining paths may contain private text.

Only the exact production dashboard path on gmarie30.github.io and explicit localhost/127.0.0.1 development origins on ports 5173/5174 can request a transfer. Every request requires separate popup approval. No remote server, analytics service or AI API receives records. The connector does not persist records. The dashboard holds them and its generated profile in tab memory until removed, reset, reloaded or closed.

Sensitive keyword matches are excluded by the dashboard, with conservative and imperfect rules. No sensitive-attribute profile is created. No browsing data is sold or used for advertising. Product matching is local keyword-category matching against voluntarily supplied catalogs. Remote images are blocked by the dashboard.

Disconnect revokes the optional History permission and cancels pending delivery. Existing dashboard records require separate deletion or a reload. Chrome history itself is not modified or deleted. You can remove the extension through chrome://extensions.

Publisher identity, verified contact information, a public privacy-policy URL and final store disclosures must be supplied by the owner before Chrome Web Store submission. This project has no verified Web Store listing.
