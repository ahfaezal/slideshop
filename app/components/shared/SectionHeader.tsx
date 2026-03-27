type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  theme?: "dark" | "light";
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  theme = "dark",
}: SectionHeaderProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={`mb-10 ${
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl text-left"
      }`}
    >
      <div
        className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ${
          isDark
            ? "border border-white/10 bg-white/5 text-slate-300"
            : "border border-slate-200 bg-white text-slate-700"
        }`}
      >
        {eyebrow}
      </div>

      <h2
        className={`mt-4 text-3xl font-black tracking-tight sm:text-4xl ${
          isDark ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>

      <p
        className={`mt-4 text-base leading-7 sm:text-lg ${
          isDark ? "text-slate-400" : "text-slate-600"
        }`}
      >
        {description}
      </p>
    </div>
  );
}