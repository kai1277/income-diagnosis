/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_ID?: string;
  readonly VITE_API_URL?: string;
}

interface Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer: unknown[];
}
