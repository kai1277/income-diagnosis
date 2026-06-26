import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { usePrefectures, useCities, AddCityModal } from "@/features/prefectures/lib/prefectures-store";

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

  const categories = [...new Set(codes.map((c) => c.category))];

  const addRow = () => {
    const firstCat = categories[0];
    if (!firstCat) return;
    const first = codes.find((c) => c.category === firstCat);
    if (!first) return;
    onChange([
      ...requirements,
      {
        requirement_code_id: first.id,
        level: "required",
        operator: first.allowed_operators[0],
        value: first.value_type === "boolean" ? "true" : "",
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
        <div className="mb-2 hidden sm:grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_auto] gap-2 px-1">
          {["条件カテゴリ", "条件", "レベル", "比較方法", "値", ""].map((h, i) => (
            <span key={i} className="text-xs text-gray-400 font-medium">{h}</span>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {requirements.map((req, i) => {
          const code = codes.find((c) => c.id === req.requirement_code_id);
          const selectedCategory = code?.category ?? categories[0] ?? "";
          const filteredCodes = codes.filter((c) => c.category === selectedCategory);
          const needsValue = req.operator !== "exists";

          return (
            <div key={i} className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_auto] gap-2 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  const cat = e.target.value;
                  const firstInCat = codes.find((c) => c.category === cat);
                  if (!firstInCat) return;
                  update(i, {
                    requirement_code_id: firstInCat.id,
                    operator: firstInCat.allowed_operators[0],
                    value: firstInCat.value_type === "boolean" ? "true" : "",
                  });
                }}
                className={selectCls()}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat] ?? cat}</option>
                ))}
              </select>

              <select
                value={req.requirement_code_id}
                onChange={(e) => {
                  const next = codes.find((c) => c.id === e.target.value);
                  if (!next) return;
                  update(i, {
                    requirement_code_id: e.target.value,
                    operator: next.allowed_operators[0],
                    value: next.value_type === "boolean" ? "true" : "",
                  });
                }}
                className={selectCls()}
              >
                {filteredCodes.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>

              <select
                value={req.level}
                onChange={(e) => update(i, { level: e.target.value as "required" | "preferred" })}
                className={selectCls()}
              >
                <option value="required">必須</option>
                <option value="preferred">歓迎</option>
              </select>

              <select
                value={req.operator}
                onChange={(e) => update(i, { operator: e.target.value, value: "" })}
                className={selectCls()}
              >
                {code?.allowed_operators.map((op) => (
                  <option key={op} value={op}>{OPERATOR_LABELS[op] ?? op}</option>
                ))}
              </select>

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

// ── Form state ────────────────────────────────────────────────────────────────

type FormState = {
  title: string;
  occupation_type_ids: string[];
  image_url: string;
  badge_text: string;
  salary_type: string;
  salary_range_type: string;
  salary_min: string;
  salary_max: string;
  salary_text: string;
  job_location: string;
  prefecture_id: string;
  city_id: string;
  job_types: string;
  affiliate_url: string;
  impression_pixel_url: string;
  affiliate_network: string;
  is_active: boolean;
  expires_at: string;
  requirements: JobRequirementRow[];
};

function jobToForm(job: Job): FormState {
  return {
    title: job.title,
    occupation_type_ids: job.occupation_type_ids,
    image_url: job.image_url ?? "",
    badge_text: job.badge_text ?? "",
    salary_type: job.salary_type,
    salary_range_type: job.salary_range_type,
    salary_min: job.salary_min != null ? String(job.salary_min) : "",
    salary_max: job.salary_max != null ? String(job.salary_max) : "",
    salary_text: job.salary_text,
    job_location: job.job_location ?? "",
    prefecture_id: job.prefecture_id ?? "",
    city_id: job.city_id ?? "",
    job_types: job.job_types.join("、"),
    affiliate_url: job.affiliate_url,
    impression_pixel_url: job.impression_pixel_url,
    affiliate_network: job.affiliate_network,
    is_active: job.is_active,
    expires_at: job.expires_at
      ? new Date(job.expires_at).toISOString().slice(0, 16)
      : "",
    requirements: (job.requirements ?? []).map((r) => ({
      requirement_code_id: r.requirement_code_id,
      level: r.level,
      operator: r.operator,
      value: r.value ?? "",
    })),
  };
}

// ── Job Detail Page ───────────────────────────────────────────────────────────

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, updateJob, deleteJob } = useJobs();
  const { occupationTypes } = useOccupationTypes();

  const job = jobs.find((j) => j.id === id);

  const [form, setForm] = useState<FormState | null>(() =>
    job ? jobToForm(job) : null
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { prefectures } = usePrefectures();
  const { cities, addCity } = useCities(form?.prefecture_id || null);
  const [showAddCityModal, setShowAddCityModal] = useState(false);

  if (!job || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-gray-400 text-sm">
        <p>求人が見つかりません</p>
        <button
          onClick={() => navigate("/jobs")}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#0288d1" }}
        >
          一覧に戻る
        </button>
      </div>
    );
  }

  const setText =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => prev ? { ...prev, [key]: e.target.value } : prev);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) next.title = "必須です";
    if (!form.salary_text.trim()) next.salary_text = "必須です";
    if (!form.job_types.trim()) next.job_types = "必須です";
    if (!form.affiliate_url.trim()) next.affiliate_url = "必須です";
    if (!form.impression_pixel_url.trim()) next.impression_pixel_url = "必須です";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = () => ({
    title: form.title.trim(),
    occupation_type_ids: form.occupation_type_ids,
    image_url: form.image_url.trim() || null,
    badge_text: form.badge_text.trim() || null,
    salary_type: form.salary_type,
    salary_min: form.salary_min ? parseInt(form.salary_min, 10) : null,
    salary_max: form.salary_max ? parseInt(form.salary_max, 10) : null,
    salary_range_type: form.salary_range_type,
    salary_text: form.salary_text.trim(),
    job_location: form.job_location.trim() || null,
    prefecture_id: form.prefecture_id || null,
    city_id: form.city_id || null,
    job_types: form.job_types.split(/[,、]/).map((s) => s.trim()).filter(Boolean),
    affiliate_url: form.affiliate_url.trim(),
    impression_pixel_url: form.impression_pixel_url.trim(),
    affiliate_network: form.affiliate_network,
    is_active: form.is_active,
    expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    requirements: form.requirements,
  });

  const handleSave = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    setSaved(false);
    try {
      await updateJob(id!, buildPayload());
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSubmitError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`「${job.title}」を削除しますか？`)) return;
    try {
      await deleteJob(id!);
      navigate("/jobs");
    } catch {
      alert("削除に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/jobs")} className="text-sm text-gray-500 hover:text-gray-700">
            ← 求人一覧
          </button>
          <h1 className="text-lg font-semibold text-gray-800 line-clamp-1 max-w-xs">{job.title}</h1>
          <span
            className={`text-xs px-2 py-0.5 rounded-full text-white ${
              job.is_active ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            {job.is_active ? "公開中" : "非公開"}
          </span>
        </div>
        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded-lg text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
        >
          削除
        </button>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-8">
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
                  <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                    {occupationTypes.map((t) => (
                      <label key={t.id} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.occupation_type_ids.includes(t.id)}
                          onChange={(e) =>
                            setForm((prev) => prev ? {
                              ...prev,
                              occupation_type_ids: e.target.checked
                                ? [...prev.occupation_type_ids, t.id]
                                : prev.occupation_type_ids.filter((id) => id !== t.id),
                            } : prev)
                          }
                        />
                        {t.label}
                      </label>
                    ))}
                  </div>
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
                  <Label text="都道府県" />
                  <select
                    value={form.prefecture_id}
                    onChange={(e) =>
                      setForm((prev) => prev ? { ...prev, prefecture_id: e.target.value, city_id: "" } : prev)
                    }
                    className={selectCls()}
                  >
                    <option value="">選択してください</option>
                    {prefectures.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label text="市区町村" />
                  <div className="flex items-center gap-2">
                    <select
                      value={form.city_id}
                      onChange={(e) => setForm((prev) => prev ? { ...prev, city_id: e.target.value } : prev)}
                      className={selectCls()}
                      disabled={!form.prefecture_id}
                    >
                      <option value="">選択してください</option>
                      {cities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {form.prefecture_id && (
                      <button
                        type="button"
                        onClick={() => setShowAddCityModal(true)}
                        className="shrink-0 text-sm text-blue-500 hover:text-blue-700 transition-colors whitespace-nowrap"
                      >
                        + 追加
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <Label text="勤務地テキスト（任意）" />
                  <input
                    type="text"
                    value={form.job_location}
                    onChange={setText("job_location")}
                    placeholder="例）東京都羽村市（入力時は都道府県・市区町村より優先表示）"
                    className={inputCls(false)}
                  />
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
                    onClick={() => setForm((prev) => prev ? { ...prev, is_active: !prev.is_active } : prev)}
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

                <div>
                  <Label text="作成日時" />
                  <p className="text-sm text-gray-500 py-2">
                    {new Date(job.created_at).toLocaleString("ja-JP")}
                  </p>
                </div>

                <div>
                  <Label text="更新日時" />
                  <p className="text-sm text-gray-500 py-2">
                    {new Date(job.updated_at).toLocaleString("ja-JP")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 求人条件セクション — 全幅 */}
        <div className="border-t border-gray-100 pt-6 mb-8">
          <RequirementsEditor
            requirements={form.requirements}
            onChange={(reqs) => setForm((prev) => prev ? { ...prev, requirements: reqs } : prev)}
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 py-4 border-t border-gray-200">
          {submitError && <p className="text-sm text-red-500 mr-auto">{submitError}</p>}
          {saved && <p className="text-sm text-green-600 mr-auto">保存しました</p>}
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#0288d1" }}
          >
            {submitting ? "保存中..." : "保存する"}
          </button>
        </div>
      </div>

      {showAddCityModal && (
        <AddCityModal
          onClose={() => setShowAddCityModal(false)}
          onAdd={async (name) => {
            const city = await addCity(name);
            setForm((prev) => prev ? { ...prev, city_id: city.id } : prev);
            return city;
          }}
        />
      )}
    </div>
  );
}
