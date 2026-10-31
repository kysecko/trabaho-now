import { useState } from "react";
import {
  MapPinIcon,
  StarIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Button from "../Button";

const getAvatarColor = (name) => {
  const colors = [
    "bg-orange-100"
  ];
  const charCode = name?.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
};

export default function JobseekerCard({
  jobseeker = {},
  onHire,
}) {
  // Prevent errors when jobseeker is null or undefined
  const {
    id,
    name = "Unknown Jobseeker",
    avatar,
    profession = "Professional Service",
    location = "Location unavailable",
    rating = 0,
    rate = 0,
    rateUnit = "unit",
    verified = false,
  } = jobseeker || {};

  const [imageError, setImageError] = useState(false);

  const formattedRate = Number.isFinite(Number(rate))
    ? Number(rate).toLocaleString("en-PH")
    : "0";

  return (
    <div className="
      flex flex-col justify-between
      rounded-xl border border-gray-100
      bg-white p-4
      shadow-sm transition-all duration-200
      hover:-translate-y-1 hover:shadow-md
    ">

      {/* Profile */}
      <div className="relative flex items-center gap-3 pr-16">

        {(!imageError && avatar) ? (
          <img
            src={avatar}
            alt={name}
            onError={() => setImageError(true)}
            className="h-11 w-11 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm uppercase font-bold text-primary ${getAvatarColor(name)}`}>
            {name
              ?.trim()
              .split(/\s+/)
              .filter(Boolean)
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase() || "?"}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-navy">
            {name}
          </h3>

          <p className="truncate text-xs font-medium text-primary">
            {profession}
          </p>
        </div>

        {verified && (
          <div className="absolute right-0 top-0 flex items-center gap-1 rounded-full bg-primary-soft px-2 py-1">
            <CheckBadgeIcon className="h-3.5 w-3.5 text-primary" />

            <span className="text-[9px] font-bold text-primary">
              VERIFIED
            </span>
          </div>
        )}
      </div>


      {/* Location and Rating */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <MapPinIcon className="h-4 w-4 shrink-0 text-navy" />
          <span className="truncate text-xs text-muted">
            {location}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-sm font-semibold text-navy">
            {rating}
          </span>
          <StarIcon className="h-4 w-4 text-amber-400" />
        </div>
      </div>

      <div className="my-4 border-t border-gray-100" />

      {/* Rate and Hire */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted">
            Standard Rate
          </p>
          <p className="truncate text-sm font-bold text-navy">
            ₱{formattedRate} / {rateUnit}
          </p>
        </div>

        <Button
          size="sm"
          leftIcon={PaperAirplaneIcon}
          onClick={() => onHire?.(id)}
          disabled={!id}
          className="shrink-0 whitespace-nowrap px-3 py-2 text-xs"
        >
          Hire Now
        </Button>
      </div>

    </div>
  );
}