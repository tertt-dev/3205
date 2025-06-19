import express from 'express';
import cors from 'cors';
import { UrlService } from './services/urlService';
import { CreateShortUrlSchema } from './types';

const app = express();
const port = process.env.PORT || 4000;
const urlService = new UrlService();

app.use(cors());
app.use(express.json());

// Create short URL
app.post('/shorten', async (req, res) => {
  try {
    const validatedData = CreateShortUrlSchema.parse(req.body);
    const shortUrl = await urlService.createShortUrl(validatedData);
    res.json({ shortUrl });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Redirect to original URL
app.get('/:shortUrl', async (req, res) => {
  try {
    const originalUrl = await urlService.getOriginalUrl(req.params.shortUrl);
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    await urlService.recordVisit(req.params.shortUrl, ipAddress);
    res.redirect(originalUrl);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get URL info
app.get('/info/:shortUrl', async (req, res) => {
  try {
    const info = await urlService.getUrlInfo(req.params.shortUrl);
    res.json(info);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Delete URL
app.delete('/delete/:shortUrl', async (req, res) => {
  try {
    await urlService.deleteUrl(req.params.shortUrl);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get analytics
app.get('/analytics/:shortUrl', async (req, res) => {
  try {
    const analytics = await urlService.getAnalytics(req.params.shortUrl);
    res.json(analytics);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 