/**
 * Subtle decorative lines that act as visual guides throughout sections.
 * Inspired by TwelveLabs-style thin ruling lines.
 */

interface GuideLineProps {
  variant?: "vertical-left" | "vertical-right" | "vertical-center" | "horizontal" | "flowing-curve";
  className?: string;
}

const SubtleGuideLines = ({ variant = "vertical-left", className = "" }: GuideLineProps) => {
  if (variant === "vertical-left") {
    return (
      <div
        className={`absolute left-6 lg:left-12 top-0 bottom-0 w-px pointer-events-none ${className}`}
        style={{ background: "linear-gradient(to bottom, transparent 0%, hsl(var(--border)) 15%, hsl(var(--border)) 85%, transparent 100%)" }}
      />
    );
  }

  if (variant === "vertical-right") {
    return (
      <div
        className={`absolute right-6 lg:right-12 top-0 bottom-0 w-px pointer-events-none ${className}`}
        style={{ background: "linear-gradient(to bottom, transparent 0%, hsl(var(--border)) 15%, hsl(var(--border)) 85%, transparent 100%)" }}
      />
    );
  }

  if (variant === "vertical-center") {
    return (
      <div
        className={`absolute left-1/2 top-0 bottom-0 w-px pointer-events-none ${className}`}
        style={{ background: "linear-gradient(to bottom, transparent 0%, hsl(var(--border)) 20%, hsl(var(--border)) 80%, transparent 100%)" }}
      />
    );
  }

  if (variant === "horizontal") {
    return (
      <div
        className={`absolute left-6 lg:left-12 right-6 lg:right-12 h-px pointer-events-none ${className}`}
        style={{ background: "linear-gradient(to right, transparent 0%, hsl(var(--border)) 10%, hsl(var(--border)) 90%, transparent 100%)" }}
      />
    );
  }

  if (variant === "flowing-curve") {
    return (
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M -50 200 C 200 100, 400 500, 600 300 S 900 600, 1250 200"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          opacity="0.5"
          fill="none"
        />
        <path
          d="M -50 500 C 150 400, 350 700, 550 500 S 850 300, 1250 600"
          stroke="hsl(var(--border))"
          strokeWidth="0.7"
          opacity="0.35"
          fill="none"
        />
      </svg>
    );
  }

  return null;
};

export default SubtleGuideLines;
