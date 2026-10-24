import { cn } from "@/lib/utils";

const PALETTE = ["#3D43E8", "#159A60", "#C77812", "#D94355", "#2F6FEB", "#7B7FFF", "#101014"];

/** Initials avatar with a stable colour per name. */
export const ClientAvatar = ({ name = "", size = 36, className }) => {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const color = PALETTE[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 items-center justify-center rounded-[10px] text-xs font-semibold", className)}
      style={{ width: size, height: size, color, background: `${color}14` }}
    >
      {initials}
    </span>
  );
};
