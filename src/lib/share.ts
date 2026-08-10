import { BuilderDetails } from '../types';
import { renderBuilderCard } from './cardRenderer';

/**
 * Creates X Intent share URL with pre-filled tweet text & dynamic page URL for crawler OG rendering
 */
export function getTwitterShareUrl(details: BuilderDetails, customPhotoUrl?: string): string {
  const name = details.name || 'Builder';
  const role = details.role || 'Developer';
  const title = details.builderTitle || 'Shipper';
  const stack = details.stack || '';
  const theme = details.themeId || 'forest-emerald';
  const cardNo = details.cardNumber || '';

  const host = typeof window !== 'undefined' ? window.location.origin : 'https://hhgoa-tau.vercel.app';
  const queryParams = new URLSearchParams({
    name,
    role,
    title,
    stack,
    theme,
    cardNo,
    photo: customPhotoUrl || '',
    passType: details.passType || 'single',
  });

  if (details.passType === 'team' && details.teammates) {
    queryParams.append('teammates', JSON.stringify(details.teammates));
  }

  const shareUrl = `${host}/pass/builder?${queryParams.toString()}`;

  const isTeam = details.passType === 'team' && details.teammates && details.teammates.length > 0;
  const displayNames = isTeam
    ? [name, ...details.teammates!.map((t) => t.name || 'Teammate')].join(' & ')
    : name;

  const shareText = `Built my Hacker House Goa Builder Card!\n\n👤 ${displayNames}\n🪪 Builder ID: #${cardNo}\n\nExcited to build, ship, and connect with amazing builders in Goa. 🚀\n\nCreate your own Builder Card:\n${shareUrl}\n\n#FrameInGoa #HHGoa2026`;

  const params = new URLSearchParams({
    text: shareText
  });

  return `https://x.com/intent/post?${params.toString()}`;
}

/**
 * Opens X (Twitter) in new window with pre-filled post text fallback
 */
export function shareOnX(details: BuilderDetails, customPhotoUrl?: string): void {
  const url = getTwitterShareUrl(details, customPhotoUrl);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Helper to convert Base64 Data URL to standard binary Blob
 */
function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

/**
 * Handles complete client-side share flow:
 * 1. Uploads local blob or base64 photo to CDN storage if needed to obtain public HTTP URL
 * 2. Tries Web Share API with attached PNG image file (mobile/supported browsers)
 * 3. Fallbacks to opening X post intent with text caption + dynamic OG url (desktop)
 */
export async function handleFullShareFlow(details: BuilderDetails): Promise<{
  nativeShared: boolean;
  twitterOpened: boolean;
}> {
  try {
    // Step 1: Upload photo to CDN if it is local blob or base64 data URL
    let publicPhotoUrl = '';
    if (details.photoUrl && (details.photoUrl.startsWith('blob:') || details.photoUrl.startsWith('data:'))) {
      try {
        let photoBlob: Blob;
        if (details.photoUrl.startsWith('data:')) {
          photoBlob = dataURItoBlob(details.photoUrl);
        } else {
          const photoResponse = await fetch(details.photoUrl);
          photoBlob = await photoResponse.blob();
        }
        
        const formData = new FormData();
        formData.append('file', photoBlob, 'avatar.png');
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          publicPhotoUrl = uploadData.url;
        }
      } catch (err) {
        console.error('Failed to upload avatar to CDN:', err);
      }
    } else if (details.photoUrl) {
      publicPhotoUrl = details.photoUrl; // already public
    }

    const { blob } = await renderBuilderCard(details);
    const fileName = 'HH-Goa-2026-Builder-Pass.png';
    const file = new File([blob], fileName, { type: 'image/png' });

    // Construct sharing URL
    const host = window.location.origin;
    const queryParams = new URLSearchParams({
      name: details.name || 'Builder',
      role: details.role || 'Developer',
      title: details.builderTitle || 'Shipper',
      stack: details.stack || '',
      theme: details.themeId || 'forest-emerald',
      cardNo: details.cardNumber || '',
      photo: publicPhotoUrl,
      passType: details.passType || 'single',
    });

    if (details.passType === 'team' && details.teammates) {
      queryParams.append('teammates', JSON.stringify(details.teammates));
    }

    const shareUrl = `${host}/pass/builder?${queryParams.toString()}`;

    const isTeam = details.passType === 'team' && details.teammates && details.teammates.length > 0;
    const displayNames = isTeam
      ? [details.name || 'Builder', ...details.teammates!.map((t) => t.name || 'Teammate')].join(' & ')
      : details.name || 'Builder';

    const shareTextMobile = `Built my Hacker House Goa Builder Card!\n\n👤 ${displayNames}\n🪪 Builder ID: #${details.cardNumber || ''}\n\nExcited to build, ship, and connect with amazing builders in Goa. 🚀\n\nCreate your own Builder Card:\n${shareUrl}\n\n#FrameInGoa #HHGoa2026`;

    // Step 2: Check Web Share Support on mobile browsers
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (
      isMobile &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        files: [file],
        text: shareTextMobile
      });
      return { nativeShared: true, twitterOpened: false };
    }

    // Step 3: Fallback to opening X tweet intent on desktop / unsupported browsers
    const tweetUrl = getTwitterShareUrl(details, publicPhotoUrl);
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
