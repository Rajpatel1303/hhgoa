import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory card storage for shareable cards (allows share link previews)
interface SavedCard {
  id: string;
  name: string;
  role: string;
  stack: string;
  builderTitle: string;
  cardNumber: string;
  photoUrl: string;
  cardImage?: string;
  createdAt: number;
}

const cardStore = new Map<string, SavedCard>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', event: 'Hacker House Goa 2026' });
  });

  // Save card endpoint
  app.post('/api/cards', (req, res) => {
    try {
      const { name, role, stack, builderTitle, cardNumber, photoUrl, cardImage } = req.body;
      const id = Math.random().toString(36).substring(2, 9);
      
      const card: SavedCard = {
        id,
        name: name || 'Builder',
        role: role || 'Developer',
        stack: stack || 'Python / AI / Web',
        builderTitle: builderTitle || 'THE SHIPPER',
        cardNumber: cardNumber || 'HHG26 / 0000',
        photoUrl: photoUrl || '',
        cardImage: cardImage || '',
        createdAt: Date.now(),
      };

      cardStore.set(id, card);
      res.json({ success: true, id, shareUrl: `/share/${id}` });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save card' });
    }
  });

  // Get card endpoint
  app.get('/api/cards/:id', (req, res) => {
    const card = cardStore.get(req.params.id);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  });

  // Serve binary card image for OpenGraph crawler
  app.get('/api/cards/:id/image', (req, res) => {
    const card = cardStore.get(req.params.id);
    if (!card || !card.cardImage) {
      return res.status(404).send('Image not found');
    }

    try {
      const base64Data = card.cardImage.replace(/^data:image\/png;base64,/, '');
      const imgBuffer = Buffer.from(base64Data, 'base64');
      
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': imgBuffer.length
      });
      res.end(imgBuffer);
    } catch (e) {
      res.status(500).send('Error decoding image');
    }
  });

  // Share Page HTML route with OpenGraph tags
  app.get('/share/:id', (req, res, next) => {
    const card = cardStore.get(req.params.id);
    if (!card) {
      return next(); // Fallback to SPA
    }

    const hostUrl = `${req.protocol}://${req.get('host')}`;
    const html = `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${card.name}'s HH Goa 2026 Builder Pass [ ${card.builderTitle} ]</title>
    <meta name="description" content="HH Goa 2026 Builder Pass for ${card.name} (${card.role} • ${card.stack}). #FrameInGoa" />
    
    <!-- Open Graph / Twitter -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${card.name}'s HH Goa 2026 Builder Pass — ${card.builderTitle}" />
    <meta property="og:description" content="HH Goa 2026 Builder Pass for ${card.name} (${card.role} • ${card.stack}). #FrameInGoa" />
    <meta property="og:image" content="${hostUrl}/api/cards/${card.id}/image" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${card.name} — ${card.builderTitle} | HH Goa 2026 Pass" />
    <meta name="twitter:description" content="See you in Goa. 🌴 #FrameInGoa #HHGoa2026" />
    <meta name="twitter:image" content="${hostUrl}/api/cards/${card.id}/image" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;800&family=Plus+Jakarta+Sans:wght@500;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#0b0c0e] text-white min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    res.send(html);
  });

  // Vite Middleware for Dev / Static Files for Prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HH Goa 2026 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
