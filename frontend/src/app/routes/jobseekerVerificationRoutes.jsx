import { Route } from "react-router-dom";

import JobseekerPersonalInfo from "../../pages/verification/jobseeker/JobseekerPersonalInfo";
import JobseekerProfile from "../../pages/verification/jobseeker/JobseekerProfile";
import JobseekerContact from "../../pages/verification/jobseeker/JobseekerContact";
import JobseekerDocuments from "../../pages/verification/jobseeker/JobseekerDocuments";
import JobseekerReview from "../../pages/verification/jobseeker/JobseekerReview";

export default function JobseekerVerificationRoutes() {
  return (
    <>
      <Route path="/verify/jobseeker/personal" element={<JobseekerPersonalInfo />} />
      <Route path="/verify/jobseeker/profile" element={<JobseekerProfile />} />
      <Route path="/verify/jobseeker/contact" element={<JobseekerContact />} />
      <Route path="/verify/jobseeker/documents" element={<JobseekerDocuments />} />
      <Route path="/verify/jobseeker/review" element={<JobseekerReview />} />
    </>
  );
}