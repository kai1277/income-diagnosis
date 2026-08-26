export type RequirementCode = {
  id: string;
  category: string;
  code: string;
  label: string;
  value_type: 'number' | 'boolean' | 'text' | 'text_array';
  allowed_operators: string[];
  is_active: boolean;
  sort_order: number | null;
};

export type JobRequirementRow = {
  requirement_code_id: string;
  level: 'required' | 'preferred';
  operator: string;
  value: string;
};

export type OccupationType = {
  id: string;
  code: string;
  label: string;
  is_active: boolean;
  sort_order: number | null;
};

export type Prefecture = {
  id: string;
  name: string;
  sort_order: number;
};

export type City = {
  id: string;
  prefecture_id: string;
  name: string;
  sort_order: number;
};

export type Job = {
  id: string;
  title: string;
  occupation_type_ids: string[];
  occupation_types?: { id: string; label: string }[];
  image_url: string | null;
  badge_text: string | null;
  salary_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_range_type: string;
  salary_text: string;
  job_location: string | null;
  prefecture_id: string | null;
  city_id: string | null;
  prefecture?: Prefecture | null;
  city?: City | null;
  job_types: string[];
  affiliate_url: string;
  impression_pixel_url: string;
  affiliate_network: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  requirements?: JobRequirementRow[];
};

export const SALARY_TYPES = ['月給', '時給', '日給', '年俸'] as const;
export const SALARY_RANGE_TYPES = ['固定', '幅あり'] as const;
export const AFFILIATE_NETWORKS = ['A8.net', 'その他'] as const;
