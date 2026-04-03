type Props = {
  label: string;
  jobType: string;
  url: string;
  variant?: "primary" | "secondary";
};

export default function JobLink({ label, jobType, url, variant = "primary" }: Props) {
  const handleClick = () => {
    window.gtag?.("event", "job_link_click", {
      job_type: jobType,
      destination_url: url,
    });
    window.open(url, "_blank");
  };

  const base = "w-full py-4 rounded-xl font-bold text-base transition-colors";
  const style =
    variant === "primary"
      ? `${base} bg-orange-500 text-white active:bg-orange-600`
      : `${base} bg-white border-2 border-orange-500 text-orange-500 active:bg-orange-50`;

  return (
    <button onClick={handleClick} className={style}>
      {label}
    </button>
  );
}
