import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHome from "@/features/home/routes/home";
import AdminJobs from "@/features/jobs/routes/jobs";
import JobDetail from "@/features/jobs/routes/job-detail";
import RequirementCodesPage from "@/features/requirement-codes/routes/requirement-codes";
import OccupationTypesPage from "@/features/occupation-types/routes/occupation-types";
import { JobsProvider } from "@/features/jobs/lib/jobs-store";
import { RequirementCodesProvider } from "@/features/requirement-codes/lib/requirement-codes-store";
import { OccupationTypesProvider } from "@/features/occupation-types/lib/occupation-types-store";

export default function App() {
  return (
    <BrowserRouter>
      <OccupationTypesProvider>
        <JobsProvider>
          <RequirementCodesProvider>
            <Routes>
              <Route path="/" element={<AdminHome />} />
              <Route path="/jobs" element={<AdminJobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/requirement-codes" element={<RequirementCodesPage />} />
              <Route path="/occupation-types" element={<OccupationTypesPage />} />
            </Routes>
          </RequirementCodesProvider>
        </JobsProvider>
      </OccupationTypesProvider>
    </BrowserRouter>
  );
}
