import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] px-5 h-11 text-sm font-medium transition duration-200 ease-[var(--ease-out-soft)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-soft",
  secondary: "bg-paper-raised text-ink-900 border border-sand-200 hover:border-ink-500",
  ghost: "text-ink-700 hover:bg-sand-100",
};

type Props = {
  variant?: Variant;
  className?: string;
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: Props & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
