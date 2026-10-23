import { Link } from "react-router-dom";
import {  ArrowRightIcon } from "@heroicons/react/24/outline";

export function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function PrimaryLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover sm:px-8 sm:text-base ${className}`}
    >
      {children}
      <ArrowRightIcon className="h-5 w-5" />
    </Link>
  );
}
export function SecondaryLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 rounded-lg border border-navy px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-gray-100 sm:px-8 sm:text-base ${className}`}
    >
      {children}
      <ArrowRightIcon className="h-5 w-5" />
    </Link>
  );
}