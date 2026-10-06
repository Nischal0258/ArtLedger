import React from "react";
import {
  Sparkles,
  ArrowRightLeft,
  Landmark,
  Hammer,
  BadgeDollarSign,
  Box,
  MapPin,
  Clock,
} from "lucide-react";
import { CustodyEventData } from "@/hooks/useProvenance";
import { EventType, EVENT_METADATA } from "@/lib/constants";
import { formatRelativeTime, formatFullDate } from "@/lib/formatters";
import { AddressPill } from "@/components/ui/AddressPill";
import { RoleBadge } from "@/components/ui/RoleBadge";

interface TimelineEventProps {
  event: CustodyEventData;
  isFirst?: boolean;
  isLast?: boolean;
}

export function TimelineEvent({ event, isFirst = false, isLast = false }: TimelineEventProps) {
  const meta = EVENT_METADATA[event.eventType as EventType] || {
    title: "Provenance Update",
    color: "purple",
    icon: "Sparkles",
    description: "",
  };

  const renderIcon = () => {
    switch (meta.icon) {
      case "Sparkles":
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case "ArrowRightLeft":
        return <ArrowRightLeft className="w-4 h-4 text-blue-400" />;
      case "Landmark":
        return <Landmark className="w-4 h-4 text-emerald-400" />;
      case "Hammer":
        return <Hammer className="w-4 h-4 text-amber-400" />;
      case "BadgeDollarSign":
        return <BadgeDollarSign className="w-4 h-4 text-rose-400" />;
      case "Box":
        return <Box className="w-4 h-4 text-slate-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="relative flex gap-4 sm:gap-6 group">
      {/* Vertical Spine */}
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
      )}

      {/* Event Icon Node */}
      <div className="relative z-10 w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-sm group-hover:border-brand-500 transition-colors">
        {renderIcon()}
      </div>

      {/* Event Card Content */}
      <div className="flex-1 pb-8">
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-3 transition-all hover:shadow-md">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {meta.title}
              </h4>
              <RoleBadge roleHash={event.actorRole} />
            </div>

            <div
              className="flex items-center gap-1.5 text-xs text-slate-400 font-medium"
              title={formatFullDate(event.timestamp)}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatRelativeTime(event.timestamp)}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {event.description}
          </p>

          {/* Metadata Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-slate-400">Recorded By:</span>
              <AddressPill address={event.actor} chars={4} />
            </div>

            {event.location && (
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <MapPin className="w-3 h-3 text-brand-500" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
