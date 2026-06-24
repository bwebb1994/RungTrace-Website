# RungTrace website

Static product and licensing website prepared for Netlify.

## Connect the live services

Edit `site-config.js` before deployment:

- GitHub Releases are loaded automatically from `bwebb1994/RungTrace-Downloads`.
- Publish each customer build as a GitHub Release with an `.exe`, `.msi`, `.msix`, or `.zip` asset.
- `downloadUrl`, `version`, and `releaseDate` remain available as fallback values.
- Set the two `checkoutUrl` values to the matching DevoLens hosted checkout links.
- Set `licensePortalUrl` to the customer license-management portal.
- Add final pricing, release version/date, contact emails, documentation, and release notes.

Buttons with an empty destination show a small configuration reminder instead of sending visitors to a broken page.

## Business purchase request email

The business purchasing form posts to a Netlify Function at `/.netlify/functions/business-purchase-request`.
It sends email through Resend using environment variables configured in Netlify, not client-side code.

Set these Netlify environment variables before relying on the form:

- `RESEND_API_KEY`: Resend API key.
- `BUSINESS_REQUEST_EMAIL`: destination inbox for quote and purchase-order requests, such as `brady@webbinnovations.com`.
- `BUSINESS_REQUEST_FROM_EMAIL`: verified sender address in Resend, such as `quotes@webbinnovations.com`.
- `BUSINESS_CONFIRMATION_FROM_EMAIL`: optional verified sender for customer confirmations. Defaults to `BUSINESS_REQUEST_FROM_EMAIL`.
- `SEND_BUSINESS_REQUEST_CONFIRMATION`: optional. Set to `false` to disable customer confirmation emails.

Verify the sender domain in Resend before production use. The form does not collect payment credentials or upload documents; customers are instructed to email purchase orders and supporting documents after submitting the request.

## Deploy

Drag this folder into Netlify Drop, connect it to a Git repository, or run:

```powershell
npx netlify deploy --prod
```

No build command is required. `netlify.toml` publishes the current directory and adds basic security and cache headers.

## Legal pages

The navigation references `privacy.html`, `terms.html`, and `eula.html`. Replace the starter pages with reviewed legal language before accepting payment.
