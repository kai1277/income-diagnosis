import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminJobCard from "@/features/jobs/components/admin-job-card";
import { useJobs } from "@/features/jobs/lib/jobs-store";
import type { Job, JobRequirementRow } from "@/features/jobs/types";
import {
  SALARY_TYPES,
  SALARY_RANGE_TYPES,
  AFFILIATE_NETWORKS,
} from "@/features/jobs/types";
import { useOccupationTypes } from "@/features/occupation-types/lib/occupation-types-store";
import { useRequirementCodes } from "@/features/requirement-codes/lib/requirement-codes-store";
import {
  CATEGORY_LABELS,
  OPERATOR_LABELS,
} from "@/features/requirement-codes/lib/requirement-codes-constants";
import { AddReqCodeModal } from "@/features/requirement-codes/routes/requirement-codes";

// ── Form state ────────────────────────────────────────────────────────────────

type FormState = {
  title: string;
  occupation_type_id: string;
  image_url: string;
  badge_text: string;
  salary_type: string;
  salary_range_type: string;
  salary_min: string;
  salary_max: string;
  salary_text: string;
  job_location: string;
  job_types: string;
  affiliate_url: string;
  impression_pixel_url: string;
  affiliate_network: string;
  is_active: boolean;
  expires_at: string;
  requirements: JobRequirementRow[];
};

const EMPTY: FormState = {
  title: "",
  occupation_type_id: "",
  image_url: "",
  badge_text: "",
  salary_type: SALARY_TYPES[0],
  salary_range_type: SALARY_RANGE_TYPES[0],
  salary_min: "",
  salary_max: "",
  salary_text: "",
  job_location: "",
  job_types: "",
  affiliate_url: "",
  impression_pixel_url: "",
  affiliate_network: AFFILIATE_NETWORKS[0],
  is_active: true,
  expires_at: "",
  requirements: [],
};

// ── Shared UI helpers ─────────────────────────────────────────────────────────

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
      {text}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

function inputCls(hasError: boolean) {
  return `w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors bg-white ${
    hasError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-blue-400"
  }`;
}

function selectCls() {
  return "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white";
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
      {title}
    </h3>
  );
}

// ── Requirements Editor ───────────────────────────────────────────────────────

