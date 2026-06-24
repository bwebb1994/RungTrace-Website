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
  salesEmail: "brady@webbinnovations.com",
  supportEmail: "brady@webbinnovations.com",
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
