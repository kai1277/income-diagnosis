import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import liff from "@line/liff";
import "./index.css";
import App from "./App";

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const LIFF_ID = import.meta.env.VITE_LIFF_ID as string;

if (GA_ID) {
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  gtag("js", new Date());
  gtag("config", GA_ID);
  window.gtag = gtag;
}

async function initApp() {
  if (LIFF_ID) {
    await liff.init({ liffId: LIFF_ID });
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

initApp().catch(console.error);
