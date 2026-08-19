import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../features/home/routes/home";
import Quiz from "../features/diagnosis/routes/quiz";
import Result from "../features/diagnosis/routes/result";
import Jobs from "../features/jobs/routes/jobs";
import JobSearch from "../features/jobs/routes/job-search";
import SavedJobs from "../features/jobs/routes/saved-jobs";
import UserMyPage from "../features/user-my-page/routes/user-my-page";
import Company from "../features/company/routes/company";
import PrivacyPolicy from "../features/privacy-policy/routes/privacy-policy";
import { AuthProvider } from "../features/auth/auth-context";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="max-w-sm mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/result" element={<Result />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job-search" element={<JobSearch />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/user-my-page" element={<UserMyPage />} />
            <Route path="/company" element={<Company />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
