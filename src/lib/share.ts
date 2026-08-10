import { BuilderDetails } from '../types';
import { renderBuilderCard } from './cardRenderer';

/**
 * Creates X Intent share URL with pre-filled tweet text (text-only)
 */
export function getTwitterShareUrl(details: BuilderDetails): string {
  const name = details.name || 'Builder';
  const title = details.builderTitle || 'Shipper';
  
  const shareText = `Just created my HH Goa 2026 Builder Pass! 🚀\n\n${name} — ${title}\n\nSee you in Goa!\n\n#FrameInGoa #HHGoa2026`;

  const params = new URLSearchParams({
    text: shareText
  });

  return `https://x.com/intent/post?${params.toString()}`;
}

/**
 * Opens X (Twitter) in new window with pre-filled post text fallback
 */
export function shareOnX(details: BuilderDetails): void {
  const url = getTwitterShareUrl(details);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Handles complete client-side share flow:
 * 1. Tries Web Share API with attached PNG image file (mobile/supported browsers)
 * 2. Fallbacks to opening X post intent with text caption
 */
export async function handleFullShareFlow(details: BuilderDetails): Promise<{
  nativeShared: boolean;
  twitterOpened: boolean;
}> {
  try {
    const { blob } = await renderBuilderCard(details);
    const fileName = 'HH-Goa-2026-Builder-Pass.png';
    const file = new File([blob], fileName, { type: 'image/png' });

    const shareText = `Just created my HH Goa 2026 Builder Pass! 🚀\n\n${details.name || 'Builder'} — ${details.builderTitle || 'Shipper'}\n\nSee you in Goa!\n\n#FrameInGoa #HHGoa2026`;

    // Step 1: Check Web Share Support on mobile browsers
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (
      isMobile &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        files: [file],
        text: shareText
      });
      return { nativeShared: true, twitterOpened: false };
    }

    // Step 2: Fallback to opening X tweet intent on desktop / unsupported browsers
    const tweetUrl = getTwitterShareUrl(details);
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');

    return { nativeShared: false, twitterOpened: true };
  } catch (err) {
    console.error('Share flow error:', err);
    // Fallback simple window open on error
    shareOnX(details);
    return { nativeShared: false, twitterOpened: true };
  }
}

/**
 * Renders and exports the builder card as a high-resolution PNG download
 */
export async function exportCardAsPng(details: BuilderDetails): Promise<void> {
  const { blob } = await renderBuilderCard(details);
  const fileName = 'HH-Goa-2026-Builder-Pass.png';
  downloadImageFile(blob, fileName);
}

/**
 * Trigger browser file download for generated PNG
 */
export function downloadImageFile(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
