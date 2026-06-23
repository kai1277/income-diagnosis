import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHome from "@/features/home/routes/home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminHome />} />
      </Routes>
    </BrowserRouter>
  );
}
