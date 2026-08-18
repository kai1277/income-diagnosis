import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackIcon, BrandIcon } from "@/features/diagnosis/components/icons";
import { JOBS } from "@/features/diagnosis/constants/jobs";
import { buildTags, buildTagsFromRawAnswers } from "@/features/diagnosis/utils/build-tags";
import type { Answers, Estimate, JobId } from "@/features/diagnosis/types";
import { useAuth } from "@/features/auth/auth-context";
import { apiGet } from "@/lib/api";

interface BeautyUserProfile {
  id: string;
  display_name: string | null;
  picture_url: string | null;
}

interface StoredResult {
  jobId: JobId;
  estimate: Estimate;
}

interface BeautyDiagnosisResultRecord {
  answers: Record<string, unknown> & { jobId: JobId };
  result_snapshot: Estimate;
}

const RESULT_KEY = "beauty_diagnosis_result";
const ANSWERS_KEY = "beauty_diagnosis_answers";
const KEPT_JOBS_KEY = "beauty_kept_jobs";

export default function UserMyPage() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<BeautyUserProfile | null>(null);
  const [stored, setStored] = useState<StoredResult | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [keptCount, setKeptCount] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    apiGet<BeautyUserProfile>("/api/beauty/users/me", accessToken)
      .then(setProfile)
      .catch(() => {});
  }, [accessToken]);

  // ログイン中は保存済みの診断結果をサーバーから取得する（他端末からでも同じ結果が見られる）。
  // localStorage側の結果は先に読み込んでおき、API取得が成功したら上書きする。
  useEffect(() => {
    if (!accessToken) return;
    apiGet<BeautyDiagnosisResultRecord>("/api/beauty/diagnosis/latest", accessToken)
      .then((result) => {
        const job = JOBS[result.answers.jobId];
        setStored({ jobId: result.answers.jobId, estimate: result.result_snapshot });
        setTags(buildTagsFromRawAnswers(job, result.answers));
      })
      .catch(() => {});
  }, [accessToken]);

  useEffect(() => {
    const storedResult = localStorage.getItem(RESULT_KEY);
    const storedAnswers = localStorage.getItem(ANSWERS_KEY);
    if (storedResult) {
      try {
        const parsed: StoredResult = JSON.parse(storedResult);
        setStored((prev) => prev ?? parsed);
        if (storedAnswers) {
          const parsedAnswers: Answers = JSON.parse(storedAnswers);
          setTags((prev) => (prev.length > 0 ? prev : buildTags(JOBS[parsed.jobId], parsedAnswers)));
        }
      } catch {}
    }

    const storedKept = localStorage.getItem(KEPT_JOBS_KEY);
    if (storedKept) {
      try {
        setKeptCount(JSON.parse(storedKept).length);
      } catch {}
    }
  }, []);

  const job = stored ? JOBS[stored.jobId] : null;

  return (
    <div className="screen">
      <div className="topbar">
        <div className="backbtn" onClick={() => navigate("/")}>
          <BackIcon />
        </div>
        <div className="brand">
          <BrandIcon />
          キレキャリ
        </div>
        <div style={{ width: 34 }}></div>
      </div>

      <div className="mypage-shell">
        <div className="mypage-eyebrow">MY PAGE</div>
        <div className="mypage-title">マイページ</div>

        {profile && (
          <div className="profile-card">
            {profile.picture_url ? (
              <img src={profile.picture_url} alt="プロフィール" className="profile-avatar" />
            ) : (
              <div className="profile-avatar-fallback">👤</div>
            )}
            <div>
              <p className="profile-name">{profile.display_name ?? "ゲスト"}</p>
              <p className="profile-sub">LINEアカウント連携済み</p>
            </div>
          </div>
        )}

        {job && stored ? (
          <div className="mypage-card">
            <p className="mypage-card-label">診断結果 / {job.label}</p>
            <div className="mypage-income">
              <span className="amt">{stored.estimate.center}</span>
              <span className="unit">万円</span>
            </div>
            <p className="mypage-range">
              レンジ　{stored.estimate.low}万円 〜 {stored.estimate.high}万円
            </p>
            {tags.length > 0 && (
              <div className="mypage-tags">
                {tags.map((t, i) => (
                  <span className="tag" key={`${t}-${i}`}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mypage-card">
            <p className="mypage-card-label">診断結果</p>
            <p className="mypage-empty">まだ診断結果がありません。診断を受けると、ここに想定年収が表示されます。</p>
          </div>
        )}

        <button
          type="button"
          className="mypage-link-card"
          onClick={() => stored && navigate(`/jobs?jobId=${stored.jobId}`)}
          disabled={!stored}
        >
          <div className="mypage-link-left">
            <div className="mypage-link-icon">💼</div>
            <div>
              <p className="mypage-link-title">気になる求人</p>
              <p className="mypage-link-sub">
                {keptCount > 0 ? `${keptCount}件キープ中` : "まだ気になる求人はありません"}
              </p>
            </div>
          </div>
          <span className="mypage-link-chevron">›</span>
        </button>

        <button className="btn-ghost" onClick={() => navigate("/")}>
          もう一度診断する
        </button>
      </div>
    </div>
  );
}
