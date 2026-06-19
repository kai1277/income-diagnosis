import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../features/home/routes/home";
import Quiz from "../features/diagnosis/routes/quiz";
import Result from "../features/diagnosis/routes/result";
import Jobs from "../features/jobs/routes/jobs";

export default function App() {
  return (
    <BrowserRouter>
      <div className="max-w-sm mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
          <Route path="/jobs" element={<Jobs />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
