import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CharacterResult } from '@/features/diagnosis/types';
import type { SkillItem } from '@/features/user-my-page/types';
import { buildSkillItems } from '@/features/user-my-page/utils/build-skill-items';
import { useAuth } from '@/features/auth/auth-context';
import { apiGet } from '@/lib/api';

interface UserProfile {
  id: string;
  display_name: string | null;
  picture_url: string | null;
}

const RESULT_KEY = 'income_diagnosis_result';
const ANSWERS_KEY = 'income_diagnosis_answers';
const KEPT_JOBS_KEY = 'income_kept_jobs';

export default function UserHome() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [result, setResult] = useState<CharacterResult | null>(null);
  const [skillItems, setSkillItems] = useState<SkillItem[]>([]);
  const [keptCount, setKeptCount] = useState(0);

  useEffect(() => {
    if (!accessToken) return;
    apiGet<UserProfile>('/api/users/me', accessToken)
      .then(setProfile)
      .catch(() => {});
  }, [accessToken]);

  useEffect(() => {
    const storedResult = localStorage.getItem(RESULT_KEY);
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult));
      } catch {}
    }

    const storedAnswers = localStorage.getItem(ANSWERS_KEY);
    if (storedAnswers) {
      try {
        setSkillItems(buildSkillItems(JSON.parse(storedAnswers)));
      } catch {}
    }

    const storedKept = localStorage.getItem(KEPT_JOBS_KEY);
    if (storedKept) {
      try {
        setKeptCount(JSON.parse(storedKept).length);
      } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: '#f0f2f5' }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-5">
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">My Page</p>
      </div>

      <div className="px-5 space-y-4">
        {/* User profile */}
        {profile && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
            {profile.picture_url ? (
              <img
                src={profile.picture_url}
                alt="プロフィール"
                className="w-14 h-14 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl shrink-0">
                👤
              </div>
            )}
            <div>
              <p className="text-base font-bold text-gray-800">
                {profile.display_name ?? 'ゲスト'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">LINEアカウント連携済み</p>
            </div>
          </div>
        )}

        {/* Diagnosis result */}
        {result && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <p className="text-xs text-gray-400 font-semibold">診断結果</p>

            <div className="flex items-center gap-3">
              <span className="text-4xl select-none">{result.emoji}</span>
              <div>
                <p className="text-xs text-gray-400">{result.growthType}</p>
                <p className="text-base font-bold text-gray-800">{result.name}</p>
              </div>
            </div>

            <div className="rounded-xl px-4 py-3" style={{ backgroundColor: '#f0fbfc' }}>
              <p className="text-xs text-gray-400 mb-1">潜在年収（推定）</p>
              <p className="text-3xl font-black text-gray-800">
                {result.potentialIncome}
                <span className="text-lg font-bold ml-1 text-gray-600">万円</span>
              </p>
              <p className="text-orange-500 text-sm font-semibold mt-1">
                現在より +{result.incomeGap}万円の可能性
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-semibold mb-2">適職</p>
              <div className="space-y-2">
                {result.suggestedJobs.map((job, i) => (
                  <div
                    key={job.title}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5 border border-gray-100"
                  >
                    <span
                      className="font-black text-sm leading-none mt-0.5 shrink-0"
                      style={{ color: '#4dd0e1' }}
                    >
                      0{i + 1}
                    </span>
                    <div>
                      <p className="text-gray-800 font-bold text-sm">{job.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{job.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skills & Experience */}
        {skillItems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-gray-400 font-semibold mb-3">資格・経験</p>
            <div className="divide-y divide-gray-50">
              {skillItems.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0"
                >
                  <span className="text-xs text-gray-400">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved jobs */}
        <button
          onClick={() => navigate('/saved-jobs')}
          className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between active:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: '#e0f7fa' }}
            >
              💼
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">保存した求人</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {keptCount > 0 ? `${keptCount}件キープ中` : 'まだ保存した求人はありません'}
              </p>
            </div>
          </div>
          <span className="text-gray-300 text-xl font-light">›</span>
        </button>

        {/* Saved agents */}
        <button
          onClick={() => navigate('/saved-agents')}
          className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between active:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: '#fce4ec' }}
            >
              🤝
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">保存した転職エージェント</p>
              <p className="text-xs text-gray-400 mt-0.5">気になるエージェントを比較する</p>
            </div>
          </div>
          <span className="text-gray-300 text-xl font-light">›</span>
        </button>

        {/* Re-diagnose */}
        <button
          onClick={() => navigate('/quiz')}
          className="w-full py-3 rounded-2xl border border-gray-200 bg-white text-gray-500 text-sm font-medium shadow-sm active:bg-gray-50 transition-colors"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  );
}
