import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

type Props = {
  label: string;
  jobType: string;
  variant?: "primary" | "secondary";
  position: number;
  resultCardId: string;
  occupationCodes?: string[];
};

export default function JobLink({ label, jobType, variant = "primary", position, resultCardId, occupationCodes }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    trackEvent("job_click", {
      job_id: resultCardId,
      occupation_type: occupationCodes?.[0] ?? "",
      position,
      result_type: jobType,
    });
    const query = occupationCodes?.length ? `?codes=${occupationCodes.join(",")}` : "";
    navigate(`/jobs${query}`);
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
