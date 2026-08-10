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

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
  };

  // Ensure fonts are loaded before drawing canvas
  await document.fonts.ready;

  const theme = CARD_THEMES.find((t) => t.id === details.themeId) || CARD_THEMES[0];

  if (theme.id === 'goa-boarding-pass' || theme.id === 'vintage-goa') {
    const WIDTH = 1600;
    const HEIGHT = 900;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const isDark = theme.id === 'vintage-goa';
    const cardBg = theme.cardBg;
    const recessedBg = theme.recessedBg;
    const perforatedColor = isDark ? 'rgba(52, 211, 153, 0.25)' : '#D6D3D1';
    const borderColor = isDark ? 'rgba(52, 211, 153, 0.25)' : '#E7E5E4';
    const separatorColor = isDark ? 'rgba(52, 211, 153, 0.2)' : '#E7E5E4';
    const titleColor = isDark ? '#FACC15' : '#047857';
    const headingLabelColor = isDark ? '#34D399' : '#A8A29E';
    const airportCodeColor = isDark ? '#FFFFFF' : '#047857';
    const arrowColor = isDark ? '#FACC15' : '#F97316';
    const passengerNameColor = isDark ? '#FFFFFF' : '#1C1917';
    const rolePillFill = isDark ? 'rgba(4, 120, 87, 0.2)' : 'rgba(4, 120, 87, 0.1)';
    const rolePillBorder = isDark ? 'rgba(52, 211, 153, 0.3)' : 'rgba(4, 120, 87, 0.25)';
    const rolePillTextColor = isDark ? '#34D399' : '#047857';
    const gridLabelColor = isDark ? '#A7F3D0' : '#A8A29E';
    const gridValueColor = isDark ? '#FFFFFF' : '#1C1917';
    const barcodeColor = isDark ? '#34D399' : '#1C1917';
    const cardNumberColor = isDark ? '#34D399' : '#78716C';

    // 1. Fill base vintage card-paper color
    ctx.fillStyle = cardBg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // 2. Ticket Notch Cutouts (Draw circle cutouts matching the page dark background #070d0a)
    const notchX = WIDTH * 0.72; // 1152
    ctx.fillStyle = '#070d0a';
    
    // Top Notch
    ctx.beginPath();
    ctx.arc(notchX, 0, 30, 0, Math.PI, false);
    ctx.fill();

    // Bottom Notch
    ctx.beginPath();
    ctx.arc(notchX, HEIGHT, 30, Math.PI, 0, false);
    ctx.fill();

    // 3. Perforated vertical dividing line
    ctx.save();
    ctx.strokeStyle = perforatedColor;
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(notchX, 35);
    ctx.lineTo(notchX, HEIGHT - 35);
    ctx.stroke();
    ctx.restore();

    // 4. Ticket outer border stroke
    drawRoundRect(ctx, 30, 30, WIDTH - 60, HEIGHT - 60, 30);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    // 5. Draw passport stamp photo(s)
    const isTeam = details.passType === 'team' && details.teammates && details.teammates.length > 0;
    const drawStampPhoto = async (photoUrl: string, transformData: any, placeholder: string, cx: number, cy: number, size: number, angleDeg: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angleDeg * Math.PI) / 180);

      const half = size / 2;

      // Draw white stamp paper base
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-half - 8, -half - 8, size + 16, size + 16);
      
      // Draw stamp dashed border
      ctx.strokeStyle = '#D6D3D1';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(-half - 4, -half - 4, size + 8, size + 8);
      ctx.setLineDash([]);

      // Clip inner image
      ctx.save();
      ctx.beginPath();
      ctx.rect(-half, -half, size, size);
      ctx.clip();

      ctx.fillStyle = '#F5F5F4';
      ctx.fillRect(-half, -half, size, size);

      if (photoUrl) {
        try {
          const img = await loadImage(photoUrl);
          const { zoom = 1, panX = 0, panY = 0, rotation = 0, filter = 'none' } = transformData || {};

          ctx.save();
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

          const imgRatio = img.width / img.height;
          let drawW = size;
          let drawH = size;

          if (imgRatio > 1) {
            drawH = size;
            drawW = size * imgRatio;
          } else {
            drawW = size;
            drawH = size / imgRatio;
          }

          drawW *= zoom;
          drawH *= zoom;

          const offsetX = (panX / 100) * size;
          const offsetY = (panY / 100) * size;

          ctx.drawImage(img, -drawW / 2 + offsetX, -drawH / 2 + offsetY, drawW, drawH);
          ctx.restore();
        } catch (err) {
          console.warn('Failed to draw traveler photo in stamp canvas:', err);
        }
      } else {
        ctx.fillStyle = '#D6D3D1';
        ctx.font = 'bold 20px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(placeholder, 0, 0);
      }

      ctx.restore(); // inner clip
      ctx.restore(); // base translate
    };

    if (!isTeam) {
      // Single stamp centered
      const size = 300;
      await drawStampPhoto(details.photoUrl, details.photoTransform, '[ PHOTO ]', 950, 420, size, 2);
    } else {
      // Overlapping team stamp badges (optimized size and start coordinates to prevent dividing line overlap)
      const teamPhotos = [
        { url: details.photoUrl, transform: details.photoTransform },
        ...details.teammates!.map(t => ({ url: t.photoUrl, transform: t.photoTransform }))
      ];
      const teamSize = teamPhotos.length;
      const size = 160;
      const startX = 820; // Shifted left to make room for wider spacing
      const startY = 380;

      for (let idx = 0; idx < teamSize; idx++) {
        const offset = idx * 115; // Increased offset from 85 to 115 to spread the polaroids out
        const angle = idx === 0 ? -6 : idx === 1 ? 4 : -2;
        const cx = startX + offset;
        const cy = startY + (idx === 2 ? 25 : offset * 0.15);
        await drawStampPhoto(teamPhotos[idx].url, teamPhotos[idx].transform, `P${idx + 1}`, cx, cy, size, angle);
      }
    }

    // 6. Draw Left Column Text Details (Main Pass)
    const textStartX = 80;

    // Header title
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '900 36px "Space Grotesk", sans-serif';
    ctx.fillStyle = titleColor;
    ctx.fillText('✈️ HACKER HOUSE AIRLINES', textStartX, 110);

    ctx.textAlign = 'right';
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillStyle = headingLabelColor;
    ctx.fillText('BOARDING PASS', notchX - 50, 110);

    // Separator line
    ctx.beginPath();
    ctx.moveTo(textStartX, 140);
    ctx.lineTo(notchX - 50, 140);
    ctx.strokeStyle = separatorColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Airport codes
    ctx.textAlign = 'left';
    ctx.font = '900 96px "Space Grotesk", sans-serif';
    ctx.fillStyle = airportCodeColor;
    ctx.fillText('HCK', textStartX, 250);

    ctx.font = '900 54px "Space Grotesk", sans-serif';
    ctx.fillStyle = arrowColor;
    ctx.fillText('➔', textStartX + 240, 235);

    ctx.font = '900 96px "Space Grotesk", sans-serif';
    ctx.fillStyle = airportCodeColor;
    ctx.fillText('GOA', textStartX + 320, 250);

    // Passenger Name
    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.fillStyle = headingLabelColor;
    ctx.fillText('PASSENGER', textStartX, 330);

    const nameText = details.name.toUpperCase();
    const isTeamPass = details.passType === 'team' && details.teammates && details.teammates.length > 0;
    const displayNames = isTeamPass
      ? [nameText, ...details.teammates!.map((t) => (t.name || 'TEAMMATE').toUpperCase())].join(' & ')
      : nameText;

    let nameSize = 50;
    if (displayNames.length > 28) nameSize = 32;
    else if (displayNames.length > 18) nameSize = 40;
    ctx.font = `900 ${nameSize}px "Space Grotesk", sans-serif`;
    ctx.fillStyle = passengerNameColor;

    if (displayNames.length > 20) {
      wrapText(ctx, displayNames, textStartX, 375, 740, nameSize + 6);
    } else {
      ctx.fillText(displayNames, textStartX, 395);
    }

    // Class / Role capsule
    const roleText = isTeamPass
      ? Array.from(new Set([details.role.toUpperCase(), ...details.teammates!.map(t => (t.role || 'Builder').toUpperCase())])).join(' • ')
      : details.role.toUpperCase();

    ctx.font = '800 18px "JetBrains Mono", monospace';
    const rW = ctx.measureText(roleText).width + 30;
    const rH = 36;
    const rY = 430;

    drawRoundRect(ctx, textStartX, rY, rW, rH, 8);
    ctx.fillStyle = rolePillFill;
    ctx.fill();
    ctx.strokeStyle = rolePillBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = rolePillTextColor;
    ctx.textBaseline = 'middle';
    ctx.fillText(roleText, textStartX + 15, rY + rH / 2);
    ctx.textBaseline = 'alphabetic';

    // Tagline Quote
    const taglineText = details.builderTitle || '"Neural Network Hacker & Prompt Sorcerer"';
    ctx.font = 'italic 500 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isDark ? '#FEF08A' : '#78716C';
    ctx.fillText(taglineText, textStartX, 510);

    // Tech Stack Chips
    const rawStack = details.stack || 'Nextjs, Nodejs, Django, Flask, Gin, Rust, Tensorflow';
    const stackChips = rawStack
      .split(/[,/·•\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 5);

    if (stackChips.length > 0) {
      ctx.font = '600 16px "JetBrains Mono", monospace';
      let chipX = textStartX;
      let chipY = 550;
      const chipGap = 10;
      const chipPaddingH = 12;
      const chipH = 28;

      stackChips.forEach((chip) => {
        const cW = ctx.measureText(chip).width + chipPaddingH * 2;
        if (chipX + cW > notchX - 80) return;

        drawRoundRect(ctx, chipX, chipY, cW, chipH, 6);
        ctx.fillStyle = isDark ? 'rgba(4, 120, 87, 0.2)' : '#F5F5F4';
        ctx.fill();
        ctx.strokeStyle = isDark ? 'rgba(52, 211, 153, 0.25)' : '#E7E5E4';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = isDark ? '#A7F3D0' : '#57534E';
        ctx.textBaseline = 'middle';
        ctx.fillText(chip, chipX + chipPaddingH, chipY + chipH / 2);
        chipX += cW + chipGap;
      });
      ctx.textBaseline = 'alphabetic';
    }

    // Details Grid line separator
    ctx.beginPath();
    ctx.moveTo(textStartX, 630);
    ctx.lineTo(notchX - 50, 630);
    ctx.strokeStyle = separatorColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Details Grid values
    const gridYLabel = 675;
    const gridYVal = 715;
    ctx.font = '700 16px "JetBrains Mono", monospace';
    ctx.fillStyle = gridLabelColor;

    ctx.fillText('FLIGHT', textStartX, gridYLabel);
    ctx.fillText('SEAT', textStartX + 180, gridYLabel);
    ctx.fillText('GATE', textStartX + 360, gridYLabel);
    ctx.fillText('DATE', textStartX + 540, gridYLabel);

    ctx.font = '900 28px "Space Grotesk", sans-serif';
    ctx.fillStyle = gridValueColor;
    ctx.fillText('HH2026', textStartX, gridYVal);
    ctx.fillText('24A', textStartX + 180, gridYVal);
    ctx.fillStyle = theme.accentColor;
    ctx.fillText('08', textStartX + 360, gridYVal);
    ctx.fillStyle = gridValueColor;
    ctx.fillText('28 OCT 2026', textStartX + 540, gridYVal);

    // 7. Draw Right Column Text Details (Ticket Stub)
    const stubStartX = notchX + 40;

    ctx.textAlign = 'right';
    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.fillStyle = headingLabelColor;
    ctx.fillText('FLIGHT STUB', WIDTH - 70, 110);

    ctx.beginPath();
    ctx.moveTo(stubStartX, 140);
    ctx.lineTo(WIDTH - 70, 140);
    ctx.strokeStyle = separatorColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fill Stub background color (recessedBg)
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    drawRoundRect(ctx, notchX, 30, WIDTH - notchX - 30, HEIGHT - 60, 30);
    ctx.fillStyle = recessedBg;
    ctx.fill();
    ctx.restore();

    ctx.textAlign = 'left';
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillStyle = headingLabelColor;
    ctx.fillText('PASSENGER', stubStartX, 220);

    let stubNameSize = 26;
    if (displayNames.length > 28) stubNameSize = 18;
    else if (displayNames.length > 18) stubNameSize = 22;
    ctx.font = `900 ${stubNameSize}px "Space Grotesk", sans-serif`;
    ctx.fillStyle = passengerNameColor;

    if (displayNames.length > 16) {
      wrapText(ctx, displayNames, stubStartX, 255, 330, stubNameSize + 6);
    } else {
      ctx.fillText(displayNames, stubStartX, 265);
    }

    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillStyle = headingLabelColor;
    ctx.fillText('SEAT', stubStartX, 340);
    ctx.fillText('CLASS', stubStartX + 120, 340);

    ctx.font = '900 24px "Space Grotesk", sans-serif';
    ctx.fillStyle = gridValueColor;
    ctx.fillText('24A', stubStartX, 385);
    ctx.fillText('VIP', stubStartX + 120, 385);


    // Stub card serial number footer
    const cardNumber = details.cardNumber || 'HH26-4E90D7AC';
    ctx.textAlign = 'right';
    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.fillStyle = cardNumberColor;
    ctx.fillText(cardNumber, WIDTH - 70, HEIGHT - 110);

    // Return the generated canvas items
    const dataUrl = canvas.toDataURL('image/png');
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || new Blob()), 'image/png');
    });

    return { canvas, dataUrl, blob };
  }

  if (theme.layout === 'square') {
    const WIDTH = 1024;
    const HEIGHT = 1024;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // Load template image
    try {
      const templateImg = await loadImage('/images/card-template-combined.png');
      ctx.drawImage(templateImg, 0, 0, WIDTH, HEIGHT);
    } catch (err) {
      console.error('Failed to load card-template.png in canvas render:', err);
      // Fallback background
      ctx.fillStyle = '#052A1A';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    // Coordinates of photo frame:
    // top: 25.7%, left: 29.8%, width: 40.4%, height: 39.0%
    const photoLeft = WIDTH * 0.298;
    const photoTop = HEIGHT * 0.257;
    const photoWidth = WIDTH * 0.404;
    const photoHeight = HEIGHT * 0.390;

    // Draw user photo inside frame
    const isTeam = details.passType === 'team' && details.teammates && details.teammates.length > 0;
    if (!isTeam) {
      if (details.photoUrl) {
        try {
          ctx.save();
          // Create clipping region for the central frame
          ctx.beginPath();
          ctx.rect(photoLeft, photoTop, photoWidth, photoHeight);
          ctx.clip();

          const userImg = await loadImage(details.photoUrl);
          const { zoom = 1, panX = 0, panY = 0, rotation = 0, filter = 'none' } = details.photoTransform || {};

          ctx.save();
          // Translate to center of photo frame
          ctx.translate(photoLeft + photoWidth / 2, photoTop + photoHeight / 2);

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

          // Draw image
          const imgRatio = userImg.width / userImg.height;
          let drawW = photoWidth;
          let drawH = photoHeight;

          // Fill/cover aspect ratio inside frame
          if (imgRatio > photoWidth / photoHeight) {
            drawH = photoHeight;
            drawW = photoHeight * imgRatio;
          } else {
            drawW = photoWidth;
            drawH = photoWidth / imgRatio;
          }

          drawW *= zoom;
          drawH *= zoom;

          const offsetX = (panX / 100) * photoWidth;
          const offsetY = (panY / 100) * photoHeight;

          ctx.drawImage(userImg, -drawW / 2 + offsetX, -drawH / 2 + offsetY, drawW, drawH);
          ctx.restore(); // for filters & transforms
          ctx.restore(); // for clipping path
        } catch (err) {
          console.warn('Failed to draw user photo in canvas square render:', err);
        }
      } else {
        // Draw placeholder grey block
        ctx.fillStyle = '#27272a';
        ctx.fillRect(photoLeft, photoTop, photoWidth, photoHeight);
        ctx.font = 'bold 24px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('[ PHOTO ]', photoLeft + photoWidth / 2, photoTop + photoHeight / 2);
      }
    } else {
      // Draw Team photos centered side-by-side or overlapping
      ctx.save();
      ctx.beginPath();
      ctx.rect(photoLeft, photoTop, photoWidth, photoHeight);
      ctx.clip();

      ctx.fillStyle = '#021f14';
      ctx.fillRect(photoLeft, photoTop, photoWidth, photoHeight);

      const teamPhotos = [
        { url: details.photoUrl, transform: details.photoTransform },
        ...details.teammates!.map(t => ({ url: t.photoUrl, transform: t.photoTransform }))
      ];
      const teamSize = teamPhotos.length;
      const radius = 56; // nice circular badge radius
      const cy = photoTop + photoHeight / 2;

      for (let idx = 0; idx < teamSize; idx++) {
        let cx = photoLeft + photoWidth / 2;
        if (teamSize === 2) {
          cx = photoLeft + photoWidth / 2 + (idx === 0 ? -48 : 48);
        } else if (teamSize === 3) {
          cx = photoLeft + photoWidth / 2 + (idx === 0 ? -78 : idx === 1 ? 0 : 78);
        }
        await drawPhotoBadge(ctx, cx, cy, radius, teamPhotos[idx].url, teamPhotos[idx].transform);
      }
      ctx.restore();
    }

    // Name text:
    // top: 78.8%, left: 22.0%, width: 56.0%, height: 7.0%
    const nameText = (details.name || 'HARSH RAIKWAR').toUpperCase();
    const isTeamPass = details.passType === 'team' && details.teammates && details.teammates.length > 0;
    const displayNames = isTeamPass
      ? [nameText, ...details.teammates!.map((t) => (t.name || 'TEAMMATE').toUpperCase())].join(' & ')
      : nameText;

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Scale text if too wide for the badge
    let nameSize = 36;
    if (displayNames.length > 28) {
      nameSize = 20;
    } else if (displayNames.length > 18) {
      nameSize = 26;
    } else if (displayNames.length > 14) {
      nameSize = 30;
    }
    ctx.font = `900 ${nameSize}px "Space Grotesk", sans-serif`;

    const nameX = WIDTH * 0.5; // horizontal center
    const nameY = HEIGHT * 0.823; // vertical center of the name badge area
    ctx.fillText(`✦ ${displayNames} ✦`, nameX, nameY);

    // Role text:
    // top: 87.4%, left: 27.0%, width: 46.0%, height: 5.2%
    const roleText = (details.role || 'BUILDER / AI ML').toUpperCase();
    const displayRoles = isTeamPass
      ? Array.from(new Set([roleText, ...details.teammates!.map((t) => (t.role || 'Builder').toUpperCase())])).join(' • ')
      : roleText;

    ctx.fillStyle = '#7F1D1D'; // Deep reddish-brown
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let roleSize = 24;
    if (displayRoles.length > 20) {
      roleSize = 16;
    } else if (displayRoles.length > 12) {
      roleSize = 20;
    }
    ctx.font = `900 ${roleSize}px "Space Grotesk", sans-serif`;

    const roleX = WIDTH * 0.5; // center
    const roleY = HEIGHT * 0.9; // vertical center of yellow badge
    ctx.fillText(`⚡ ${displayRoles} ⚡`, roleX, roleY);

    // Return the generated canvas items
    const dataUrl = canvas.toDataURL('image/png');
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || new Blob()), 'image/png');
    });

    return { canvas, dataUrl, blob };
  }

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
