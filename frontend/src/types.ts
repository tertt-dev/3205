export interface CreateUrlRequest {
  originalUrl: string;
  expiresAt?: string;
  alias?: string;
}

export interface UrlInfo {
  originalUrl: string;
  createdAt: string;
  clickCount: number;
}

export interface UrlAnalytics extends UrlInfo {
  recentVisitors: string[];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
} 