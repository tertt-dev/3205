import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { CreateShortUrlRequest, ShortUrlInfo, UrlAnalytics } from '../types';

const prisma = new PrismaClient();

export class UrlService {
  private generateShortUrl(alias?: string): string {
    return alias || nanoid(8);
  }

  async createShortUrl(data: CreateShortUrlRequest): Promise<string> {
    const shortUrl = this.generateShortUrl(data.alias);
    
    if (data.alias) {
      const existing = await prisma.shortUrl.findUnique({
        where: { alias: data.alias }
      });
      if (existing) {
        throw new Error('Alias already exists');
      }
    }

    const url = await prisma.shortUrl.create({
      data: {
        originalUrl: data.originalUrl,
        shortUrl,
        alias: data.alias,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });

    return url.shortUrl;
  }

  async getOriginalUrl(shortUrl: string): Promise<string> {
    const url = await prisma.shortUrl.findUnique({
      where: { shortUrl },
    });

    if (!url) {
      throw new Error('URL not found');
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new Error('URL has expired');
    }

    await prisma.shortUrl.update({
      where: { id: url.id },
      data: { clickCount: { increment: 1 } },
    });

    return url.originalUrl;
  }

  async getUrlInfo(shortUrl: string): Promise<ShortUrlInfo> {
    const url = await prisma.shortUrl.findUnique({
      where: { shortUrl },
    });

    if (!url) {
      throw new Error('URL not found');
    }

    return {
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      clickCount: url.clickCount,
    };
  }

  async deleteUrl(shortUrl: string): Promise<void> {
    const url = await prisma.shortUrl.findUnique({
      where: { shortUrl },
    });

    if (!url) {
      throw new Error('URL not found');
    }

    await prisma.shortUrl.delete({
      where: { id: url.id },
    });
  }

  async recordVisit(shortUrl: string, ipAddress: string): Promise<void> {
    const url = await prisma.shortUrl.findUnique({
      where: { shortUrl },
    });

    if (!url) {
      throw new Error('URL not found');
    }

    await prisma.urlVisit.create({
      data: {
        shortUrlId: url.id,
        ipAddress,
      },
    });
  }

  async getAnalytics(shortUrl: string): Promise<UrlAnalytics> {
    const url = await prisma.shortUrl.findUnique({
      where: { shortUrl },
      include: {
        visits: {
          orderBy: { visitedAt: 'desc' },
          take: 5,
          select: { ipAddress: true },
        },
      },
    });

    if (!url) {
      throw new Error('URL not found');
    }

    return {
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      clickCount: url.clickCount,
      recentVisitors: url.visits.map(visit => visit.ipAddress),
    };
  }
} 