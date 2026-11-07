import React from 'react';
import { useNavigate } from 'react-router-dom';
import VerifyLayout, { Actions } from '../../../components/layout/VerifyLayout';
import Field from '../../../components/ui/Field'; // adjust path
import { useVerify } from '../../../context/VerifyContext';
import { JOBSEEKER_DOCS } from '../../../lib/verificationDocs';

export default function JobseekerDocuments() {
  const navigate = useNavigate();
  const { files, setFile } = useVerify();

  return (
    <VerifyLayout
      step={4}
      total={5}
      title="Upload Documents"
      subtitle="Upload the documents we need to verify your identity."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate('/verify/jobseeker/review');
        }}
        className="space-y-4"
      >
        {JOBSEEKER_DOCS.map(({ name, label, hint, Icon }) => (
          <Field key={name} label={label} required>
            <div className="relative h-24 rounded-lg border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center hover:border-[#ff4d00] cursor-pointer">
              <Icon className="w-5 h-5 text-gray-400 mb-1" />
              <span className="text-xs text-gray-600 px-3 text-center truncate max-w-full">
                {files[name]?.name || hint}
              </span>
              <input
                type="file"
                // already uploaded when coming back from the review step
                required={!files[name]}
                accept="image/*,.pdf"
                onChange={(e) => setFile(name, e.target.files[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </Field>
        ))}

        <Actions onBack={() => navigate(-1)} />
      </form>
    </VerifyLayout>
  );
}