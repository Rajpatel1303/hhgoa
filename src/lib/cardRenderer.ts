import { BuilderDetails, CARD_THEMES } from '../types';
import { loadImage } from './imageProcessing';

/**
 * Renders high-res 1600x900 Landscape Builder Badge to HTMLCanvasElement matching the HH Goa reference card
 */
export async function renderBuilderCard(details: BuilderDetails): Promise<{
  canvas: HTMLCanvasElement;
  dataUrl: string;
  blob: Blob;
}> {
  const canvas = document.createElement('canvas');
  const WIDTH = 1600;
  const HEIGHT = 900;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context for card renderer');
  }

  // Ensure fonts are loaded before drawing canvas
  await document.fonts.ready;

  const theme = CARD_THEMES.find((t) => t.id === details.themeId) || CARD_THEMES[0];

  // 1. Fill Dark Green Gradient Background
  const bgGradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bgGradient.addColorStop(0, theme.cardBg);
  bgGradient.addColorStop(1, '#02160e');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Outer Rounded Card Border
  drawRoundRect(ctx, 20, 20, WIDTH - 40, HEIGHT - 40, 50);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Subtle Background Diagonal Texture
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 2;
  for (let i = -HEIGHT; i < WIDTH + HEIGHT; i += 24) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + HEIGHT, HEIGHT);
    ctx.stroke();
  }
  ctx.restore();

  // ==========================================
  // LEFT SIDE: CIRCULAR BADGE SEAL & USER PHOTO (Supports Team Pass)
  // ==========================================
  const sealCenterX = 350;
  const sealCenterY = 450;
  const sealOuterRadius = 260;
  const photoRadius = 180;

  const isTeam = details.passType === 'team' && details.teammates && details.teammates.length > 0;

  if (!isTeam) {
    // Dark Green Seal Base Outer Circle
    ctx.beginPath();
    ctx.arc(sealCenterX, sealCenterY, sealOuterRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#021f14';
    ctx.fill();
    ctx.strokeStyle = '#075336';
    ctx.lineWidth = 16;
    ctx.stroke();

    // Curved Arched Text on Top and Bottom
    ctx.font = '700 32px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FACC15';
    drawCurvedText(ctx, 'HACKER HOUSE GOA', sealCenterX, sealCenterY, sealOuterRadius - 32, -Math.PI / 1.35, Math.PI / 2.1, true);

    ctx.fillStyle = '#34D399';
    drawCurvedText(ctx, 'OCT 28-31 · 2026', sealCenterX, sealCenterY, sealOuterRadius - 32, Math.PI / 3.2, Math.PI / 2.2, false);

    // Inner Photo Circle Container
    ctx.save();
    ctx.beginPath();
    ctx.arc(sealCenterX, sealCenterY, photoRadius, 0, Math.PI * 2);
    ctx.clip();

    // Colorful Background Fill behind user photo
    const photoBgGrad = ctx.createLinearGradient(
      sealCenterX - photoRadius,
      sealCenterY - photoRadius,
      sealCenterX + photoRadius,
      sealCenterY + photoRadius
    );
    photoBgGrad.addColorStop(0, '#FACC15');
    photoBgGrad.addColorStop(0.5, '#EC4899');
    photoBgGrad.addColorStop(1, '#059669');
    ctx.fillStyle = photoBgGrad;
    ctx.fillRect(sealCenterX - photoRadius, sealCenterY - photoRadius, photoRadius * 2, photoRadius * 2);

    // Draw User Photo if present
    try {
      const userImg = await loadImage(details.photoUrl);
      const { zoom = 1, panX = 0, panY = 0, rotation = 0, filter = 'none' } = details.photoTransform || {};

      ctx.save();
      ctx.translate(sealCenterX, sealCenterY);

      if (rotation !== 0) {
        ctx.rotate((rotation * Math.PI) / 180);
      }

      if (filter === 'contrast') {
        ctx.filter = 'contrast(130%) brightness(105%)';
      } else if (filter === 'goa-warmth') {
        ctx.filter = 'sepia(30%) contrast(115%) saturate(120%)';
      } else if (filter === 'cyber-cyan') {
        ctx.filter = 'hue-rotate(150deg) contrast(120%)';
      } else if (filter === 'mono') {
        ctx.filter = 'grayscale(100%) contrast(125%)';
      }

      const imgSize = photoRadius * 2;
      const imgRatio = userImg.width / userImg.height;

      let drawW = imgSize;
      let drawH = imgSize;

      if (imgRatio > 1) {
        drawH = imgSize;
        drawW = imgSize * imgRatio;
      } else {
        drawW = imgSize;
        drawH = imgSize / imgRatio;
      }

      drawW *= zoom;
      drawH *= zoom;

      const offsetX = (panX / 100) * photoRadius;
      const offsetY = (panY / 100) * photoRadius;

      ctx.drawImage(userImg, -drawW / 2 + offsetX, -drawH / 2 + offsetY, drawW, drawH);
      ctx.restore();
    } catch (err) {
      console.warn('User photo missing in canvas render:', err);
    }

    ctx.restore();

    // Photo Circle Border Stroke
    ctx.beginPath();
    ctx.arc(sealCenterX, sealCenterY, photoRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 8;
    ctx.stroke();
  } else {
    // Draw Team Pass overlapping photo badges
    const teamPhotos = [
      { url: details.photoUrl, transform: details.photoTransform },
      ...details.teammates!.map(t => ({ url: t.photoUrl, transform: t.photoTransform }))
    ];

    const teamSize = teamPhotos.length;
    const badgeRadius = 110;

    for (let idx = 0; idx < teamSize; idx++) {
      let cx = sealCenterX;
      if (teamSize === 2) {
        cx = sealCenterX + (idx === 0 ? -75 : 75);
      } else if (teamSize === 3) {
        cx = sealCenterX + (idx === 0 ? -120 : idx === 1 ? 0 : 120);
      }
      
      await drawPhotoBadge(ctx, cx, sealCenterY, badgeRadius, teamPhotos[idx].url, teamPhotos[idx].transform);
    }
  }

  // Overlapping Devanagari Goa Stamp "गोवा"
  ctx.save();
  ctx.translate(sealCenterX, sealCenterY + (isTeam ? 130 : photoRadius + 10));
  ctx.rotate(-0.05);

  const stampW = 160;
  const stampH = 56;
  drawRoundRect(ctx, -stampW / 2, -stampH / 2, stampW, stampH, 28);
  ctx.fillStyle = '#DB2777';
  ctx.fill();
  ctx.strokeStyle = '#FDE047';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.font = '900 36px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#FDE047';
  ctx.textAlign = 'center';
  ctx.fillText('गोवा', 0, 12);
  ctx.restore();

  // ==========================================
  // RIGHT SIDE: TYPOGRAPHY & DETAILS
  // ==========================================
  const rightStartX = 680;
  let currentY = 160;

  // Header: HACKER HOUSE
  ctx.font = '900 96px "Bodoni Moda", "Playfair Display", serif';
  ctx.fillStyle = '#FACC15';
  ctx.textAlign = 'left';
  ctx.fillText('HACKER HOUSE', rightStartX, currentY);

  currentY += 55;

  // Subtitle: GOA · OCT 28-31 2026
  ctx.font = '800 36px "JetBrains Mono", monospace';
  ctx.fillStyle = '#A7F3D0';
  ctx.fillText('GOA  ·  OCT 28-31 2026', rightStartX, currentY);

  // Card Number on Top Right
  const cardNumber = details.cardNumber || 'HH26-4E90D7AC';
  ctx.textAlign = 'right';
  ctx.font = '700 28px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FDE047';
  ctx.fillText(cardNumber, WIDTH - 80, currentY);

  currentY += 40;

  // Horizontal Divider Line
  ctx.beginPath();
  ctx.moveTo(rightStartX, currentY);
  ctx.lineTo(WIDTH - 80, currentY);
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
  ctx.lineWidth = 3;
  ctx.stroke();

  currentY += 80;

  // Full Name
  const rawName = isTeam
    ? [details.name.toUpperCase(), ...details.teammates!.map(t => (t.name || 'TEAMMATE').toUpperCase())].join(' & ')
    : (details.name || 'HARSH RAIKWAR').toUpperCase().trim();
  ctx.textAlign = 'left';
  
  let nameFontSize = 72;
  if (rawName.length > 28) {
    nameFontSize = 40;
  } else if (rawName.length > 18) {
    nameFontSize = 54;
  } else if (rawName.length > 14) {
    nameFontSize = 62;
  }

  ctx.font = `900 ${nameFontSize}px "Space Grotesk", sans-serif`;
  ctx.fillStyle = '#FFFFFF';

  // Truncate name if it exceeds available width (WIDTH - 80 - rightStartX = 840px)
  let renderedName = rawName;
  const maxNameW = WIDTH - 80 - rightStartX;
  if (ctx.measureText(renderedName).width > maxNameW) {
    while (renderedName.length > 0 && ctx.measureText(renderedName + '...').width > maxNameW) {
      renderedName = renderedName.slice(0, -1);
    }
    renderedName += '...';
  }
  ctx.fillText(renderedName, rightStartX, currentY);

  currentY += 60;

  // Role Quote Title
  const roleText = isTeam
    ? Array.from(new Set([details.role.toUpperCase(), ...details.teammates!.map(t => (t.role || 'Builder').toUpperCase())])).join(' • ')
    : (details.role || 'BUILDER / AI ML').toUpperCase();
  ctx.font = '800 42px "JetBrains Mono", monospace';
  ctx.fillStyle = '#34D399';
  ctx.fillText('» ', rightStartX, currentY);

  ctx.fillStyle = '#F472B6';

  // Truncate role if it exceeds available width (WIDTH - 80 - rightStartX - 48 = 792px)
  let renderedRole = roleText;
  const maxRoleW = WIDTH - 80 - rightStartX - 48;
  if (ctx.measureText(renderedRole).width > maxRoleW) {
    while (renderedRole.length > 0 && ctx.measureText(renderedRole + '...').width > maxRoleW) {
      renderedRole = renderedRole.slice(0, -1);
    }
    renderedRole += '...';
  }
  ctx.fillText(renderedRole, rightStartX + 48, currentY);

  currentY += 55;

  // Tagline Quote
  const taglineText = details.builderTitle || '"Neural Network Hacker & Prompt Sorcerer"';
  ctx.font = 'italic 500 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#FEF08A';

  // Truncate tagline if it exceeds available width (WIDTH - 80 - rightStartX = 840px)
  let renderedTagline = taglineText;
  const maxTaglineW = WIDTH - 80 - rightStartX;
  if (ctx.measureText(renderedTagline).width > maxTaglineW) {
    while (renderedTagline.length > 0 && ctx.measureText(renderedTagline + '...').width > maxTaglineW) {
      renderedTagline = renderedTagline.slice(0, -1);
    }
    renderedTagline += '...';
  }
  ctx.fillText(renderedTagline, rightStartX, currentY);

  currentY += 70;

  // Tech Stack Chips
  const rawStack = details.stack || 'Nextjs, Nodejs, Django, Flask, Gin, Rust, Tensorflow';
  const stackChips = rawStack
    .split(/[,/·•\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, 7);

  if (stackChips.length > 0) {
    ctx.font = '600 26px "JetBrains Mono", monospace';
    const chipGap = 16;
    const chipPaddingH = 24;
    const chipH = 48;

    let startX = rightStartX;

    stackChips.forEach((chip) => {
      const cW = ctx.measureText(chip).width + chipPaddingH * 2;
      
      // Wrap chip to next line if it exceeds the available width (WIDTH - 80 = 1520)
      if (startX + cW > WIDTH - 80) {
        startX = rightStartX;
        currentY += chipH + chipGap;
      }

      drawRoundRect(ctx, startX, currentY, cW, chipH, 14);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(chip, startX + chipPaddingH, currentY + 33);
      startX += cW + chipGap;
    });

    currentY += chipH + 40;
  } else {
    currentY += 40;
  }

  // Footer Line: Motto & Link + Scannable QR Code
  const footerY = HEIGHT - 80;

  ctx.font = '800 28px "JetBrains Mono", monospace';
  ctx.fillStyle = '#FACC15';
  ctx.fillText('CODE ON THE COAST • SHIP TO THE WORLD', rightStartX, footerY - 25);

  ctx.font = '700 28px "JetBrains Mono", monospace';
  ctx.fillStyle = '#6EE7B7';
  ctx.fillText('hhgoa.com', rightStartX, footerY + 15);

  // Return canvas, dataUrl, and Blob
  const dataUrl = canvas.toDataURL('image/png');
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), 'image/png');
  });

  return { canvas, dataUrl, blob };
}

