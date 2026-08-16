import type { ReactElement } from "react";
import type { JobId } from "@/features/diagnosis/types";

export function BrandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2v20M6 6l6 6-6 6M18 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 19l-7-7 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17l-5-5"
        stroke="#241A10"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HairIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M6 5l12 14M18 5L6 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="6" cy="5" r="2.1" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="6" cy="19" r="2.1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function NailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M9 3h6v4l1.5 2v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V9L9 7V3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 10h6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function LashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 14c3-6 15-6 18 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M6 13l-1.4 3M10 11.3L9.3 14.7M14 11.3l.7 3.4M18 13l1.4 3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EstheIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3c3 3.2 5 6.4 5 9.2A5 5 0 0 1 7 12.2C7 9.4 9 6.2 12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 21v-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export const JOB_ICONS: Record<JobId, () => ReactElement> = {
  hair: HairIcon,
  nail: NailIcon,
  lash: LashIcon,
  esthe: EstheIcon,
};
