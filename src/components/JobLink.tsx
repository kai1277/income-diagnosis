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
        className="w-full py-4 text-white font-bold text-base rounded-xl shadow-md active:scale-95 transition-transform"
        style={{ backgroundColor: "#4dd0e1" }}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-full py-4 bg-white font-medium text-base rounded-xl border active:scale-95 transition-transform"
      style={{ color: "#4dd0e1", borderColor: "#4dd0e1" }}
    >
      {label}
    </button>
  );
}
