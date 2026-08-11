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

  const shareText = `Built my Hacker House Goa Builder Card!\n\n👤 ${displayNames}\n🪪 Builder ID: #${cardNo}\n\nExcited to build, ship, and connect with amazing builders in Goa. 🚀\n\nCreate your own Builder Card:\n\n${shareUrl}\n\n#FrameInGoa #HHGoa2026`;

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

async function uploadPhoto(photoUrl: string, fileName: string): Promise<string> {
  let photoBlob: Blob;

  if (photoUrl.startsWith('data:')) {
    photoBlob = dataURItoBlob(photoUrl);
  } else if (photoUrl.startsWith('blob:')) {
    const photoResponse = await fetch(photoUrl);
    if (!photoResponse.ok) {
      throw new Error('The selected photo could not be read from this browser.');
    }
    photoBlob = await photoResponse.blob();
  } else {
    return photoUrl;
  }

  if (!photoBlob.type.startsWith('image/')) {
    throw new Error('The selected file is not a supported image.');
  }

  const formData = new FormData();
  formData.append('file', photoBlob, fileName);

  const uploadResponse = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  let payload: { url?: string; error?: string } = {};
  try {
    payload = await uploadResponse.json();
  } catch {
    throw new Error('Photo storage returned an invalid response.');
  }

  if (!uploadResponse.ok) {
    throw new Error(payload.error || `Photo upload failed (${uploadResponse.status}).`);
  }

  if (!payload.url) {
    throw new Error('Photo storage did not return a public URL.');
  }

  let publicUrl: URL;
  try {
    publicUrl = new URL(payload.url);
  } catch {
    throw new Error('Photo storage returned an invalid public URL.');
  }

  if (publicUrl.protocol !== 'https:') {
    throw new Error('The uploaded photo is not available over HTTPS.');
  }

  // Verify the same public URL that the X/OG crawler will need to fetch. A new
  // Blob can take a moment to propagate to every region, so retry briefly.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const publicResponse = await fetch(publicUrl.toString(), { cache: 'no-store' });
    const contentType = publicResponse.headers.get('content-type') || '';
    if (publicResponse.ok && contentType.startsWith('image/')) {
      return publicUrl.toString();
    }

    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }

  throw new Error('The uploaded photo is not publicly readable yet. Please try sharing again.');
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
  // Bypassing browser popup blocker by opening the target window synchronously on user click
  let newTab: Window | null = null;
  const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (!isMobile) {
    newTab = window.open('', '_blank');
    if (newTab) {
      newTab.document.write(`
        <html>
          <head>
            <title>Opening X...</title>
            <style>
              body {
                background: #070d0a;
                color: #f2efe9;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
              }
              .loader {
                border: 3px solid #1c2d24;
                border-top: 3px solid #facc15;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                animation: spin 1s linear infinite;
                margin-bottom: 16px;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <div class="loader"></div>
            <div style="font-weight: 600; font-size: 16px;">Preparing your Builder Pass for X...</div>
          </body>
        </html>
      `);
    }
  }

  try {
    // Step 1: Upload photo to CDN if it is local blob or base64 data URL
    const publicPhotoUrl = details.photoUrl
      ? await uploadPhoto(details.photoUrl, 'builder-avatar.jpg')
      : '';

    // Upload teammate photos to CDN if they are local blob or base64 data URLs
    const uploadedTeammates = [];
    if (details.teammates && details.teammates.length > 0) {
      for (const teammate of details.teammates) {
        let teammatePhotoUrl = teammate.photoUrl || '';
        if (teammatePhotoUrl) {
          teammatePhotoUrl = await uploadPhoto(teammatePhotoUrl, 'teammate-avatar.jpg');
        }
        uploadedTeammates.push({
          ...teammate,
          photoUrl: teammatePhotoUrl
        });
      }
    }

    // Construct fully populated details for sharing
    const detailsForShare = {
      ...details,
      photoUrl: publicPhotoUrl || details.photoUrl,
      teammates: uploadedTeammates
    };

    const { blob } = await renderBuilderCard(detailsForShare);
    const fileName = 'HH-Goa-2026-Builder-Pass.png';
    const file = new File([blob], fileName, { type: 'image/png' });

    // Construct sharing URL
    const host = window.location.origin;
    const queryParams = new URLSearchParams({
      name: detailsForShare.name || 'Builder',
      role: detailsForShare.role || 'Developer',
      title: detailsForShare.builderTitle || 'Shipper',
      stack: detailsForShare.stack || '',
      theme: detailsForShare.themeId || 'forest-emerald',
      cardNo: detailsForShare.cardNumber || '',
      photo: detailsForShare.photoUrl || '',
      passType: detailsForShare.passType || 'single',
    });

    if (detailsForShare.passType === 'team' && detailsForShare.teammates && detailsForShare.teammates.length > 0) {
      queryParams.append('teammates', JSON.stringify(detailsForShare.teammates));
    }

    const shareUrl = `${host}/pass/builder?${queryParams.toString()}`;

    const isTeam = detailsForShare.passType === 'team' && detailsForShare.teammates && detailsForShare.teammates.length > 0;
    const displayNames = isTeam
      ? [detailsForShare.name || 'Builder', ...detailsForShare.teammates!.map((t) => t.name || 'Teammate')].join(' & ')
      : detailsForShare.name || 'Builder';

    const shareTextMobile = `Built my Hacker House Goa Builder Card!\n\n👤 ${displayNames}\n🪪 Builder ID: #${detailsForShare.cardNumber || ''}\n\nExcited to build, ship, and connect with amazing builders in Goa. 🚀\n\nCreate your own Builder Card:\n\n${shareUrl}\n\n#FrameInGoa #HHGoa2026`;

    // Step 2: Check Web Share Support on mobile browsers
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
    const tweetUrl = getTwitterShareUrl(detailsForShare, detailsForShare.photoUrl || undefined);
    
    if (newTab) {
      newTab.location.href = tweetUrl;
    } else {
      window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    }

    return { nativeShared: false, twitterOpened: true };
  } catch (err) {
    console.error('Share flow error:', err);
    if (newTab) {
      try {
        newTab.close();
      } catch (e) {}
    }
    throw err instanceof Error ? err : new Error('Could not prepare the card for sharing.');
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
