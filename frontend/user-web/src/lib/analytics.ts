const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function initGA(): void {
  if (!GA_ID) return;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  window.gtag?.("event", name, params);
}
