/* eslint-disable */
// Minimal GDPR cookie consent banner.
// Stores choice in localStorage. No third-party scripts load before consent.

(function () {
  "use strict";

  const KEY = "bjl-consent-v1";
  const stored = localStorage.getItem(KEY);
  if (stored === "accepted" || stored === "rejected") {
    if (stored === "accepted") loadAnalytics();
    return;
  }

  const banner = document.createElement("div");
  banner.className = "consent-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-live", "polite");
  banner.setAttribute("aria-label", "Cookie-Hinweis");
  banner.innerHTML = `
    <p class="consent-banner__text">
      Wir nutzen technisch notwendige Cookies. Optionale Analyse-Cookies helfen uns,
      die Seite zu verbessern. Mehr in der
      <a href="datenschutz.html">Datenschutzerklärung</a>.
    </p>
    <div class="consent-banner__btns">
      <button type="button" class="consent-banner__btn" data-consent="reject">Nur notwendige</button>
      <button type="button" class="consent-banner__btn consent-banner__btn--primary" data-consent="accept">Akzeptieren</button>
    </div>
  `;
  document.body.appendChild(banner);

  banner.addEventListener("click", (e) => {
    const choice = e.target instanceof HTMLElement && e.target.dataset.consent;
    if (!choice) return;
    localStorage.setItem(KEY, choice === "accept" ? "accepted" : "rejected");
    banner.hidden = true;
    if (choice === "accept") loadAnalytics();
  });

  function loadAnalytics() {
    // Placeholder for Plausible/Umami/Sentry — only loads with explicit consent.
    // Example:
    // const s = document.createElement("script");
    // s.defer = true;
    // s.src = "https://plausible.io/js/script.js";
    // s.dataset.domain = "bjl-studios.de";
    // document.head.appendChild(s);
  }
})();
