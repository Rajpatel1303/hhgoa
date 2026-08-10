import { BuilderDetails } from '../types';
import { renderBuilderCard } from './cardRenderer';

/**
 * Creates Twitter/X Intent share URL with pre-filled tweet text
 */
export function getTwitterShareUrl(details: BuilderDetails, customAppUrl?: string): string {
  const title = details.builderTitle || '"Neural Network Hacker & Prompt Sorcerer"';
  const role = details.role || 'AI / ML';
  const cardNumber = details.cardNumber || 'HH26-4E90D7AC';
  
  const tweetText = `I just got my official Hacker House Goa 2026 Builder Passport! 🌴\n\nRole: ${role}\n${title}\nCredential: ${cardNumber}\n\nSee you in Goa!\n\n#FrameInGoa #HHGoa2026`;

  const appUrl = customAppUrl || window.location.origin;

  const params = new URLSearchParams({
    text: tweetText,
    url: appUrl
  });

  return `https://x.com/intent/tweet?${params.toString()}`;
}

/**
 * Opens X (Twitter) in new window with pre-filled post
 */
export function shareOnX(details: BuilderDetails): void {
  const url = getTwitterShareUrl(details);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Handles complete intelligent share flow:
 * 1. Tries native share with attached PNG image file (mobile/supported OS)
 * 2. Fallbacks to copying image to clipboard + opening Twitter intent
 */
export async function handleFullShareFlow(details: BuilderDetails): Promise<{
  nativeShared: boolean;
  clipboardCopied: boolean;
  twitterOpened: boolean;
}> {
  try {
    const { blob, dataUrl } = await renderBuilderCard(details);
    
    // Save to backend and get unique share url (containing rich OpenGraph image preview tags)
    let backendShareUrl = window.location.origin;
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: details.name,
          role: details.role,
          stack: details.stack,
          builderTitle: details.builderTitle,
          cardNumber: details.cardNumber,
          photoUrl: details.photoUrl,
          cardImage: dataUrl
        })
      });
      const data = await response.json();
      if (data.success && data.id) {
        backendShareUrl = `${window.location.origin}/share/${data.id}`;
      }
    } catch (apiErr) {
      console.warn('API save card failed, falling back to query param url:', apiErr);
      // Fallback url with details
      const params = new URLSearchParams();
      params.set('view', 'pass');
      params.set('cn', details.cardNumber);
      params.set('n', details.name);
      params.set('r', details.role);
      params.set('s', details.stack);
      params.set('t', details.builderTitle);
      params.set('th', details.themeId);
      backendShareUrl = `${window.location.origin}/?${params.toString()}`;
    }

    // Step 1: Try Native File Share Sheet
    const sharedNatively = await shareNativeFile(blob, details);
    if (sharedNatively) {
      return { nativeShared: true, clipboardCopied: false, twitterOpened: false };
    }

    // Step 2: Try copying PNG image directly to clipboard
    const copied = await copyImageToClipboard(blob);

    // Step 3: Open X Tweet Intent with pre-filled caption & hashtag #FrameInGoa
    const tweetUrl = getTwitterShareUrl(details, backendShareUrl);
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');

    return { nativeShared: false, clipboardCopied: copied, twitterOpened: true };
  } catch (err) {
    console.error('Share flow error:', err);
    // Fallback simple window open
    shareOnX(details);
    return { nativeShared: false, clipboardCopied: false, twitterOpened: true };
  }
}

/**
 * Renders and exports the builder card as a high-resolution PNG download
 */
export async function exportCardAsPng(details: BuilderDetails): Promise<void> {
  const { blob } = await renderBuilderCard(details);
  const fileName = `HHG26_Builder_Pass_${details.name.replace(/\s+/g, '_')}.png`;
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

/**
 * Copy PNG image blob directly to clipboard if supported by browser
 */
export async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard write failed:', err);
  }
  return false;
}

/**
 * Trigger native mobile share sheet if available
 */
export async function shareNativeFile(blob: Blob, details: BuilderDetails): Promise<boolean> {
  try {
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], `HHG26_Builder_Pass_${details.name.replace(/\s+/g, '_')}.png`, {
        type: 'image/png',
      });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `HH Goa 2026 Builder Pass - ${details.name}`,
          text: `Check out my HH Goa 2026 Builder Pass! [ ${details.builderTitle} ] #FrameInGoa`,
          files: [file]
        });
        return true;
      }
    }
  } catch (err) {
    console.warn('Native share error:', err);
  }
  return false;
}