/**
 * Utility to draw curved text along an arc on Canvas
 */
function drawCurvedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  angleRange: number,
  isTop: boolean
) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = isTop ? 'bottom' : 'top';

  const chars = text.split('');
  const step = angleRange / Math.max(chars.length - 1, 1);

  chars.forEach((char, i) => {
    const angle = startAngle + i * step;
    ctx.save();
    ctx.translate(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    ctx.rotate(angle + (isTop ? Math.PI / 2 : -Math.PI / 2));
    ctx.fillText(char, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}

/**
 * Utility to draw rounded rectangles on HTML Canvas 2D
 */
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Helper to draw a single circular photo badge on Canvas
 */
async function drawPhotoBadge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  photoUrl: string,
  transform: any
) {
  ctx.save();
  
  // Outer circle border
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
  ctx.fillStyle = '#021f14';
  ctx.fill();
  ctx.strokeStyle = '#075336';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Clip to inner circle
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  // Gradient background
  const photoBgGrad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
  photoBgGrad.addColorStop(0, '#FACC15');
  photoBgGrad.addColorStop(0.5, '#EC4899');
  photoBgGrad.addColorStop(1, '#059669');
  ctx.fillStyle = photoBgGrad;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  if (photoUrl) {
    try {
      const userImg = await loadImage(photoUrl);
      const { zoom = 1, panX = 0, panY = 0, rotation = 0, filter = 'none' } = transform || {};

      ctx.save();
      ctx.translate(cx, cy);

      if (rotation !== 0) {
        ctx.rotate((rotation * Math.PI) / 180);
      }

      if (filter === 'contrast') {
        ctx.filter = 'contrast(130%) brightness(105%)';
      } else if (filter === 'goa-warmth') {
        ctx.filter = 'sepia(30%) contrast(115%) saturate(120%)';
      } else if (filter === 'cyber-cyan') {
        ctx.filter = 'hue-rotate(150deg) contrast(120%)';
      } else if (filter === 'mono') {
        ctx.filter = 'grayscale(100%) contrast(125%)';
      }

      const imgSize = radius * 2;
      const imgRatio = userImg.width / userImg.height;

      let drawW = imgSize;
      let drawH = imgSize;

      if (imgRatio > 1) {
        drawH = imgSize;
        drawW = imgSize * imgRatio;
      } else {
        drawW = imgSize;
        drawH = imgSize / imgRatio;
      }

      drawW *= zoom;
      drawH *= zoom;

      const offsetX = (panX / 100) * radius;
      const offsetY = (panY / 100) * radius;

      ctx.drawImage(userImg, -drawW / 2 + offsetX, -drawH / 2 + offsetY, drawW, drawH);
      ctx.restore();
    } catch (err) {
      console.warn('Photo loading error in canvas drawPhotoBadge:', err);
    }
  }

  ctx.restore();

  // Photo Circle Border Stroke
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 6;
  ctx.stroke();
}
