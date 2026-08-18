import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DiagnosisFlow from "@/features/diagnosis/routes/diagnosis-flow";
import { useAuth } from "@/features/auth/auth-context";
import { apiGet } from "@/lib/api";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const restart = searchParams.get("restart") === "1";
  const { accessToken } = useAuth();
  const [checking, setChecking] = useState(!restart && !!accessToken);

  useEffect(() => {
    if (restart || !accessToken) {
      setChecking(false);
      return;
    }

    let cancelled = false;
    apiGet("/api/beauty/diagnosis/latest", accessToken)
      .then(() => {
        if (!cancelled) navigate("/user-my-page", { replace: true });
      })
      .catch(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, restart, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    );
  }

  return <DiagnosisFlow />;
}
