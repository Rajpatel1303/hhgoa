import QRCode from 'qrcode';
import { BuilderDetails } from '../types';

/**
 * Generates a dynamic target URL encoded inside the QR code for a builder.
 * Serializes all builder details into URL query params + caches in localStorage.
 */
export function getBuilderCardUrl(details: BuilderDetails | string, customUrl?: string): string {
  if (customUrl && customUrl.trim().length > 0) {
    return customUrl.trim();
  }

  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://hackerhouse.goa.dev';

  if (typeof details === 'string') {
    return `${origin}/?view=pass&cn=${encodeURIComponent(details)}`;
  }

  const cardNumber = details.cardNumber || details.id || 'HH26-GOA';

  // Cache full details in localStorage for instant local resolution
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`hh_pass_${cardNumber}`, JSON.stringify(details));
    }
  } catch (e) {
    console.warn('Could not cache pass in localStorage:', e);
  }

  const params = new URLSearchParams();
  params.set('view', 'pass');
  params.set('cn', cardNumber);
  if (details.name) params.set('n', details.name);
  if (details.role) params.set('r', details.role);
  if (details.stack) params.set('s', details.stack);
  if (details.builderTitle) params.set('t', details.builderTitle);
  if (details.themeId) params.set('th', details.themeId);

  // Include photo if available (if HTTP URL or compressed data URL under 3500 chars)
  if (details.photoUrl) {
    if (!details.photoUrl.startsWith('data:')) {
      params.set('p', details.photoUrl);
    } else if (details.photoUrl.length < 3500) {
      params.set('p', details.photoUrl);
    }
  }

  return `${origin}/?${params.toString()}`;
}

/**
 * Parses builder pass details from URL query parameters or localStorage cache
 */
export function parseBuilderPassFromUrl(): BuilderDetails | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get('view');
  const hash = window.location.hash;

  const cnParam = urlParams.get('cn') || (hash.startsWith('#pass-') ? hash.replace('#pass-', '') : null);

  // If view!=pass and no pass params, return null
  if (view !== 'pass' && !cnParam && !urlParams.get('n')) {
    return null;
  }

  const cardNumber = cnParam || 'HH26-GOA';

  // Try loading from localStorage first for 100% full quality data
  try {
    const cached = localStorage.getItem(`hh_pass_${cardNumber}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && (parsed.name || parsed.cardNumber)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading pass from localStorage:', e);
  }

  // Fallback to URL query string fields
  const name = urlParams.get('n') || 'HACKER HOUSE BUILDER';
  const role = urlParams.get('r') || 'BUILDER';
  const stack = urlParams.get('s') || 'Nextjs, Nodejs, React, AI';
  const builderTitle = urlParams.get('t') || '"Code on the Coast • Ship to the World"';
  const themeId = urlParams.get('th') || 'emerald-dark';
  const photoUrl = urlParams.get('p') || '';

  return {
    id: cardNumber,
    cardNumber,
    name,
    role,
    stack,
    builderTitle,
    themeId,
    photoUrl,
    photoTransform: {
      zoom: 1,
      panX: 0,
      panY: 0,
      rotation: 0,
      filter: 'none',
    },
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generates a high-resolution, high-contrast PNG data URL for a dynamic QR Code
 */
export async function generateQRCodeDataUrl(
  text: string,
  options?: { width?: number; margin?: number; color?: { dark?: string; light?: string } }
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: options?.width || 600,
      margin: options?.margin ?? 1,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate high-res QR code:', err);
    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }
}

