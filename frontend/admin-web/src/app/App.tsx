import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHome from "@/features/home/routes/home";
import AdminJobs from "@/features/jobs/routes/jobs";
import { JobsProvider } from "@/features/jobs/lib/jobs-store";

export default function App() {
  return (
    <BrowserRouter>
      <JobsProvider>
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/jobs" element={<AdminJobs />} />
        </Routes>
      </JobsProvider>
    </BrowserRouter>
  );
}
