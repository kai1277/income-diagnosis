import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RequirementCode } from '@/features/jobs/types';
import { useRequirementCodes } from '@/features/requirement-codes/lib/requirement-codes-store';
import {
  CATEGORY_LABELS,
  OPERATOR_LABELS,
} from '@/features/requirement-codes/lib/requirement-codes-constants';

// ── Constants ─────────────────────────────────────────────────────────────────

const ALL_OPERATORS = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'in',
  'not_in',
  'contains',
  'exists',
] as const;

const VALUE_TYPES = ['number', 'boolean', 'text', 'text_array'] as const;
const VALUE_TYPE_LABELS: Record<string, string> = {
  number: '数値',
  boolean: '真偽値',
  text: 'テキスト',
  text_array: 'テキスト配列',
};

const KNOWN_CATEGORIES = [
  'age',
  'gender',
  'residence_location',
  'qualification',
  'skill',
  'experience',
];

const CATEGORY_COLORS: Record<string, string> = {
  age: 'bg-blue-50 text-blue-700',
  gender: 'bg-pink-50 text-pink-700',
  residence_location: 'bg-green-50 text-green-700',
  qualification: 'bg-yellow-50 text-yellow-700',
  skill: 'bg-orange-50 text-orange-700',
  experience: 'bg-purple-50 text-purple-700',
};

const VALUE_TYPE_COLORS: Record<string, string> = {
  number: 'bg-sky-50 text-sky-700',
  boolean: 'bg-teal-50 text-teal-700',
  text: 'bg-gray-100 text-gray-600',
  text_array: 'bg-indigo-50 text-indigo-700',
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
    hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-400'
  }`;
}

function selectCls() {
  return 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 bg-white';
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
      {title}
    </h3>
  );
}

function Badge({ text, colorCls }: { text: string; colorCls: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colorCls}`}>
      {text}
    </span>
  );
}

// ── Add Requirement Code Modal ────────────────────────────────────────────────

type FormState = {
  category: string;
  code: string;
  label: string;
  value_type: 'number' | 'boolean' | 'text' | 'text_array';
  allowed_operators: string[];
  sort_order: string;
  is_active: boolean;
};

const EMPTY: FormState = {
  category: '',
  code: '',
  label: '',
  value_type: 'boolean',
  allowed_operators: ['exists'],
  sort_order: '',
  is_active: true,
};

