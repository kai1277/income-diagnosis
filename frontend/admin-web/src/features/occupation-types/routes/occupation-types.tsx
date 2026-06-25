import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { OccupationType } from "@/features/jobs/types";
import { useOccupationTypes } from "@/features/occupation-types/lib/occupation-types-store";

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

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
      {title}
    </h3>
  );
}

// ── Add Modal ─────────────────────────────────────────────────────────────────

type FormState = {
  code: string;
  label: string;
  sort_order: string;
  is_active: boolean;
};

const EMPTY: FormState = {
  code: "",
  label: "",
  sort_order: "",
  is_active: true,
};

type CreatePayload = Omit<OccupationType, "id">;

function AddOccupationTypeModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (payload: CreatePayload) => Promise<void>;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.code.trim()) next.code = "必須です";
    if (!form.label.trim()) next.label = "必須です";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onAdd({
        code: form.code.trim(),
        label: form.label.trim(),
        is_active: form.is_active,
        sort_order: form.sort_order ? parseInt(form.sort_order, 10) : null,
      });
      onClose();
    } catch {
      setSubmitError("職種カテゴリの追加に失敗しました。もう一度お試しください。");
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
      <div className="bg-gray-50 rounded-2xl w-full max-w-md flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-white rounded-t-2xl border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">職種カテゴリ追加</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-5">
          <div>
            <SectionHeader title="識別情報" />
            <div className="space-y-4">
              <div>
                <Label text="コード（内部識別子）" required />
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                  placeholder="例）manufacturing（英小文字・アンダースコアのみ）"
                  className={inputCls(!!errors.code)}
                />
                <FieldError msg={errors.code} />
              </div>

              <div>
                <Label text="表示名" required />
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                  placeholder="例）製造・現場"
                  className={inputCls(!!errors.label)}
                />
                <FieldError msg={errors.label} />
              </div>
            </div>
          </div>

          <div>
            <SectionHeader title="表示設定" />
            <div className="space-y-4">
              <div>
                <Label text="並び順" />
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((p) => ({ ...p, sort_order: e.target.value }))}
                  placeholder="数値が小さいほど上に表示"
                  min={0}
                  className={inputCls(false)}
                />
                <p className="text-xs text-gray-400 mt-1">未入力の場合は末尾に表示</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, is_active: !p.is_active }))}
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
                  {form.is_active ? "有効" : "無効"}
                </span>
              </div>
            </div>
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

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function OccupationTypesPage() {
  const navigate = useNavigate();
  const { occupationTypes, loading, error, addType, deleteType, retry } = useOccupationTypes();
  const [showModal, setShowModal] = useState(false);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">
      読み込み中...
    </div>
  );

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
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← 管理画面
          </button>
          <h1 className="text-lg font-semibold text-gray-800">職種カテゴリ一覧</h1>
          <span className="text-sm text-gray-400">{occupationTypes.length}件</span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#0288d1" }}
        >
          + 職種カテゴリ追加
        </button>
      </div>

      <div className="p-6">
        {occupationTypes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-4xl mb-4">🏷️</p>
            <p className="text-sm">職種カテゴリがありません</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: "#0288d1" }}
            >
              最初の職種カテゴリを追加する
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 font-medium border-b border-gray-100">
                  <th className="text-left px-5 py-2.5 w-40">コード</th>
                  <th className="text-left px-5 py-2.5">表示名</th>
                  <th className="text-center px-5 py-2.5 w-20">並び順</th>
                  <th className="text-center px-5 py-2.5 w-20">状態</th>
                  <th className="px-5 py-2.5 w-12" />
                </tr>
              </thead>
              <tbody>
                {occupationTypes.map((type, i) => (
                  <tr
                    key={type.id}
                    className={`border-b border-gray-50 last:border-0 ${
                      !type.is_active ? "opacity-40" : ""
                    } ${i % 2 === 1 ? "bg-gray-50/50" : ""}`}
                  >
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{type.code}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{type.label}</td>
                    <td className="px-5 py-3 text-center text-xs text-gray-400">
                      {type.sort_order ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          type.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {type.is_active ? "有効" : "無効"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`「${type.label}」を削除しますか？\n※この職種カテゴリを使用している求人がある場合は削除できません。`)) {
                            deleteType(type.id).catch(() =>
                              alert("削除に失敗しました。求人に紐づいている職種カテゴリは削除できません。")
                            );
                          }
                        }}
                        className="text-gray-300 hover:text-red-400 transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <AddOccupationTypeModal
          onClose={() => setShowModal(false)}
          onAdd={addType}
        />
      )}
    </div>
  );
}
