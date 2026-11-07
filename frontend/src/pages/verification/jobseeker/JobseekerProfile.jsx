import React from 'react';
import { useNavigate } from 'react-router-dom';
import VerifyLayout, { Row, Actions } from '../../../components/layout/VerifyLayout';
import Field from '../../../components/ui/Field'; // adjust path
import { useVerify } from '../../../context/VerifyContext';

export default function JobseekerProfile() {
  const navigate = useNavigate();
  const { data, handleChange } = useVerify();

  return (
    <VerifyLayout
      step={2}
      total={5}
      title="Professional Profile"
      subtitle="Tell clients what you do and how much experience you have."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate('/verify/jobseeker/contact');
        }}
        className="space-y-4"
      >
        <Row>
          <Field name="skill" label="Primary Skill / Service" placeholder="e.g. Plumber"
            value={data.skill} onChange={handleChange} required />
          <Field name="experience" label="Years of Experience" type="number" min="0" placeholder="0"
            value={data.experience} onChange={handleChange} required />
        </Row>

        <Field label="Short Bio">
          <textarea
            name="bio"
            rows={4}
            value={data.bio}
            onChange={handleChange}
            placeholder="Describe your work, specialties and availability"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </Field>

        <Actions onBack={() => navigate(-1)} />
      </form>
    </VerifyLayout>
  );
}