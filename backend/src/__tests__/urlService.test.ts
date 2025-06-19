import { PrismaClient } from '@prisma/client';
import { UrlService } from '../services/urlService';
import { CreateShortUrlRequest } from '../types';

const prisma = new PrismaClient();
const urlService = new UrlService();

describe('UrlService', () => {
  beforeEach(async () => {
    await prisma.urlVisit.deleteMany();
    await prisma.shortUrl.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createShortUrl', () => {
    it('should create a short URL with custom alias', async () => {
      const data: CreateShortUrlRequest = {
        originalUrl: 'https://example.com',
        alias: 'custom',
      };

      const shortUrl = await urlService.createShortUrl(data);
      expect(shortUrl).toBe('custom');

      const url = await prisma.shortUrl.findUnique({
        where: { shortUrl },
      });

      expect(url).toBeTruthy();
      expect(url?.originalUrl).toBe(data.originalUrl);
      expect(url?.alias).toBe(data.alias);
    });

    it('should throw error for duplicate alias', async () => {
      const data: CreateShortUrlRequest = {
        originalUrl: 'https://example.com',
        alias: 'custom',
      };

      await urlService.createShortUrl(data);

      await expect(urlService.createShortUrl(data)).rejects.toThrow('Alias already exists');
    });
  });

  describe('getOriginalUrl', () => {
    it('should return original URL and increment click count', async () => {
      const data: CreateShortUrlRequest = {
        originalUrl: 'https://example.com',
        alias: 'test',
      };

      const shortUrl = await urlService.createShortUrl(data);
      const originalUrl = await urlService.getOriginalUrl(shortUrl);

      expect(originalUrl).toBe(data.originalUrl);

      const url = await prisma.shortUrl.findUnique({
        where: { shortUrl },
      });

      expect(url?.clickCount).toBe(1);
    });

    it('should throw error for non-existent URL', async () => {
      await expect(urlService.getOriginalUrl('nonexistent')).rejects.toThrow('URL not found');
    });
  });
}); 