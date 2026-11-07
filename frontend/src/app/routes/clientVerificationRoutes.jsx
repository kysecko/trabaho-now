import { Route } from "react-router-dom";

import ClientPersonalInfo from "../../pages/verification/client/ClientPersonalInfo";
import ClientContact from "../../pages/verification/client/ClientContact";
import ClientDocuments from "../../pages/verification/client/ClientDocuments";
import ClientReview from "../../pages/verification/client/ClientReview";

export default function ClientVerificationRoutes() {
  return (
    <>
      <Route path="/verify/client/personal" element={<ClientPersonalInfo />} />
      <Route path="/verify/client/contact" element={<ClientContact />} />
      <Route path="/verify/client/documents" element={<ClientDocuments />} />
      <Route path="/verify/client/review" element={<ClientReview />} />
    </>
  );
}