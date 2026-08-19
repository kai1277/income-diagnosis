import { useNavigate } from "react-router-dom";
import { BackIcon, BrandIcon } from "@/features/diagnosis/components/icons";
import { COMPANY_INFO } from "@/features/company/constants/company-info";

const ROWS: Array<{ label: string; value: string }> = [
  { label: "サービス名", value: COMPANY_INFO.serviceName },
  { label: "運営会社", value: COMPANY_INFO.companyName },
  { label: "代表者", value: COMPANY_INFO.representative },
  { label: "所在地", value: COMPANY_INFO.address },
  { label: "連絡先", value: COMPANY_INFO.email },
  ...(COMPANY_INFO.phone ? [{ label: "電話番号", value: COMPANY_INFO.phone }] : []),
  { label: "事業内容", value: COMPANY_INFO.business },
  ...(COMPANY_INFO.establishedDate ? [{ label: "設立日", value: COMPANY_INFO.establishedDate }] : []),
];

export default function Company() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <div className="topbar">
        <div className="backbtn" onClick={() => navigate(-1)}>
          <BackIcon />
        </div>
        <div className="brand">
          <BrandIcon />
          キレキャリ
        </div>
        <div style={{ width: 34 }}></div>
      </div>

      <div className="company-shell">
        <div className="company-eyebrow">COMPANY</div>
        <div className="company-title">運営者情報</div>

        <div className="company-table">
          {ROWS.map((row) => (
            <div className="company-row" key={row.label}>
              <span className="company-row-label">{row.label}</span>
              <span className="company-row-value">{row.value}</span>
            </div>
          ))}
        </div>

        <p className="company-note">
          本サービスの診断結果は目安であり、実際の年収を保証するものではありません。掲載求人の詳細・応募条件は各求人ページをご確認ください。
        </p>
      </div>
    </div>
  );
}
