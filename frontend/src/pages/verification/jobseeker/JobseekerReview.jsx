import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentIcon } from '@heroicons/react/24/outline';
import VerifyLayout, { Actions } from '../../../components/layout/VerifyLayout';
import { useVerify } from '../../../context/VerifyContext';
import { useAuth } from '../../../context/AuthContext';
import { submitVerification, buildVerificationFormData, verificationError } from '../../../api/verification';
import { JOBSEEKER_DOCS } from '../../../lib/verificationDocs';

const ROUTES = {
  personal: '/verify/jobseeker/personal',
  profile: '/verify/jobseeker/profile',
  contact: '/verify/jobseeker/contact',
  documents: '/verify/jobseeker/documents',
  pending: '/verify/pending',
};

function Section({ title, onEdit, children }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <button type="button" onClick={onEdit} className="text-xs font-semibold text-[#ff4d00] hover:underline">
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function Item({ label, value, className = '' }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="text-[11px] text-gray-500">{label}</dt>
      <dd className="text-xs font-semibold text-gray-900 wrap-break-word whitespace-pre-line">{value || '—'}</dd>
    </div>
  );
}

function FilePreview({ file }) {
  const [url, setUrl] = useState(null);
  const isImage = file?.type?.startsWith('image/');

  useEffect(() => {
    if (!file || !isImage) return;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, isImage]);

  if (isImage && url) {
    return <img src={url} alt={file.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />;
  }
  return (
    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
      <DocumentIcon className="w-5 h-5 text-gray-400" />
    </div>
  );
}

export default function JobseekerReview() {
  const navigate = useNavigate();
  const { data, files, reset } = useVerify();
  const { refreshUser } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ');
  const experience = data.experience
    ? `${data.experience} ${Number(data.experience) === 1 ? 'year' : 'years'}`
    : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await submitVerification(buildVerificationFormData(data, files));
      await refreshUser?.();
      reset();
      navigate(ROUTES.pending);
    } catch (err) {
      setError(verificationError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VerifyLayout
      step={5}
      total={5}
      title="Review and Submit"
      subtitle="Please check that everything below is correct before submitting."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Section title="Personal Information" onEdit={() => navigate(ROUTES.personal)}>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <Item label="Full name" value={fullName} className="sm:col-span-2" />
            <Item label="Email address" value={data.email} className="sm:col-span-2" />
            <Item label="Gender" value={data.gender} />
            <Item label="Mobile number" value={data.mobile} />
          </dl>
        </Section>

        <Section title="Professional Profile" onEdit={() => navigate(ROUTES.profile)}>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <Item label="Primary skill / service" value={data.skill} />
            <Item label="Years of experience" value={experience} />
            <Item label="Short bio" value={data.bio} className="sm:col-span-2" />
          </dl>
        </Section>

        <Section title="Contact Information" onEdit={() => navigate(ROUTES.contact)}>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            <Item label="Street address" value={data.street} className="sm:col-span-2" />
            <Item label="Barangay" value={data.barangay} />
            <Item label="ZIP code" value={data.zip} />
          </dl>
        </Section>

        <Section title="Documents" onEdit={() => navigate(ROUTES.documents)}>
          <ul className="space-y-3">
            {JOBSEEKER_DOCS.map(({ name, label }) => (
              <li key={name} className="flex items-center gap-3">
                <FilePreview file={files[name]} />
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-500">{label}</p>
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {files[name]?.name || 'Not uploaded'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <label className="flex items-start gap-3 cursor-pointer rounded-xl bg-gray-50 p-4">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#ff4d00]"
          />
          <span className="text-xs text-gray-700">
            I confirm I am legally allowed to work and my documents are authentic.
          </span>
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}

        <Actions
          onBack={() => navigate(-1)}
          nextLabel={submitting ? 'Submitting...' : 'Submit application'}
          nextDisabled={!agreed || submitting}
        />
      </form>
    </VerifyLayout>
  );
}