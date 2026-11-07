import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

export function Stepper({ current = 1, total = 4 }) {
    const steps = Array.from({ length: total }, (_, i) => i + 1);
    return (
        <div className="flex items-center mb-6">
            {steps.map((s, i) => {
                const active = s <= current;
                return (
                    <React.Fragment key={s}>
                        <div
                            className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white ${active ? 'bg-[#ff4d00]' : 'bg-slate-500'
                                }`}
                        >
                            {s < current ? <CheckIcon className="w-4 h-4 stroke-3" /> : s}
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`h-0.5 flex-1 ${s < current ? 'bg-[#ff4d00]' : 'bg-slate-500'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export function Row({ children }) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

export function Actions({ onBack, nextLabel = "Next" }) {
  return (
    <div className="flex justify-end gap-3 pt-3">
      <Button variant="neutral" size="form" leftIcon={ArrowLeftIcon} onClick={onBack}>
        Back
      </Button>
      <Button type="submit" size="form" rightIcon={ArrowRightIcon}>
        {nextLabel}
      </Button>
    </div>
  );
}

export default function VerifyLayout({ step, total = 4, title, subtitle, children }) {
    return (
        <div className="min-h-screen bg-[#e3edf4] py-10 px-4">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm p-8">
                <h1 className="text-2xl font-extrabold leading-tight text-gray-900">
                    Get verified to start hiring workers or get hired.
                </h1>
                <p className="text-sm text-gray-700 mt-1 mb-4">
                    Get verified to start hiring workers or get hired.
                </p>

                <Stepper current={step} total={total} />

                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500 mb-5">{subtitle}</p>

                {children}
            </div>
        </div>
    );
}