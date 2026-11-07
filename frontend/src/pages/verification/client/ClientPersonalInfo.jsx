import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import VerifyLayout, { Row, Actions } from '../../../components/layout/VerifyLayout';
import Field from '../../../components//ui/Field'; 
import { useVerify } from '../../../context/VerifyContext'; 

export default function ClientPersonalInfo() {
  const navigate = useNavigate();
  const { data, handleChange } = useVerify();

  return (
    <VerifyLayout
      step={1}
      title="Personal Information"
      subtitle="Tell us a bit about you and set your account profile."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate('/verify/client/contact');
        }}
        className="space-y-4"
      >
        <Field name="email" label="Email address" type="email" icon={EnvelopeIcon}
          placeholder="sample@gmail.com" value={data.email} onChange={handleChange} required />

        <Row>
          <Field name="firstName" label="First name" placeholder="Juan"
            value={data.firstName} onChange={handleChange} required />
          <Field name="middleName" label="Middle name" placeholder="Santos"
            value={data.middleName} onChange={handleChange} required />
        </Row>

        <Row>
          <Field name="lastName" label="Last name" placeholder="Dela Cruz"
            value={data.lastName} onChange={handleChange} required />
          <Field name="gender" label="Gender" as="select"
            options={['Male', 'Female', 'Prefer not to say']} placeholder="Select gender"
            value={data.gender} onChange={handleChange} required />
        </Row>

        <Row>
          <Field name="mobile" label="Mobile Number" type="tel" placeholder="09XXXXXXXXX"
            value={data.mobile} onChange={handleChange} required />
        </Row>

        <Actions onBack={() => navigate(-1)} />
      </form>
    </VerifyLayout>
  );
}