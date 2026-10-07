"use client";

import React, { useState } from "react";
import {
  BadgeDollarSign,
  ShieldCheck,
  FileSearch,
  BadgeCheck,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Coins,
} from "lucide-react";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";
import { MOCK_ARTWORKS } from "@/lib/mockArtworks";
import { toast } from "sonner";

interface AppraiserDashboardViewProps {
  onOpenVerifier?: () => void;
  onOpenTimeline?: (tokenId: number) => void;
  onOpenPortfolio?: () => void;
  onLogAppraisalAction?: (tokenId: number, amount: string) => void;
}

export function AppraiserDashboardView({
  onOpenVerifier,
  onOpenTimeline,
  onOpenPortfolio,
  onLogAppraisalAction,
}: AppraiserDashboardViewProps) {
  const [selectedTokenId, setSelectedTokenId] = useState<number>(0);

  // Artworks certified or appraised by Sotheby's Heritage
  const appraisedArtworks = MOCK_ARTWORKS.filter((a) =>
    [
      "Salvator Mundi",
      "The Starry Night",
      "Composition with Red, Blue and Yellow",
      "Water Lilies (Nymphéas)",
      "Study of the Sybil",
    ].includes(a.title)
  );

  const handleAction = (amount: string) => {
    if (onLogAppraisalAction) {
      onLogAppraisalAction(selectedTokenId, amount);
    } else {
      toast.success(
        `Certified valuation of ${amount} officially recorded on-chain for Token #${selectedTokenId}!`
      );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Role Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F5A623]/20 text-[#a86500] flex items-center justify-center font-bold">
              <BadgeDollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#a86500] block">
                Valuation Authority Console
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#242633]">
                Appraisal & Authenticity Certification
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onOpenTimeline) onOpenTimeline(selectedTokenId);
              else handleAction("$450,000,000 USD");
            }}
            className="px-5 py-3 rounded-2xl brand-gradient text-[#242633] font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_-3px_rgba(240,123,175,0.45)] flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Award className="w-4 h-4 text-[#242633]" />
            <span>Certify Valuation on Token #{selectedTokenId}</span>
            <ArrowRight className="w-4 h-4 text-[#242633]" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#686878] max-w-3xl leading-relaxed">
          As an accredited Fine Art Appraiser and Authenticity Authority, you possess exclusive signing permissions to issue certified market valuations, grade physical condition, and anchor independent insurance underwriting ratings to the blockchain.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Certified Portfolio</span>
            <span className="text-lg font-bold text-[#242633]">$750,000,000+ USD</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Appraisals Issued</span>
            <span className="text-lg font-bold text-[#a86500]">22 Certificates</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Discrepancy Catch Rate</span>
            <span className="text-lg font-bold text-[#1a7e4e]">100% Precise</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#EEE8E3]">
            <span className="text-[10px] text-[#686878] uppercase font-bold block">Signing Authority</span>
            <span className="text-lg font-bold text-[#242633]">APPRAISER_ROLE</span>
          </div>
        </div>
      </div>

      {/* Appraiser Action Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Action 1: Official Valuation Attestation */}
        <div className="p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-2.5 rounded-2xl bg-[#F5A623]/20 text-[#a86500] w-fit">
              <BadgeDollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#242633]">
                Official Valuation Certificate
              </h3>
              <p className="text-xs text-[#686878]">
                USD Market Attestation
              </p>
            </div>
            <p className="text-xs text-[#686878] leading-relaxed">
              Record certified market valuations based on recent auction sales, artist historical index, and physical condition.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAction("$380,000,000 USD")}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] font-bold text-xs flex items-center justify-center gap-2 transition-colors text-[#242633] shadow-xs cursor-pointer"
          >
            <span>Record Valuation on #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#686878]" />
          </button>
        </div>

        {/* Action 2: Authenticity Forensic Inspection */}
        <div className="p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-2.5 rounded-2xl bg-[#DBBA95]/20 text-[#855e30] w-fit">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#242633]">
                Authenticity Audit Verifier
              </h3>
              <p className="text-xs text-[#686878]">
                Pre-Auction Forensics
              </p>
            </div>
            <p className="text-xs text-[#686878] leading-relaxed">
              Run zero-trust cryptographic verification between auction catalog photographs and on-chain SHA-256 genesis hashes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onOpenVerifier) onOpenVerifier();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] font-bold text-xs flex items-center justify-center gap-2 transition-colors text-[#242633] shadow-xs cursor-pointer"
          >
            <span>Open Forensic Verifier</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#686878]" />
          </button>
        </div>

        {/* Action 3: Insurance Underwriting Rating */}
        <div className="p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-2.5 rounded-2xl bg-[#49C98A]/15 text-[#1a7e4e] w-fit">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#242633]">
                Insurance Risk Certification
              </h3>
              <p className="text-xs text-[#686878]">
                Institutional Underwriting
              </p>
            </div>
            <p className="text-xs text-[#686878] leading-relaxed">
              Assign investment-grade rating (Grade A1 Museum Quality, Grade A Investment Grade) and issue coverage certificates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              toast.success(`Insurance Grade AAA Prime issued for Token #${selectedTokenId}!`);
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F7F3F0] border border-[#EEE8E3] font-bold text-xs flex items-center justify-center gap-2 transition-colors text-[#242633] shadow-xs cursor-pointer"
          >
            <span>Log Rating on #{selectedTokenId}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#686878]" />
          </button>
        </div>
      </div>

      {/* Appraised Works Portfolio */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#242633] flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-[#F5A623]" />
            <span>Artworks in Valuation Portfolio ({appraisedArtworks.length})</span>
          </h3>
          {onOpenPortfolio && (
            <button
              type="button"
              onClick={onOpenPortfolio}
              className="text-xs font-bold text-[#F07BAF] hover:text-[#242633] transition-colors cursor-pointer"
            >
              Explore Master Registry →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {appraisedArtworks.map((a) => (
            <div
              key={a.tokenId}
              onClick={() => setSelectedTokenId(a.tokenId)}
              className={`cursor-pointer rounded-3xl transition-all ${
                selectedTokenId === a.tokenId ? "ring-2 ring-[#F5A623] scale-[1.01]" : ""
              }`}
            >
              <ArtworkCard tokenId={a.tokenId} onSelect={onOpenTimeline} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
