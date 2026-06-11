const GTM_ID = "GTM-NFP8QPK";

// Google Consent Mode defaults must be set before GTM loads; Axeptio
// (whose settings carry the matching googleConsentMode config) updates
// these signals when the visitor makes a choice.
const CONSENT_DEFAULTS = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});`;

const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

/** Head scripts: consent-mode defaults, then the GTM loader. */
export function GoogleTagManager() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS }} />
      <script dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />
    </>
  );
}

/** Standard GTM fallback for visitors without JavaScript (start of <body>). */
export function GoogleTagManagerNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
