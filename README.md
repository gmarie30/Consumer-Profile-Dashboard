# Consumer Intelligence Lab

Local-first consumer behavior classroom project. The dashboard is intentionally empty until a person supplies their own records. It does not include fictional profiles or demo consumer data.

## Run locally

Requires Node.js 22.12 or later (the Pages workflow uses Node.js 24 LTS).

```sh
npm install
npm run dev
```

For a production build, run `npm run build`. GitHub Actions deploys the build to Pages when the default `main` branch receives a push. The repository must have Pages configured to use **GitHub Actions**. The Vite base path is set to `/Consumer-Profile-Dashboard/`.

## Use your own records

Import CSV or JSON files through the dashboard or drop files onto the page. Generic browsing CSVs should include `url` or `link`, `title`, and an optional `date`, `time`, or `timestamp`. Google Takeout Chrome history JSON is supported. Product catalog/order rows can include `product name`, `product url`, `price`, and `image`/`image url`. ChatGPT exports are parsed from the `conversations` array; only user-authored message parts are considered, assistant messages are skipped, Markdown quote blocks and paired quoted spans are removed before categorization, and sensitive-topic matches are excluded. Files are parsed locally in memory; they are not saved by default.

Not every export schema is supported. Review imports before using an inference. Product recommendations only rank products present in your imported catalog; a match is a simple shared-category record count, not a prediction of satisfaction.

## Chrome connector

See [`extension/INSTALL.md`](extension/INSTALL.md). The Manifest V3 extension requests only the `history` permission and is limited to the intended GitHub Pages path plus localhost for development. It reads titles, URLs, and visit timestamps after a user selects a period and requests a connection. It sends the result to the dashboard tab only and does not persist records. The dashboard itself cannot access Chrome history without this extension.

The extension has not been installed or tested in a real Chrome profile and has not been submitted to the Chrome Web Store. Do not represent it as publicly installable. Web Store submission still needs publisher identity, PNG icon assets, final policy/legal review, data disclosures, and store approval.

## Privacy and inference

- No external AI, product, analytics, or tracking API is called.
- Records and feedback stay in the current page's memory and are cleared when the tab closes. The delete control clears the in-memory session.
- Broad interest categories use visible local keyword rules. Health, religion, politics, and sexuality terms are excluded. Keyword exclusions are conservative but imperfect.
- A category count, repeated domain, or timestamp is an observed feature. It is not proof of preference, motivation, personality, or identity.
- Time displays use the device's local timezone. Missing timestamps are left out.
- User feedback is held only in memory and is shown separately from rule-generated interpretations.
- Product images supplied as remote URLs may be fetched by the browser from that image host. To keep image display fully local, use embedded `data:image/...` values or omit image URLs.

## Data and security

Do not commit history exports, conversation archives, purchases, or profile outputs. `.gitignore` excludes common data extensions and import directories; review every staged change before publishing. The extension does not read passwords, cookies, page contents, or tokens.

## Verification

`npm test` covers a few inference safeguards using development-only fixtures. Run `npm test` and `npm run build` before release. Automated source checks do not replace an actual unpacked-extension test, permission-prompt review, browser-to-dashboard connection test, or responsive visual review.
