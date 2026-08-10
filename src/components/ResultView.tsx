import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Download, Share2, Copy, Check, RefreshCw, Twitter, ExternalLink, Sparkles } from 'lucide-react';
import { BuilderDetails } from '../types';
import { renderBuilderCard } from '../lib/cardRenderer';
import { getTwitterShareUrl, downloadImageFile, copyImageToClipboard, shareNativeFile } from '../lib/share';
import { CardPreview } from './CardPreview';

interface ResultViewProps {
  details: BuilderDetails;
  onEdit: () => void;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ details, onEdit, onReset }) => {
  const [renderedDataUrl, setRenderedDataUrl] = useState<string | null>(null);
  const [renderedBlob, setRenderedBlob] = useState<Blob | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Render high-res 1600x900 PNG on mount or details change
  useEffect(() => {
    let isMounted = true;
    setIsRendering(true);

    renderBuilderCard(details)
      .then((res) => {
        if (isMounted) {
          setRenderedDataUrl(res.dataUrl);
          setRenderedBlob(res.blob);
          setIsRendering(false);

          // Fire celebratory confetti burst!
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff4500', '#ffffff', '#ffd700'],
          });
        }
      })
      .catch((err) => {
        console.error('Failed to render builder card:', err);
        if (isMounted) setIsRendering(false);
      });

    return () => {
      isMounted = false;
    };
  }, [details]);

  const handleDownload = () => {
    if (!renderedBlob) return;
    const sanitizedName = details.name.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Builder';
    downloadImageFile(renderedBlob, `HHG26_Builder_Pass_${sanitizedName}.png`);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCopy = async () => {
    if (!renderedBlob) return;
    const success = await copyImageToClipboard(renderedBlob);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (!renderedBlob) return;
    await shareNativeFile(renderedBlob, details);
  };

  const twitterShareUrl = getTwitterShareUrl(details);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col items-center space-y-8">
      {/* Top Title Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-[#ff4500] bg-[#ff4500]/10 border border-[#ff4500]/30 px-3 py-1 rounded-xs font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>YOUR BUILDER PASS IS READY</span>
        </div>
        <h2 className="font-syne font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
          HH GOA 2026 PASS
        </h2>
        <p className="font-sans text-sm text-neutral-400 max-w-md mx-auto">
          Download your official 1600 × 900 PNG or share directly to X with #FrameInGoa.
        </p>
      </div>

      {/* Main Card Display & Action Panel Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Col: Pass Preview (Rendered PNG or Live Component) */}
        <div className="md:col-span-6 flex flex-col items-center">
          {isRendering ? (
            <div className="w-full max-w-[380px] aspect-[16/9] bg-[#121418] border-2 border-dashed border-[#ff4500] rounded-sm flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-[#ff4500] border-t-transparent rounded-full animate-spin" />
              <span className="font-mono text-xs text-neutral-300">
                GENERATING 1600 × 900 PNG...
              </span>
            </div>
          ) : renderedDataUrl ? (
            <div className="relative group w-full max-w-[380px]">
              <img
                src={renderedDataUrl}
                alt={`${details.name}'s Builder Pass`}
                className="w-full h-auto rounded-sm border-2 border-[#ff4500] shadow-2xl transition-transform duration-200 group-hover:scale-[1.01]"
              />
              <div className="absolute top-3 right-3 bg-black/80 text-[#ff4500] font-mono text-[10px] px-2 py-0.5 border border-[#ff4500]/40 rounded-xs">
                1600 × 900 PNG
              </div>
            </div>
          ) : (
            <CardPreview details={details} />
          )}
        </div>

        {/* Right Col: Primary Actions & Share Options */}
        <div className="md:col-span-6 space-y-4 w-full">
          {/* Action 1: Download PNG */}
          <button
            onClick={handleDownload}
            disabled={isRendering || !renderedBlob}
            className="w-full py-4 px-6 bg-[#ff4500] hover:bg-[#ff5511] text-black font-syne font-extrabold text-lg uppercase tracking-wider rounded-xs flex items-center justify-center gap-3 transition-transform active:scale-[0.99] cursor-pointer shadow-xl shadow-[#ff4500]/25 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            <span>{downloadSuccess ? 'DOWNLOADED PNG!' : 'DOWNLOAD PNG (1600×900)'}</span>
          </button>

          {/* Action 2: Share on X (Twitter) */}
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-[#1da1f2] hover:bg-[#1a91da] text-white font-syne font-extrabold text-lg uppercase tracking-wider rounded-xs flex items-center justify-center gap-3 transition-transform active:scale-[0.99] cursor-pointer shadow-lg shadow-[#1da1f2]/20"
          >
            <Twitter className="w-5 h-5 fill-current" />
            <span>SHARE ON X (#FrameInGoa)</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>

          {/* Secondary Actions Row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Copy Image */}
            <button
              onClick={handleCopy}
              disabled={isRendering || !renderedBlob}
              className="py-3 px-4 bg-[#181b22] hover:bg-[#20242e] border border-neutral-700 text-neutral-200 font-mono text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#ff4500]" />
                  <span>Copy Image</span>
                </>
              )}
            </button>

            {/* Native Mobile Share */}
            <button
              onClick={handleNativeShare}
              disabled={isRendering || !renderedBlob}
              className="py-3 px-4 bg-[#181b22] hover:bg-[#20242e] border border-neutral-700 text-neutral-200 font-mono text-xs uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#ff4500]" />
              <span>Share Pass</span>
            </button>
          </div>

          {/* Edit or Make Another */}
          <div className="pt-4 border-t border-[#22252e] flex items-center justify-between">
            <button
              onClick={onEdit}
              className="text-xs font-mono text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Edit Details / Photo
            </button>

            <button
              onClick={onReset}
              className="px-4 py-2 border border-neutral-700 hover:border-[#ff4500] text-[#ff4500] font-mono text-xs uppercase rounded-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>MAKE ANOTHER PASS</span>
            </button>
          </div>

          {/* Hashtag Callout Box */}
          <div className="p-4 bg-[#121418] border border-neutral-800 rounded-xs font-mono text-xs text-neutral-400 space-y-1">
            <div className="text-white font-bold flex items-center justify-between">
              <span>#FrameInGoa</span>
              <span className="text-[#ff4500]">HH GOA 2026</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Post your Builder Pass on X with hashtag <strong className="text-white">#FrameInGoa</strong> to get noticed by the Hacker House Goa team!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