function RequirementsEditor({
  requirements,
  onChange,
}: {
  requirements: JobRequirementRow[];
  onChange: (reqs: JobRequirementRow[]) => void;
}) {
  const { codes, addCode } = useRequirementCodes();
  const [showCodeModal, setShowCodeModal] = useState(false);

  const grouped = codes.reduce<Record<string, typeof codes>>((acc, code) => {
    (acc[code.category] ??= []).push(code);
    return acc;
  }, {});

  const addRow = () => {
    const first = codes[0];
    if (!first) return;
    onChange([
      ...requirements,
      {
        requirement_code_id: first.id,
        level: "required",
        operator: first.allowed_operators[0],
        value: "",
      },
    ]);
  };

  const update = (index: number, patch: Partial<JobRequirementRow>) => {
    onChange(requirements.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const remove = (index: number) => {
    onChange(requirements.filter((_, i) => i !== index));
  };

  return (
    <div>
      <SectionHeader title="求人条件（ターゲット設定）" />

      {requirements.length > 0 && (
        <div className="mb-2 hidden sm:grid grid-cols-[2fr_1fr_1fr_1.5fr_auto] gap-2 px-1">
          {["条件", "レベル", "比較方法", "値", ""].map((h, i) => (
            <span key={i} className="text-xs text-gray-400 font-medium">{h}</span>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {requirements.map((req, i) => {
          const code = codes.find((c) => c.id === req.requirement_code_id);
          const needsValue = req.operator !== "exists";

          return (
            <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1.5fr_auto] gap-2 items-center">
              {/* 条件コード */}
              <select
                value={req.requirement_code_id}
                onChange={(e) => {
                  const next = codes.find((c) => c.id === e.target.value);
                  if (!next) return;
                  update(i, {
                    requirement_code_id: e.target.value,
                    operator: next.allowed_operators[0],
                    value: "",
                  });
                }}
                className={selectCls()}
              >
                {Object.entries(grouped).map(([cat, items]) => (
                  <optgroup key={cat} label={CATEGORY_LABELS[cat] ?? cat}>
                    {items.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {/* レベル */}
              <select
                value={req.level}
                onChange={(e) => update(i, { level: e.target.value as "required" | "preferred" })}
                className={selectCls()}
              >
                <option value="required">必須</option>
                <option value="preferred">歓迎</option>
              </select>

              {/* 比較方法 */}
              <select
                value={req.operator}
                onChange={(e) => update(i, { operator: e.target.value, value: "" })}
                className={selectCls()}
              >
                {code?.allowed_operators.map((op) => (
                  <option key={op} value={op}>{OPERATOR_LABELS[op] ?? op}</option>
                ))}
              </select>

              {/* 値 */}
              {needsValue && code ? (
                code.value_type === "number" ? (
                  <input
                    type="number"
                    value={req.value}
                    onChange={(e) => update(i, { value: e.target.value })}
                    placeholder="数値"
                    className={inputCls(false)}
                  />
                ) : code.value_type === "boolean" ? (
                  <select
                    value={req.value || "true"}
                    onChange={(e) => update(i, { value: e.target.value })}
                    className={selectCls()}
                  >
                    <option value="true">あり</option>
                    <option value="false">なし</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={req.value}
                    onChange={(e) => update(i, { value: e.target.value })}
                    placeholder={code.value_type === "text_array" ? "カンマ区切り" : "値を入力"}
                    className={inputCls(false)}
                  />
                )
              ) : (
                <div />
              )}

              {/* 削除 */}
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          onClick={addRow}
          className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
        >
          + 条件を追加
        </button>
        <button
          type="button"
          onClick={() => setShowCodeModal(true)}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          + 条件コードを作成
        </button>
      </div>

      {showCodeModal && (
        <AddReqCodeModal
          onClose={() => setShowCodeModal(false)}
          onAdd={addCode}
          overlayClassName="z-[60]"
        />
      )}
    </div>
  );
}

// ── Add Job Modal ─────────────────────────────────────────────────────────────

function AddJobModal({ onClose, onAdd }: { onClose: () => void; onAdd: (job: Omit<Job, "id" | "created_at" | "updated_at">) => Promise<void> }) {
  const { occupationTypes } = useOccupationTypes();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const setText =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) next.title = "必須です";
    if (!form.salary_text.trim()) next.salary_text = "必須です";
    if (!form.job_location.trim()) next.job_location = "必須です";
    if (!form.job_types.trim()) next.job_types = "必須です";
    if (!form.affiliate_url.trim()) next.affiliate_url = "必須です";
    if (!form.impression_pixel_url.trim()) next.impression_pixel_url = "必須です";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildJob = (): Omit<Job, "id" | "created_at" | "updated_at"> => ({
    title: form.title.trim(),
    occupation_type_id: form.occupation_type_id,
    image_url: form.image_url.trim() || null,
    badge_text: form.badge_text.trim() || null,
    salary_type: form.salary_type,
    salary_min: form.salary_min ? parseInt(form.salary_min, 10) : null,
    salary_max: form.salary_max ? parseInt(form.salary_max, 10) : null,
    salary_range_type: form.salary_range_type,
    salary_text: form.salary_text.trim(),
    job_location: form.job_location.trim(),
    job_types: form.job_types.split(/[,、]/).map((s) => s.trim()).filter(Boolean),
    affiliate_url: form.affiliate_url.trim(),
    impression_pixel_url: form.impression_pixel_url.trim(),
    affiliate_network: form.affiliate_network,
    is_active: form.is_active,
    expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    requirements: form.requirements,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onAdd(buildJob());
      onClose();
    } catch {
      setSubmitError("求人の追加に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-50 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-white rounded-t-2xl border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">求人追加</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 px-8 py-6">
          <div className="grid grid-cols-2 gap-x-8 mb-6">

            {/* ── 左カラム ─────────────────────────── */}
            <div className="space-y-6">
              <div>
                <SectionHeader title="基本情報" />
                <div className="space-y-4">
                  <div>
                    <Label text="求人タイトル" required />
                    <textarea
                      value={form.title}
                      onChange={setText("title")}
                      rows={3}
                      placeholder="例）【高収入】未経験OK！月収36万円以上"
                      className={inputCls(!!errors.title)}
                    />
                    <FieldError msg={errors.title} />
                  </div>

                  <div>
                    <Label text="職種カテゴリ" required />
                    <select value={form.occupation_type_id} onChange={setText("occupation_type_id")} className={selectCls()}>
                      <option value="">選択してください</option>
                      {occupationTypes.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <Label text="求人タイプ（カンマ区切り）" required />
                    <input
                      type="text"
                      value={form.job_types}
                      onChange={setText("job_types")}
                      placeholder="例）検査、組立、ライン作業"
                      className={inputCls(!!errors.job_types)}
                    />
                    <FieldError msg={errors.job_types} />
                  </div>

                  <div>
                    <Label text="勤務地" required />
                    <input
                      type="text"
                      value={form.job_location}
                      onChange={setText("job_location")}
                      placeholder="例）東京都羽村市"
                      className={inputCls(!!errors.job_location)}
                    />
                    <FieldError msg={errors.job_location} />
                  </div>
                </div>
              </div>

              <div>
                <SectionHeader title="給与" />
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label text="給与タイプ" required />
                      <select value={form.salary_type} onChange={setText("salary_type")} className={selectCls()}>
                        {SALARY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label text="レンジタイプ" required />
                      <select value={form.salary_range_type} onChange={setText("salary_range_type")} className={selectCls()}>
                        {SALARY_RANGE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label text="最低金額（円）" />
                      <input
                        type="number"
                        value={form.salary_min}
                        onChange={setText("salary_min")}
                        placeholder="例）255000"
                        min={0}
                        className={inputCls(false)}
                      />
                    </div>
                    <div>
                      <Label text="最高金額（円）" />
                      <input
                        type="number"
                        value={form.salary_max}
                        onChange={setText("salary_max")}
                        placeholder="例）400000"
                        min={0}
                        disabled={form.salary_range_type === "固定"}
                        className={inputCls(false)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label text="給与表示テキスト" required />
                    <input
                      type="text"
                      value={form.salary_text}
                      onChange={setText("salary_text")}
                      placeholder="例）【月給】255,000円〜"
                      className={inputCls(!!errors.salary_text)}
                    />
                    <FieldError msg={errors.salary_text} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── 右カラム ─────────────────────────── */}
            <div className="space-y-6">
              <div>
                <SectionHeader title="画像・バッジ" />
                <div className="space-y-4">
                  <div>
                    <Label text="画像URL" />
                    <input
                      type="url"
                      value={form.image_url}
                      onChange={setText("image_url")}
                      placeholder="https://example.com/image.webp"
                      className={inputCls(false)}
                    />
                  </div>

                  {form.image_url && (
                    <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100 h-36">
                      <img
                        src={form.image_url}
                        alt="プレビュー"
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                  )}

                  <div>
                    <Label text="バッジテキスト" />
                    <input
                      type="text"
                      value={form.badge_text}
                      onChange={setText("badge_text")}
                      placeholder="例）7月入社募集中"
                      className={inputCls(false)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <SectionHeader title="アフィリエイト" />
                <div className="space-y-4">
                  <div>
                    <Label text="アフィリエイトネットワーク" required />
                    <select value={form.affiliate_network} onChange={setText("affiliate_network")} className={selectCls()}>
                      {AFFILIATE_NETWORKS.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>

                  <div>
                    <Label text="アフィリエイトURL" required />
                    <input
                      type="url"
                      value={form.affiliate_url}
                      onChange={setText("affiliate_url")}
                      placeholder="https://px.a8.net/..."
                      className={inputCls(!!errors.affiliate_url)}
                    />
                    <FieldError msg={errors.affiliate_url} />
                  </div>

                  <div>
                    <Label text="インプレッションピクセルURL" required />
                    <input
                      type="url"
                      value={form.impression_pixel_url}
                      onChange={setText("impression_pixel_url")}
                      placeholder="https://www13.a8.net/0.gif?..."
                      className={inputCls(!!errors.impression_pixel_url)}
                    />
                    <FieldError msg={errors.impression_pixel_url} />
                  </div>
                </div>
              </div>

              <div>
                <SectionHeader title="掲載設定" />
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        form.is_active ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          form.is_active ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-gray-700">
                      {form.is_active ? "公開中" : "非公開"}
                    </span>
                  </div>

                  <div>
                    <Label text="掲載終了日時" />
                    <input
                      type="datetime-local"
                      value={form.expires_at}
                      onChange={setText("expires_at")}
                      className={inputCls(false)}
                    />
                    <p className="text-xs text-gray-400 mt-1">未入力の場合は無期限</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 求人条件セクション — 全幅 */}
          <div className="border-t border-gray-100 pt-6">
            <RequirementsEditor
              requirements={form.requirements}
              onChange={(reqs) => setForm((prev) => ({ ...prev, requirements: reqs }))}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 bg-white rounded-b-2xl border-t border-gray-200">
          {submitError && <p className="text-sm text-red-500 mr-auto">{submitError}</p>}
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#0288d1" }}
          >
            {submitting ? "追加中..." : "追加する"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Admin Jobs page ───────────────────────────────────────────────────────────

export default function AdminJobs() {
  const navigate = useNavigate();
  const { jobs, loading, error, addJob, deleteJob, retry } = useJobs();
  const [showModal, setShowModal] = useState(false);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">読み込み中...</div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-red-400 text-sm">
      <p>{error}</p>
      <button
        onClick={retry}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white"
        style={{ backgroundColor: "#0288d1" }}
      >
        再試行
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-sm text-gray-500 hover:text-gray-700">
            ← 管理画面
          </button>
          <h1 className="text-lg font-semibold text-gray-800">求人一覧</h1>
          <span className="text-sm text-gray-400">{jobs.length}件</span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#0288d1" }}
        >
          + 求人追加
        </button>
      </div>

      <div className="p-6">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-sm">求人がありません</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: "#0288d1" }}
            >
              最初の求人を追加する
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {jobs.map((job) => (
              <AdminJobCard key={job.id} job={job} onDelete={deleteJob} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddJobModal onClose={() => setShowModal(false)} onAdd={addJob} />
      )}
    </div>
  );
}
