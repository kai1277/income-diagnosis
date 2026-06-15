import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../features/home/routes/home";
import Quiz from "../features/diagnosis/routes/quiz";
import Result from "../features/diagnosis/routes/result";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}
