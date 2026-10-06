import React from "react";
import { ShieldAlert, Palette, Landmark, Sparkles, BadgeCheck, User } from "lucide-react";
import { ROLES, ROLE_METADATA } from "@/lib/constants";

interface RoleBadgeProps {
  roleHash?: string;
  className?: string;
  showIcon?: boolean;
}

export function RoleBadge({ roleHash, className = "", showIcon = true }: RoleBadgeProps) {
  if (!roleHash || roleHash === "0x0000000000000000000000000000000000000000000000000000000000000000" && roleHash !== ROLES.DEFAULT_ADMIN) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700 ${className}`}>
        {showIcon && <User className="w-3 h-3" />}
        Public User
      </span>
    );
  }

  const meta = ROLE_METADATA[roleHash] || {
    name: "Member",
    badgeClass: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    icon: "User",
  };

  const renderIcon = () => {
    switch (meta.icon) {
      case "ShieldAlert":
        return <ShieldAlert className="w-3 h-3" />;
      case "Palette":
        return <Palette className="w-3 h-3" />;
      case "Landmark":
        return <Landmark className="w-3 h-3" />;
      case "Sparkles":
        return <Sparkles className="w-3 h-3" />;
      case "BadgeCheck":
        return <BadgeCheck className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${meta.badgeClass} ${className}`}
    >
      {showIcon && renderIcon()}
      {meta.name}
    </span>
  );
}