export function AddReqCodeModal({
  onClose,
  onAdd,
  overlayClassName,
}: {
  onClose: () => void;
  onAdd: (payload: Omit<RequirementCode, 'id'>) => Promise<void>;
  overlayClassName?: string;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.category.trim()) next.category = '必須です';
    if (!form.code.trim()) next.code = '必須です';
    if (!form.label.trim()) next.label = '必須です';
    if (form.allowed_operators.length === 0) next.allowed_operators = '1つ以上選択してください';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const toggleOperator = (op: string) => {
    setForm((prev) => ({
      ...prev,
      allowed_operators: prev.allowed_operators.includes(op)
        ? prev.allowed_operators.filter((o) => o !== op)
        : [...prev.allowed_operators, op],
    }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onAdd({
        category: form.category.trim(),
        code: form.code.trim(),
        label: form.label.trim(),
        value_type: form.value_type,
        allowed_operators: form.allowed_operators,
        is_active: form.is_active,
        sort_order: form.sort_order ? parseInt(form.sort_order, 10) : null,
      });
      onClose();
    } catch {
      setSubmitError('条件コードの追加に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-6 ${overlayClassName ?? 'z-50'}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gray-50 rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-white rounded-t-2xl border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">条件コード追加</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-5">
          <div>
            <SectionHeader title="識別情報" />
            <div className="space-y-4">
              <div>
                <Label text="カテゴリ" required />
                <input
                  type="text"
                  list="category-list"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  placeholder="例）qualification"
                  className={inputCls(!!errors.category)}
                />
                <datalist id="category-list">
                  {KNOWN_CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {errors.category ? (
                  <FieldError msg={errors.category} />
                ) : (
                  <p className="text-xs text-gray-400 mt-1">既存カテゴリを選ぶか、新しい値を入力</p>
                )}
              </div>

              <div>
                <Label text="コード（内部識別子）" required />
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                  placeholder="例）nurse（英小文字・アンダースコアのみ）"
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
                  placeholder="例）看護師"
                  className={inputCls(!!errors.label)}
                />
                <FieldError msg={errors.label} />
              </div>
            </div>
          </div>

          <div>
            <SectionHeader title="値の設定" />
            <div className="space-y-4">
              <div>
                <Label text="値の型" required />
                <select
                  value={form.value_type}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      value_type: e.target.value as FormState['value_type'],
                      allowed_operators: [],
                    }))
                  }
                  className={selectCls()}
                >
                  {VALUE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {VALUE_TYPE_LABELS[t]}（{t}）
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label text="使用できる比較方法" required />
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {ALL_OPERATORS.map((op) => (
                    <label key={op} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.allowed_operators.includes(op)}
                        onChange={() => toggleOperator(op)}
                        className="rounded border-gray-300 text-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {OPERATOR_LABELS[op]}
                        <span className="text-xs text-gray-400 ml-1">({op})</span>
                      </span>
                    </label>
                  ))}
                </div>
                <FieldError msg={errors.allowed_operators} />
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
                    form.is_active ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      form.is_active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700">{form.is_active ? '有効' : '無効'}</span>
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
            style={{ backgroundColor: '#0288d1' }}
          >
            {submitting ? '追加中...' : '追加する'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RequirementCodesPage() {
  const navigate = useNavigate();
  const { codes, loading, error, addCode, toggleActive, deleteCode, retry } = useRequirementCodes();
  const [showModal, setShowModal] = useState(false);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">
        読み込み中...
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-red-400 text-sm">
        <p>{error}</p>
        <button
          onClick={retry}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: '#0288d1' }}
        >
          再試行
        </button>
      </div>
    );

  // カテゴリでグループ化して sort_order 順に並べる
  const grouped = codes.reduce<Record<string, RequirementCode[]>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← 管理画面
          </button>
          <h1 className="text-lg font-semibold text-gray-800">条件コード一覧</h1>
          <span className="text-sm text-gray-400">{codes.length}件</span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: '#0288d1' }}
        >
          + 条件コード追加
        </button>
      </div>

      <div className="p-6 space-y-6">
        {codes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-sm">条件コードがありません</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: '#0288d1' }}
            >
              最初の条件コードを追加する
            </button>
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div
              key={category}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Category header */}
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <Badge
                  text={CATEGORY_LABELS[category] ?? category}
                  colorCls={CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-600'}
                />
                <span className="text-xs text-gray-400 font-mono">{category}</span>
                <span className="text-xs text-gray-400 ml-1">({items.length}件)</span>
              </div>

              {/* Table */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 font-medium border-b border-gray-100">
                    <th className="text-left px-5 py-2.5 w-32">コード</th>
                    <th className="text-left px-5 py-2.5">表示名</th>
                    <th className="text-left px-5 py-2.5 w-28">値の型</th>
                    <th className="text-left px-5 py-2.5">比較方法</th>
                    <th className="text-center px-5 py-2.5 w-16">順序</th>
                    <th className="text-center px-5 py-2.5 w-20">状態</th>
                    <th className="px-5 py-2.5 w-12" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((code, i) => (
                    <tr
                      key={code.id}
                      className={`border-b border-gray-50 last:border-0 ${
                        !code.is_active ? 'opacity-40' : ''
                      } ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                    >
                      <td className="px-5 py-3 font-mono text-xs text-gray-500">{code.code}</td>
                      <td className="px-5 py-3 font-medium text-gray-800">{code.label}</td>
                      <td className="px-5 py-3">
                        <Badge
                          text={VALUE_TYPE_LABELS[code.value_type] ?? code.value_type}
                          colorCls={
                            VALUE_TYPE_COLORS[code.value_type] ?? 'bg-gray-100 text-gray-600'
                          }
                        />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {code.allowed_operators.map((op) => (
                            <span
                              key={op}
                              className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-xs font-mono"
                            >
                              {op}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center text-xs text-gray-400">
                        {code.sort_order ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleActive(code.id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            code.is_active ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${
                              code.is_active ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`「${code.label}」を削除しますか？`)) {
                              deleteCode(code.id);
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
          ))
        )}
      </div>

      {showModal && <AddReqCodeModal onClose={() => setShowModal(false)} onAdd={addCode} />}
    </div>
  );
}
