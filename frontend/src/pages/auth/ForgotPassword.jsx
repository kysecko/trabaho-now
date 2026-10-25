import { useState } from "react";
import { EnvelopeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

import Container from "../../components/layout/Container";
import Field from "../../components/ui/Field";
import { forgotPassword } from "../../api/auth";

export default function ForgotPassword() {
  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const update = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const first = (name) => errors[name]?.[0] ?? "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await forgotPassword(form.email);
      setSentTo(form.email);
    } catch (err) {
      setErrors(err.errors || { form: [err.message] });
    } finally {
      setSubmitting(false);
    }
  };

  if (sentTo) {
    return (
      <Container>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <EnvelopeIcon className="h-8 w-8 text-green-600" />
          </div>
          
          <h3 className="text-xl font-bold text-navy">Check your email</h3>
          
          <p className="text-gray-600">
            We sent an email to <strong className="text-navy">{sentTo}</strong> with instructions to reset your password.
          </p>
          
          <p className="text-sm text-muted">
            The link expires in 60 minutes. Don't forget to check your spam folder if it doesn't arrive.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white transition hover:bg-orange-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Go back to login
          </Link>
          
          <button
            type="button"
            onClick={() => setSentTo("")}
            className="w-full text-sm font-semibold text-primary hover:underline"
          >
            Use a different email
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col items-center text-center pb-4">
        <h2 className="text-2xl font-bold text-navy">Forgot Password?</h2>
        <p className="mt-2 text-gray-600">
          Enter your email and we’ll send you a link to reset your password.
        </p>
      </div>

      {first("form") && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 text-center">{first("form")}</div>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={update}
          error={first("email")}
          required
          icon={<EnvelopeIcon className="h-4 w-4" />}
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-lg bg-orange-600 px-4 py-2 text-white transition hover:bg-orange-700 disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send password reset link"}
        </button>

        <Link
          to="/login"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-100"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Go back to login
        </Link>
      </form>
    </Container>
  );
}