import { useNavigate } from "react-router-dom";
import { BackIcon, BrandIcon } from "@/features/diagnosis/components/icons";
import {
  PRIVACY_POLICY_ENACTED_DATE,
  PRIVACY_POLICY_INTRO,
  PRIVACY_POLICY_SECTIONS,
} from "@/features/privacy-policy/constants/privacy-policy";

export default function PrivacyPolicy() {
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
        <div className="company-eyebrow">PRIVACY POLICY</div>
        <div className="company-title">プライバシーポリシー</div>

        <p className="policy-intro">{PRIVACY_POLICY_INTRO}</p>

        {PRIVACY_POLICY_SECTIONS.map((section) => (
          <section className="policy-section" key={section.heading}>
            <h2 className="policy-heading">{section.heading}</h2>
            <p className="policy-body">{section.body}</p>
          </section>
        ))}

        <p className="company-note">制定日：{PRIVACY_POLICY_ENACTED_DATE}</p>
      </div>
    </div>
  );
}
