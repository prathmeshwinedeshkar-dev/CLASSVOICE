# CLASSVOICE — VIT Pune FY ET-D

A mobile-first classroom feedback prototype and installable Progressive Web App (PWA).

## Approved scope
- One class context: VIT Pune FY ET-D.
- Timetable-linked faculty and subject selection.
- Publicly viewable concern feed in the eventual no-login model.
- Support reactions only; no comments, replies, chat or debate.
- Sort by most supported, least supported and newest; filter all-time/today.
- Weekly concern trend chart with category and measure filters.
- Public action-status tracker.
- Privacy centre.
- CR: Sarthak Jain · ACR: Prashashti Wankhede (intended aggregate board/report viewers).
- Creator credit: Made by Prathmesh Winedeshkar.

## No-email policy
CLASSVOICE does not ask for college email, OTP, Google/Microsoft sign-in or student accounts. This means the website cannot prove that visitors belong to ET-D. The local demo limits one reaction per browser profile, but users can clear storage or switch devices. Do not claim strict student-only access or one-human-one-vote.

## Current prototype
- Concerns and trend history are synthetic demo examples.
- New concern submissions exist only in JavaScript memory for the current page session.
- Reactions are stored in local storage on the current browser.
- No shared backend, live database, cross-device voting or real reporting is connected.
- Do not collect real or sensitive complaints in this build.

## PWA files
- `manifest.webmanifest` — app name, icon, display and launch settings.
- `sw.js` — caches the static app shell.
- `icons/classvoice-192.png` and `icons/classvoice-512.png` — install icons.

## Files
- `index.html`, `styles.css`, `app.js`, `data.js` — frontend.
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA install/offline shell.
- `supabase-schema.sql` — starting no-email database schema.
- `PRIVACY-AND-DEPLOYMENT.md` — privacy and backend plan.
- `GITHUB-ZERO-TO-HERO.md` — beginner upload/deployment guide.
- `MASTER-PROMPT.txt` — reusable build prompt.
- `faculty-import-template.csv` — timetable import template.

## Run locally
Serve the folder over localhost (not by double-clicking the HTML file) so the service worker can run:
`python -m http.server 8000`
Then visit `http://localhost:8000`.

## Weekly trends
The chart currently uses synthetic five-week example data. In production, compute weekly counts from actual published concern timestamps and return aggregate data only. Trends show volume changes, not proof, blame or causation.

## Timetable
The timetable was transcribed from screenshots supplied for 23–28 November 2026. It has not been independently verified by VIT. Confirm current faculty, rooms, codes, days and lab batches before launch.

## Production requirements
No-email production can use anonymous browser credentials and server-side uniqueness per credential, but this does not equal one person = one vote. Use strict RLS, server-side validation, moderation, rate limits, bot protection, small-cell suppression, retention controls and independent privacy/security review. Never put service-role keys in frontend files.

Made by **Prathmesh Winedeshkar**.
