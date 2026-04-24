import { getTracking } from "@/lib/tracking";

type Props = {
  label: string;
  jobType: string;
  url: string;
  variant?: "primary" | "secondary";
  position: number;
  resultCardId: string;
};

export default function JobLink({ label, jobType, url, variant = "primary", position, resultCardId }: Props) {
  const handleClick = () => {
    window.gtag?.("event", "job_link_click", {
      job_type: jobType,
      destination_url: url,
      position,
      result_card_id: resultCardId,
      ...getTracking(),
    });
    window.open(url, "_blank");
  };

  if (variant === "primary") {
    return (
      <button
        onClick={handleClick}
        className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-base rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-full py-4 bg-white/5 border border-white/15 text-white/80 font-medium text-base rounded-xl active:scale-95 transition-transform"
    >
      {label}
    </button>
  );
}
