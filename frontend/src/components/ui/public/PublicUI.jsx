import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      {eyebrow && (
        <p className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
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

export function PrimaryLink({
  to,
  children,
  className = "",
  icon: Icon = ArrowRightIcon,
  iconPosition = "right",
  ...props
}) {
  return (
    <Link
      to={to}
      {...props}
      className={`inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover sm:px-8 sm:text-base ${className}`}
    >
      {iconPosition === "left" && Icon && (
        <Icon className="h-5 w-5 shrink-0" />
      )}

      {children}

      {iconPosition === "right" && Icon && (
        <Icon className="h-5 w-5 shrink-0" />
      )}
    </Link>
  );
}

export function SecondaryLink({
  to,
  children,
  className = "",
  icon: Icon = ArrowRightIcon,
  iconPosition = "right",
  ...props
}) {
  return (
    <Link
      to={to}
      {...props}
      className={`inline-flex items-center gap-2 rounded-lg border border-navy px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-gray-100 sm:px-8 sm:text-base ${className}`}
    >
      {iconPosition === "left" && Icon && (
        <Icon className="h-5 w-5 shrink-0" />
      )}

      {children}

      {iconPosition === "right" && Icon && (
        <Icon className="h-5 w-5 shrink-0" />
      )}
    </Link>
  );
}

function isSafePath(path) {
  return typeof path === "string" && path.startsWith("/") && !path.startsWith("//");
}

export function GoBackLink({
  fallback = "/",
  className = "",
  children = "Go back",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const hasHistory = location.key !== "default";
  const from = searchParams.get("from");
  const destination = isSafePath(from) ? from : fallback;

  const handleClick = (e) => {
    if (!hasHistory) return;
    e.preventDefault();
    navigate(-1);
  };

  return (
    <PrimaryLink
      to={destination}
      onClick={handleClick}
      icon={ArrowLeftIcon}
      iconPosition="left"
      className={className}
    >
      {children}
    </PrimaryLink>
  );
}