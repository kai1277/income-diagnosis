import { JOB_ICONS } from "@/features/diagnosis/components/icons";
import { JOBS, JOB_ORDER } from "@/features/diagnosis/constants/jobs";
import type { JobId } from "@/features/diagnosis/types";
import { SiteFooter } from "@/components/site-footer";

interface Props {
  onSelect: (jobId: JobId) => void;
}

export function JobSelectPanel({ onSelect }: Props) {
  return (
    <>
      <div className="eyebrow">HAIR & BEAUTY CAREER CHECK</div>
      <h1>
        その頑張り、
        <br />
        <span>今の給与</span>に見合っていますか？
      </h1>
      <p>職種を選んで、6つの質問に答えるだけ。役職・売上・エリアなどを踏まえた本格的な「想定年収」を診断します。</p>
      <div className="facts">
        <div className="fact">
          <b>60秒</b>
          <span>で診断完了</span>
        </div>
        <div className="fact">
          <b>4職種</b>
          <span>から選択</span>
        </div>
        <div className="fact">
          <b>無料</b>
          <span>で年収診断</span>
        </div>
      </div>
      <div className="job-label-row">職種を選んでください</div>
      <div className="job-grid">
        {JOB_ORDER.map((id) => {
          const job = JOBS[id];
          const Icon = JOB_ICONS[id];
          return (
            <div key={id} className="job-card" onClick={() => onSelect(id)}>
              <div className="job-icon">
                <Icon />
              </div>
              <div className="job-label">{job.label}</div>
              <div className="job-desc">{job.tagline}</div>
            </div>
          );
        })}
      </div>
      <div className="spacer"></div>
      <SiteFooter />
    </>
  );
}
