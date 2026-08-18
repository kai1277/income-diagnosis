import type { BeautyJob } from "@/features/jobs/lib/beauty-jobs";
import { trackEvent } from "@/lib/analytics";

type Props = {
  job: BeautyJob;
  isSaved: boolean;
  onSave: () => void;
};

function trackAffiliateClick(clickType: "image" | "detail_button", job: BeautyJob) {
  trackEvent("affiliate_click", {
    job_id: job.id,
    result_type: job.jobTypes[0] ?? "",
    click_type: clickType,
  });
}

export function SearchJobCard({ job, isSaved, onSave }: Props) {
  return (
    <div className="match-card saved-job-card">
      <div className="match-media">
        {job.imageUrl ? (
          <a
            href={job.affiliateUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={() => trackAffiliateClick("image", job)}
          >
            <img src={job.imageUrl} alt={job.title} />
          </a>
        ) : (
          <div className="match-media-fallback">キレキャリ</div>
        )}
        {job.imageBadge && <span className="match-badge">{job.imageBadge}</span>}
      </div>

      <div className="match-body">
        <p className="match-title">{job.title}</p>
        <p className="match-income">{job.incomeRange}</p>

        <div className="match-meta">
          {job.location && (
            <div className="match-meta-row">
              <span>エリア</span>
              <span>{job.location}</span>
            </div>
          )}
          {job.jobTypes.length > 0 && (
            <div className="match-meta-row">
              <span>特徴</span>
              <span>{job.jobTypes.join("、")}</span>
            </div>
          )}
        </div>

        <a
          href={job.affiliateUrl}
          target="_blank"
          rel="nofollow noopener noreferrer"
          onClick={() => trackAffiliateClick("detail_button", job)}
          className="match-detail-link"
        >
          詳細を見る →
        </a>

        <div className="match-actions">
          <button
            type="button"
            onClick={onSave}
            disabled={isSaved}
            className="match-btn keep search-save-btn"
          >
            {isSaved ? "保存済み ★" : "保存する"}
          </button>
        </div>
      </div>

      {job.impressionPixelUrl && (
        <img src={job.impressionPixelUrl} width={1} height={1} alt="" className="match-pixel" />
      )}
    </div>
  );
}
