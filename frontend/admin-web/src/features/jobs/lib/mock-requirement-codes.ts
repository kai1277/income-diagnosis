import type { RequirementCode } from "@/features/jobs/types";

export const MOCK_REQUIREMENT_CODES: RequirementCode[] = [
  // 年齢
  { id: "rc-age-min", category: "age", code: "min_age", label: "最低年齢", value_type: "number", allowed_operators: ["gte", "gt"], is_active: true, sort_order: 1 },
  { id: "rc-age-max", category: "age", code: "max_age", label: "最高年齢", value_type: "number", allowed_operators: ["lte", "lt"], is_active: true, sort_order: 2 },

  // 性別
  { id: "rc-gender", category: "gender", code: "gender", label: "性別", value_type: "text", allowed_operators: ["eq", "in"], is_active: true, sort_order: 10 },

  // 居住地
  { id: "rc-pref", category: "residence_location", code: "prefecture", label: "都道府県", value_type: "text", allowed_operators: ["eq", "in"], is_active: true, sort_order: 20 },

  // 資格
  { id: "rc-nurse", category: "qualification", code: "nurse", label: "看護師", value_type: "boolean", allowed_operators: ["exists"], is_active: true, sort_order: 30 },
  { id: "rc-care-worker", category: "qualification", code: "care_worker", label: "介護福祉士", value_type: "boolean", allowed_operators: ["exists"], is_active: true, sort_order: 31 },
  { id: "rc-license-med", category: "qualification", code: "driver_license_medium", label: "中型免許", value_type: "boolean", allowed_operators: ["exists"], is_active: true, sort_order: 32 },
  { id: "rc-license-large", category: "qualification", code: "driver_license_large", label: "大型免許", value_type: "boolean", allowed_operators: ["exists"], is_active: true, sort_order: 33 },
  { id: "rc-license-special", category: "qualification", code: "driver_license_special", label: "特殊免許", value_type: "boolean", allowed_operators: ["exists"], is_active: true, sort_order: 34 },
  { id: "rc-electric", category: "qualification", code: "electrical_engineer", label: "電気工事士", value_type: "boolean", allowed_operators: ["exists"], is_active: true, sort_order: 35 },
  { id: "rc-plumber", category: "qualification", code: "plumbing", label: "配管技能士", value_type: "boolean", allowed_operators: ["exists"], is_active: true, sort_order: 36 },

  // スキル
  { id: "rc-forklift", category: "skill", code: "forklift", label: "フォークリフト", value_type: "boolean", allowed_operators: ["exists"], is_active: true, sort_order: 40 },
  { id: "rc-welding", category: "skill", code: "welding", label: "溶接", value_type: "boolean", allowed_operators: ["exists"], is_active: true, sort_order: 41 },
  { id: "rc-crane", category: "skill", code: "crane", label: "クレーン", value_type: "boolean", allowed_operators: ["exists"], is_active: true, sort_order: 42 },
  { id: "rc-pc", category: "skill", code: "pc_basic", label: "PC基本操作", value_type: "boolean", allowed_operators: ["exists"], is_active: true, sort_order: 43 },

  // 経験
  { id: "rc-exp-years", category: "experience", code: "years", label: "経験年数", value_type: "number", allowed_operators: ["gte", "gt", "eq"], is_active: true, sort_order: 50 },
  { id: "rc-exp-construction", category: "experience", code: "construction", label: "建設業経験", value_type: "boolean", allowed_operators: ["exists"], is_active: true, sort_order: 51 },
  { id: "rc-exp-manufacturing", category: "experience", code: "manufacturing", label: "製造業経験", value_type: "boolean", allowed_operators: ["exists"], is_active: true, sort_order: 52 },
];

export const CATEGORY_LABELS: Record<string, string> = {
  age: "年齢",
  gender: "性別",
  residence_location: "居住地",
  qualification: "資格",
  skill: "スキル",
  experience: "経験",
};

export const OPERATOR_LABELS: Record<string, string> = {
  eq: "等しい",
  neq: "等しくない",
  gt: "より大きい",
  gte: "以上",
  lt: "より小さい",
  lte: "以下",
  in: "いずれかに含む",
  not_in: "いずれにも含まない",
  contains: "含む",
  exists: "存在する",
};
