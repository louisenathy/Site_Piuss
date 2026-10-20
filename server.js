import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security & iFrame compatibility headers (AI Studio previews run in an iframe)
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

const websiteDir = path.join(__dirname, 'website');
const dataDir = path.join(__dirname, 'data');
const distPainelDir = path.join(__dirname, 'dist_painel');

// Serve static assets from website directory
app.use(express.static(websiteDir));

// Serve data assets
app.use('/data', express.static(dataDir));
app.use('/dist_painel', express.static(distPainelDir));

// Route aliases for painel de resgate
app.get(['/painel', '/painel_resgate', '/painel_resgate.html', '/resgate'], (req, res) => {
  res.sendFile(path.join(websiteDir, 'painel_resgate.html'));
});

// Fallback to website/index.html for client-side navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(websiteDir, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Piuss server is running at http://0.0.0.0:${PORT}`);
});
