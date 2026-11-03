# Consumer Intelligence Laboratory

A local consumer-analysis workspace built with React, TypeScript, Vite, D3 and Lucide. The application opens empty. It never includes a fictional personal profile and never reads private activity without a deliberate import or an approved Chrome extension request.

## Student workflow

Open the dashboard, connect Chrome, approve the selected period in the connector popup, then explore the profile. The connector is **unpublished**. Until Chrome Web Store approval, download its ZIP from the dashboard, extract it, enable Developer mode in `chrome://extensions`, choose **Load unpacked**, select the extracted folder containing `manifest.json`, and reload the dashboard. This temporary installation step cannot be skipped. See `extension/INSTALL.md`.

Alternatively choose **Import data** or drag a CSV, JSON, or JSONL export into the dashboard. Selecting a file authorizes local analysis of that file. Nothing is uploaded. Extract ZIP archives first. Limits: 30 MB per file, 50,000 records per import. Chrome reads at most 500 URLs and 3,000 individual visits per request and reports possible truncation. Browser retention limits can further reduce coverage.

## Features

- Overview with record coverage, observed frequencies and tentative interest interpretations.
- Interest universe: weighted force-directed D3 network, entity-type filters, search, drag, zoom, pan, reset, evidence inspector, and weighted label-propagation communities. Categories, websites, explicit brands, product rows, and research titles become nodes. Up to 240 nodes are displayed, ranked by count; omitted counts are disclosed. Communities describe record co-occurrence, not identity or causal relationships.
- Digital footprint: radial hourly rhythm, daily counts, day/hour heatmap with clickable evidence, and monthly interest flow when at least two observed months exist. Local device timezone is used.
- Shopping style: transparent research, value-word, site-exploration and premium-word signals. At least five visit records and two supporting records are required. Convenience remains insufficient data without supporting evidence. These are not psychological measurements.
- Provisional overlapping topic segments, with visible count ratios and limitations.
- Product discovery: open real retailer links, import catalog rows, or use the voluntary source-URL product form. No scraping, anti-bot bypass, or external product API.
- Recommendations rank imported real catalog items using the share of non-catalog records in the same classified category. Catalog entries never train their own preferences. Unclassified categories receive no match claim. Prices are imported or manually transcribed, never independently verified. No fabricated ratings or availability.
- AI vs reality: accurate/inaccurate/uncertain feedback, separated from rule-generated labels. Inaccurate interests are excluded from recommendation matches and segment membership.
- Privacy: source counts, record ledger, per-record and per-source deletion, disconnect with permission revocation, and session reset. In-flight imports are discarded after reset.
- Responsive sidebar, dark/light themes, reduced-motion support and no external font or analytics requests.

## Import schemas

CSV headers: `url`/`link`, `title`/`name`/`text`, `date`/`time`/`timestamp`. Product rows can use `product name`, `product url`, `brand`, `price`, `currency`. Use ISO currency codes such as USD. Quoted multiline CSV is supported.

JSON accepts a top-level array or arrays under `Browser History`, `history`, `items`, `orders`, `products`, `events`, or `activity`. Google Takeout `time_usec`, `titleUrl`, ISO timestamps, numeric seconds and milliseconds are supported. JSONL uses one object per line. Order files/rows are purchases, distinct from catalog products.

ChatGPT supports both the standard top-level conversations array and `{conversations:[...]}`. Only user-role message text is considered. Assistant messages, fenced blocks, Markdown blockquotes, HTML blockquotes, and curly/double quoted spans are excluded. This cannot establish the authorship of every unmarked pasted passage; review evidence before treating it as a preference. Other export formats may need normalization.

Only embedded PNG/JPEG/WebP base64 images display. Remote image URLs are intentionally blocked to prevent silent third-party requests. Source links open only when clicked. URL query strings and fragments are removed, and credential-bearing URLs and obvious credential paths are rejected. Page titles and ordinary paths may still contain personal text, so records stay in memory and should be reviewed.

## Privacy and methods

All classification is deterministic, local keyword analysis, not a hosted language model. Rules live in `src/model.ts`. Raw records, profile outputs and feedback are never persisted by default, placed in URLs, or sent to AI APIs or analytics. Reloading/closing the tab clears the session. Browser-managed memory and download handling are outside the application’s control.

Sensitive-topic keyword matches are excluded before analysis. This is conservative and imperfect, not a guarantee that every sensitive passage will be detected. The lab does not create sensitive categories, demographic segments, or sensitive-attribute predictions. Observed record counts are distinct from inferred interest labels. Missing, sparse, or unsupported evidence is labeled insufficient data.

The extension requests only optional `history` permission, after a popup approval gesture. Chrome's API gives a broader history permission than the subset actually queried. The extension reads visit times, titles and sanitized URLs only, connects only to the configured dashboard path and explicit loopback development origins, rejects subframes and unapproved senders, correlates requests, and cancels pending delivery on disconnect. It never accesses passwords, cookies, tokens, credentials or retailer page content. See the extension privacy and submission documents.

## Development and deployment

Requires Node.js 22.12+ (Node 24 is used in CI).

```sh
npm ci
npm test
npm run build
npm run dev -- --port 5174 --strictPort
```

Build packages the connector from an explicit code-only allowlist into `public/consumer-lab-extension.zip` and then creates `dist/`. System `zip` is required (available on macOS and the Ubuntu Actions image). The Vite base is `/Consumer-Profile-Dashboard/`.

The Pages workflow tests and builds on pushes to main, then deploys `dist/`. In repository Settings → Pages, choose GitHub Actions. Private-repository Pages availability depends on the GitHub plan; do not change repository visibility without reviewing that choice. Never put personal records in source, static assets, commits, workflow artifacts or screenshots. Use explicit code allowlists when staging; ignore rules are only a secondary safeguard.

Expected Pages address once deployment is successful: `https://gmarie30.github.io/Consumer-Profile-Dashboard/`. This is a configured target, not a claim that deployment is live.

For reproducible browser tests, start the app on port 5174, install a Playwright Chromium browser with `npx playwright install chromium`, then run `node scripts/browser-check.mjs`. Set `CHROME_CHANNEL=chrome` to use an installed Chrome in an isolated temporary profile. Browser tests use development-only fixtures and save screenshots under ignored `test-results/`, never public assets. A real unpacked-extension installation and real Chrome permission prompt are separate manual tests requiring explicit user approval.

## Publication status

No verified Chrome Web Store listing exists. `extension/STORE_SUBMISSION.md` contains the permission justification, disclosure checklist, and remaining publisher actions. Do not invent a listing URL or present an install button as store-backed. No personal records have been analyzed as part of building this application.
