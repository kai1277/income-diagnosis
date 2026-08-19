import { useNavigate } from "react-router-dom";
import { BackIcon, BrandIcon } from "@/features/diagnosis/components/icons";
import {
  TERMS_OF_SERVICE_ENACTED_DATE,
  TERMS_OF_SERVICE_INTRO,
  TERMS_OF_SERVICE_SECTIONS,
} from "@/features/terms-of-service/constants/terms-of-service";

export default function TermsOfService() {
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
        <div className="company-eyebrow">TERMS OF SERVICE</div>
        <div className="company-title">キレキャリ利用規約</div>

        <p className="policy-intro">{TERMS_OF_SERVICE_INTRO}</p>

        {TERMS_OF_SERVICE_SECTIONS.map((section) => (
          <section className="policy-section" key={section.heading}>
            <h2 className="policy-heading">{section.heading}</h2>
            <p className="policy-body">{section.body}</p>
          </section>
        ))}

        <p className="company-note">制定日：{TERMS_OF_SERVICE_ENACTED_DATE}</p>
      </div>
    </div>
  );
}
