# RungTrace website

Static product and licensing website prepared for Netlify.

## Connect the live services

Edit `site-config.js` before deployment:

- Set `downloadUrl` to the latest Windows release.
- Set the two `checkoutUrl` values to the matching DevoLens hosted checkout links.
- Set `licensePortalUrl` to the customer license-management portal.
- Add final pricing, release version/date, contact emails, documentation, and release notes.

Buttons with an empty destination show a small configuration reminder instead of sending visitors to a broken page.

## Deploy

Drag this folder into Netlify Drop, connect it to a Git repository, or run:

```powershell
npx netlify deploy --prod
```

No build command is required. `netlify.toml` publishes the current directory and adds basic security and cache headers.

## Legal pages

The navigation references `privacy.html`, `terms.html`, and `eula.html`. Replace the starter pages with reviewed legal language before accepting payment.
