import { useNavigate } from 'react-router-dom';
import type { Job } from '@/features/jobs/types';

type Props = {
  job: Job;
  onDelete: (id: string) => Promise<void>;
};

export default function AdminJobCard({ job, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col cursor-pointer hover:shadow-md hover:border-gray-200 transition-all"
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      {/* Image */}
      <div className="relative">
        {job.image_url ? (
          <img
            src={job.image_url}
            alt={job.title}
            className="w-full h-40 object-contain bg-gray-100"
          />
        ) : (
          <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
            画像なし
          </div>
        )}
        {job.badge_text && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {job.badge_text}
          </span>
        )}
        <span
          className={`absolute top-3 right-3 text-white text-xs px-2 py-1 rounded-full ${
            job.is_active ? 'bg-green-500' : 'bg-gray-400'
          }`}
        >
          {job.is_active ? '公開中' : '非公開'}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2 flex-1 flex flex-col">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">
          {job.occupation_types?.map((t) => t.label).join('、') || '—'}
        </span>

        <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">{job.title}</p>

        <p className="text-lg font-black" style={{ color: '#0288d1' }}>
          {job.salary_text}
        </p>

        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>
              {job.job_location
                ? job.job_location
                : [job.prefecture?.name, job.city?.name].filter(Boolean).join('') || '—'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔧</span>
            <span>{job.job_types.join('、')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔗</span>
            <span className="text-gray-400">{job.affiliate_network}</span>
          </div>
          {job.expires_at && (
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>掲載終了: {new Date(job.expires_at).toLocaleDateString('ja-JP')}</span>
            </div>
          )}
        </div>

        <div className="flex-1" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`「${job.title}」を削除しますか？`)) {
              onDelete(job.id).catch(() => alert('削除に失敗しました。もう一度お試しください。'));
            }
          }}
          className="w-full py-2 rounded-lg text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
        >
          削除
        </button>
      </div>
    </div>
  );
}
