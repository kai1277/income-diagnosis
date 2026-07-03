const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function initGA(): void {
  if (!GA_ID) return;

  window.dataLayer = window.dataLayer || [];
  // gtag.js は dataLayer に IArguments が積まれていることを前提に動作する。
  // rest params (...args) で配列を push すると GA4 がコマンドと認識しないため、
  // arguments を使う必要がある。
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments as unknown);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  window.gtag?.("event", name, params);
}
