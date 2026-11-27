# CLASSVOICE — privacy, no-login policy and deployment

## Confirmed product decision: no college email, no OTP, no student account

CLASSVOICE will not request or attach a college email address. It will not send OTPs, require Google/Microsoft sign-in, or ask students to create accounts.

That is a deliberate product choice. It also creates a real trade-off:

- Anyone who has the public website link may be able to open it.
- The system cannot prove that a visitor belongs to VIT Pune FY ET-D.
- A browser-local reaction limit can be bypassed by clearing browser storage, changing browser or using another device.
- A backend can limit one vote per pseudonymous browser token, but that is not the same as one human/student = one vote.
- A shared class access code can reduce casual access, but students can share it; it is not identity verification.

Do not advertise “verified students only” or “one student, one vote” unless a privacy-preserving, independently reviewed credential design is later approved. The current product promise should be: **no college email, no OTP, no student account, and no voter names shown publicly**.

## What the current prototype stores

The current static prototype:
- keeps demo concern submissions in JavaScript memory only;
- remembers reactions in this browser's local storage;
- does not send concerns to a database;
- does not request names, roll numbers, college emails or OTPs;
- includes synthetic concern and trend examples, clearly marked as demo.

Browser local storage is not secure authentication and is not shared across devices. Clearing site data resets the local reaction record.

## What a future backend may process

Even without accounts or email, a hosted website/API may process technical metadata such as IP address, request time, browser/device information, security logs and abuse-prevention signals. Hosting, CDN and database providers may retain operational logs under their own policies. Never promise absolute untraceability or “no record exists.”

A production privacy notice should explain:
- exactly what fields are stored;
- whether IP addresses are logged and for how long;
- who can moderate concerns;
- who can change action statuses;
- what CR Sarthak Jain and ACR Prashashti Wankhede can see;
- how long concerns and audit logs are retained;
- how users can report a privacy or safety issue.

## Recommended no-login production architecture

1. Static PWA hosted on GitHub Pages.
2. Backend database such as Supabase/Postgres.
3. No identity table, no email field and no OTP workflow.
4. Anonymous browser credential generated client-side and stored locally; send only a hash to the backend.
5. Database unique constraint `(concern_id, browser_token_hash)` to limit repeat reactions from the same browser credential.
6. Server-side functions for creating concerns, reactions, moderation, action statuses and weekly aggregate trends.
7. Public API returns only published concerns and aggregate counts; never expose voter rows or token hashes.
8. Rate limits, bot protection, moderation queue and minimum reporting thresholds (for example, suppress aggregate counts below 5).
9. Clearly label this as browser/device-level abuse control, not proof of student identity.

A browser token can be deleted or copied, so this approach cannot provide a mathematically reliable one-human-one-vote guarantee. If the class later insists on a strict student-only gate, that would require some form of trusted credential or in-person issued unique code. A shared code is not robust against sharing and must not be described as verification.

## Weekly concern trends

The prototype contains a five-week synthetic trend series solely to demonstrate the chart. It is not real student feedback.

In production, the backend should group published concern records by week and category, e.g. `date_trunc('week', created_at)`, and return weekly counts. Use the same category definitions over time. Do not infer that a teacher caused a problem from a trend chart; it shows reporting volume, not proof or causation. Use privacy thresholds for small groups.

## Deployment

### Static PWA prototype
1. Upload the four app files: `index.html`, `styles.css`, `app.js`, `data.js`.
2. Upload `manifest.webmanifest` and `sw.js` to the repository root.
3. Create an `icons` folder and upload `classvoice-192.png` and `classvoice-512.png` into it.
4. Upload the documentation, CSV and SQL files.
5. Enable GitHub Pages from `main` and `/(root)`.
6. Visit the HTTPS Pages URL. The manifest and service worker require HTTPS (GitHub Pages provides HTTPS).

### Backend
The included `supabase-schema.sql` is a starter only. It creates tables, read policies and a weekly-trend view. It does not create a complete production API, secure moderation workflow or abuse controls. Do not add Supabase service-role keys to frontend files. Use server-side functions, test RLS and have the design reviewed before accepting real complaints.

## PWA installation

The site includes a web app manifest, service worker and 192px/512px icons.

- Android Chrome: open the HTTPS website, tap the Install app button if offered, or browser menu → Install app / Add to Home screen.
- iPhone: open the site in Safari, tap Share, choose Add to Home Screen, then Add.
- Desktop Chrome/Edge: use the install icon in the address bar or browser menu → Install CLASSVOICE.

Install availability and wording vary by browser/device. A PWA is still a web app, not an app-store native app. The service worker caches the app shell for repeat/offline opening; backend features, when added, may still need internet.

## Safety and moderation

Do not encourage naming, targeting, harassment or popularity contests about individual teachers. Ask students to describe observable classroom experiences and educational impact. Hide personal details, threats, slurs and unverified sensitive allegations. Provide a private route for urgent safety, discrimination or misconduct concerns rather than relying on public voting. Aggregate support indicates shared experience, not factual proof.

## Current limitations

- No college email, OTP, SSO or account.
- No secure student/class membership verification.
- No shared live database connected to the frontend.
- No real cross-device voting.
- Demo trends are synthetic.
- No live CR/ACR/HOD notifications.
- Timetable transcription is based on screenshots supplied by the owner and must be confirmed before official use.

Made by **Prathmesh Winedeshkar**.
