import { useNavigate } from "react-router-dom";

const MENU_ITEMS = [
  {
    label: "求人一覧",
    description: "登録済みの求人を確認・管理する",
    path: "/jobs",
  },
  {
    label: "条件コード一覧",
    description: "求人条件の種類（マスタ）を管理する",
    path: "/requirement-codes",
  },
];

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">管理画面</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:border-gray-400 transition-colors"
          >
            <p className="text-lg font-medium text-gray-800">{item.label}</p>
            <p className="mt-1 text-sm text-gray-500">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
