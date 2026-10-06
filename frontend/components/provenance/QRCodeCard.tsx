"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

interface QRCodeCardProps {
  tokenId: number | bigint | string;
  artworkTitle?: string;
}

export function QRCodeCard({ tokenId, artworkTitle = "Artwork" }: QRCodeCardProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const currentUrl = typeof window !== "undefined" ? `${window.location.origin}/artwork/${tokenId}` : `https://artledger.io/artwork/${tokenId}`;

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `ArtLedger-Token-${tokenId}-Physical-Label.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
        toast.success("Physical label QR code downloaded!");
      }
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.info("Artwork timeline URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 text-center space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <QrCode className="w-4 h-4 text-brand-500" />
          <span>Physical Label Tag</span>
        </div>
        <button
          onClick={copyShareLink}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white"
          title="Share link"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        ref={qrRef}
        className="p-4 bg-white rounded-xl inline-block shadow-sm border border-slate-200/80 mx-auto"
      >
        <QRCodeSVG
          value={currentUrl}
          size={160}
          level="H"
          includeMargin={false}
        />
      </div>

      <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
        Attach this cryptographic label directly to the physical artwork frame to link observers to its real-time blockchain provenance.
      </p>

      <button
        onClick={downloadQR}
        type="button"
        className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Download Frame Label</span>
      </button>
    </div>
  );
}
