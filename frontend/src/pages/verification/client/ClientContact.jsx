import React from 'react';
import { useNavigate } from 'react-router-dom';
import VerifyLayout, { Row, Actions } from '../../../components/layout/VerifyLayout';
import Field from '../../../components//ui/Field'; // adjust path
import { useVerify } from '../../../context/VerifyContext'; 

export default function ClientContact() {
  const navigate = useNavigate();
  const { data, handleChange } = useVerify();

  return (
    <VerifyLayout
      step={2}
      title="Contact Information"
      subtitle="Tell us where you're located so we can verify your address."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate('/verify/client/documents');
        }}
        className="space-y-4"
      >
        <Field name="street" label="Street Address" placeholder="House no., street, subdivision"
          value={data.street} onChange={handleChange} required />

        <Row>
          <Field name="barangay" label="Barangay" placeholder="Barangay"
            value={data.barangay} onChange={handleChange} required />
          <Field name="zip" label="ZIP Code" placeholder="6001"
            value={data.zip} onChange={handleChange} required />
        </Row>

        <Actions onBack={() => navigate(-1)} />
      </form>
    </VerifyLayout>
  );
}