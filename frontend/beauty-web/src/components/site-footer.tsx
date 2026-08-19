import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="site-footer-nav">
        <Link to="/company">運営者情報</Link>
      </nav>
      <p className="site-footer-copyright">&copy; キレキャリ</p>
    </footer>
  );
}
