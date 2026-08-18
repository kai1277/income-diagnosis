import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../features/home/routes/home";
import Quiz from "../features/diagnosis/routes/quiz";
import Result from "../features/diagnosis/routes/result";
import Jobs from "../features/jobs/routes/jobs";
import SavedJobs from "../features/jobs/routes/saved-jobs";
import UserMyPage from "../features/user-my-page/routes/user-my-page";
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
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/user-my-page" element={<UserMyPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
