/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_ID?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_LIFF_ID?: string;
}

interface Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer: unknown[];
}
