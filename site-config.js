/*
 * RungTrace storefront configuration
 * Replace placeholder values before deploying to Netlify.
 * DevoLens hosted checkout or product links can be pasted directly below.
 */
window.RUNGTRACE_CONFIG = {
  version: "1.0.0",
  releaseDate: "Coming soon",
  downloadUrl: "",
  releaseNotesUrl: "",
  releases: {
    owner: "bwebb1994",
    repository: "RungTrace-Downloads",
    maximumShown: 1,
    installerAssetPattern: "\\.(exe|msi|msix|zip)$"
  },
  documentationUrl: "",
  licensePortalUrl: "",
  salesEmail: "sales@webbinnovations.com",
  supportEmail: "support@webbinnovations.com",
  legal: {
    // TODO: Confirm representative, DPO, retention, and provider-location summaries during final legal review.
    LEGAL_ENTITY_NAME: "Webb Innovations, LLC",
    LEGAL_ENTITY_ADDRESS: "328 County Road 110 East, Norris City, IL 62869",
    LEGAL_CONTACT_EMAIL: "legal@webbinnovations.com",
    PRIVACY_EMAIL: "legal@webbinnovations.com",
    BILLING_EMAIL: "billing@webbinnovations.com",
    DSR_EMAIL: "legal@webbinnovations.com",
    DPO_EMAIL_OR_NONE: "NONE",
    EU_REP_NAME_AND_ADDRESS_OR_NONE: "NONE",
    UK_REP_NAME_AND_ADDRESS_OR_NONE: "NONE",
    GOVERNING_LAW_STATE: "Illinois",
    GOVERNING_FORUM_COUNTY_STATE: "White County, Illinois",
    MERCHANT_OF_RECORD_NAME: "Stripe or MERCHANT_OF_RECORD_NAME",
    LICENSING_PROVIDER_NAMES: "DevoLens / Cryptolens",
    HOSTING_PROVIDER_NAMES: "Netlify",
    ANALYTICS_PROVIDER_NAMES_OR_NONE: "NONE",
    DOWNLOAD_PROVIDER_NAMES: "GitHub",
    SUPPORT_TOOL_NAMES: "Email",
    SECURITY_PRACTICES_SUMMARY: "We use safeguards appropriate to the risk, which may include encryption in transit, access controls, logging, patching, backup and recovery controls, and vendor due diligence.",
    RETENTION_SCHEDULE: {
      websiteServerLogs: "30-90 days",
      contactAndQuoteRequests: "24 months",
      supportTicketsAndAttachments: "24 months after closure unless earlier deleted or longer retention is required by law or dispute handling",
      billingTaxRecords: "7 years",
      licensingAccountRecords: "Active term plus 3-7 years for fraud prevention, audit, licensing support, and legal compliance",
      cookiePreferences: "12 months"
    },
    COOKIE_INVENTORY: [
      {
        name: "No non-essential website cookies currently configured",
        provider: "RungTrace",
        purpose: "The current static website code does not set analytics or marketing cookies.",
        category: "Informational",
        duration: "N/A"
      }
    ],
    SUBPROCESSOR_LIST: [
      {
        provider: "Netlify",
        category: "Hosting/CDN/infrastructure",
        purpose: "Website hosting, serverless form endpoint, security headers, and traffic delivery.",
        dataCategories: "Website/device/log data; business purchase request data submitted through hosted functions.",
        location: "United States and other countries where Netlify, its affiliates, and subprocessors operate"
      },
      {
        provider: "Resend",
        category: "Email delivery",
        purpose: "Business purchase request notifications and optional confirmations.",
        dataCategories: "Contact information and submitted business purchase request content.",
        location: "United States"
      },
      {
        provider: "Stripe",
        category: "Payment and invoicing",
        purpose: "Invoices, payment processing, receipts, and payment records.",
        dataCategories: "Billing, transaction, and contact information.",
        location: "Various, including United States, Ireland, and other countries listed by Stripe for applicable services"
      },
      {
        provider: "DevoLens / Cryptolens",
        category: "Licensing and activation",
        purpose: "Hosted checkout links, license issuance, activation, subscription status, and license management.",
        dataCategories: "Contact, licensing, activation, device, and transaction-related records.",
        location: "EEA regions including Ireland, Netherlands, Sweden, Finland, and Germany; limited United States support/chat or third-country access where covered by transfer mechanisms"
      },
      {
        provider: "GitHub",
        category: "Download distribution",
        purpose: "Release metadata and downloadable installer assets.",
        dataCategories: "Download request metadata and standard service logs.",
        location: "United States and other locations listed by GitHub subprocessors, including Canada, Europe, Australia, Brazil, Japan, Singapore, and other provider regions"
      }
    ],
    LAST_UPDATED_ISO: "2026-06-25",
    LAST_UPDATED_HUMAN: "June 25, 2026"
  },
  pricing: {
    engineer: {
      price: "$499",
      note: "per year",
      checkoutUrl: "https://app.cryptolens.io/Form/P/M4yZEqDv/2490"
    },
    team: {
      price: "$399",
      note: "per seat / year · 5–25 seats",
      checkoutUrl: "https://app.cryptolens.io/Form/P/uiCiejjq/2494"
    }
  }
};
