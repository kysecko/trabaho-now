

export default function AnalyticsCard({
  title,
  value = 0,
  icon: Icon,
  iconClassName = "text-primary",
  className = "",
}) {
  return (
    <div
      className={`
        flex items-center gap-3
        rounded-xl
        bg-[#E6EEF5]
        p-4
        shadow-sm
        transition-all duration-200
        hover:shadow-md
        ${className}
      `}
    >
      {/* Icon container */}
      <div className="
        flex h-12 w-12 shrink-0
        items-center justify-center
        rounded-xl
        bg-white
        p-3
      ">
        {Icon && (
          <Icon className={`h-6 w-6 ${iconClassName}`} />
        )}
      </div>

      {/* Analytics information */}
      <div className="min-w-0">
        <p className="text-xs font-medium text-[#526477]">
          {title}
        </p>

        <h3 className="mt-0.5 text-xl font-bold text-navy">
          {value}
        </h3>
      </div>
    </div>
  );
}

