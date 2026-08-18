import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackIcon, BrandIcon } from "@/features/diagnosis/components/icons";
import { SearchJobCard } from "@/features/jobs/components/search-job-card";
import {
  BEAUTY_OCCUPATION_OPTIONS,
  SALARY_TYPE_OPTIONS,
  searchBeautyJobs,
  type BeautyJob,
  type BeautyOccupationCode,
} from "@/features/jobs/lib/beauty-jobs";
import { fetchPrefectures, type Prefecture } from "@/features/jobs/lib/prefectures";
import { addKeptJobId, readKeptJobIds } from "@/features/jobs/lib/kept-jobs";

const ALL_CODES = BEAUTY_OCCUPATION_OPTIONS.map((o) => o.code);

type Status = "loading" | "ready" | "error";

export default function JobSearch() {
  const navigate = useNavigate();

  const [occupationCodes, setOccupationCodes] = useState<BeautyOccupationCode[]>(ALL_CODES);
  const [prefectureId, setPrefectureId] = useState("");
  const [salaryType, setSalaryType] = useState("");
  const [keyword, setKeyword] = useState("");

  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [jobs, setJobs] = useState<BeautyJob[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>(() => readKeptJobIds());

  useEffect(() => {
    fetchPrefectures()
      .then(setPrefectures)
      .catch(() => {});
  }, []);

  const runSearch = () => {
    setStatus("loading");
    searchBeautyJobs({
      occupationCodes,
      prefectureId: prefectureId || undefined,
      salaryType: salaryType || undefined,
      keyword: keyword.trim() || undefined,
    })
      .then((data) => {
        setJobs(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleOccupation = (code: BeautyOccupationCode) => {
    setOccupationCodes((prev) => {
      if (prev.includes(code)) {
        if (prev.length === 1) return prev; // 最低1つは選択状態にする
        return prev.filter((c) => c !== code);
      }
      return [...prev, code];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  const handleSave = (job: BeautyJob) => {
    setSavedIds(addKeptJobId(job.id));
  };

  return (
    <div className="screen">
      <div className="topbar">
        <div className="backbtn" onClick={() => navigate(-1)}>
          <BackIcon />
        </div>
        <div className="brand">
          <BrandIcon />
          キレキャリ
        </div>
        <div style={{ width: 34 }}></div>
      </div>

      <div className="jobs-shell">
        <div className="jobs-eyebrow">JOB SEARCH</div>
        <div className="jobs-title">求人を検索する</div>

        <form className="filter-panel" onSubmit={handleSubmit}>
          <div className="filter-group">
            <p className="filter-label">職種</p>
            <div className="chip-group">
              {BEAUTY_OCCUPATION_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.code}
                  className={`chip ${occupationCodes.includes(opt.code) ? "selected" : ""}`}
                  onClick={() => toggleOccupation(opt.code)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <p className="filter-label">勤務エリア</p>
            <select
              className="select-input"
              value={prefectureId}
              onChange={(e) => setPrefectureId(e.target.value)}
            >
              <option value="">指定なし</option>
              {prefectures.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <p className="filter-label">給与形態</p>
            <select
              className="select-input"
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
            >
              <option value="">指定なし</option>
              {SALARY_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <p className="filter-label">キーワード</p>
            <input
              type="text"
              className="text-input"
              placeholder="駅チカ、未経験OK など"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary">
            この条件で検索する
          </button>
        </form>

        {status === "loading" && (
          <div className="jobs-empty">
            <p>求人を読み込んでいます…</p>
          </div>
        )}

        {status === "error" && (
          <div className="jobs-empty">
            <p>求人情報の取得に失敗しました。</p>
            <button className="btn-primary" onClick={runSearch}>
              もう一度試す
            </button>
          </div>
        )}

        {status === "ready" && jobs.length === 0 && (
          <div className="jobs-empty">
            <p>条件に合う求人が見つかりませんでした。</p>
          </div>
        )}

        {status === "ready" && jobs.length > 0 && (
          <>
            <p className="search-results-count">{jobs.length}件の求人が見つかりました</p>
            <div className="saved-jobs-list">
              {jobs.map((job) => (
                <SearchJobCard
                  key={job.id}
                  job={job}
                  isSaved={savedIds.includes(job.id)}
                  onSave={() => handleSave(job)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
