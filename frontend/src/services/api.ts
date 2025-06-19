import axios from 'axios';
import { CreateUrlRequest, UrlInfo, UrlAnalytics } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
});

export const createShortUrl = async (data: CreateUrlRequest): Promise<string> => {
  const response = await api.post<{ shortUrl: string }>('/shorten', data);
  return response.data.shortUrl;
};

export const getUrlInfo = async (shortUrl: string): Promise<UrlInfo> => {
  const response = await api.get<UrlInfo>(`/info/${shortUrl}`);
  return response.data;
};

export const getUrlAnalytics = async (shortUrl: string): Promise<UrlAnalytics> => {
  const response = await api.get<UrlAnalytics>(`/analytics/${shortUrl}`);
  return response.data;
};

export const deleteUrl = async (shortUrl: string): Promise<void> => {
  await api.delete(`/delete/${shortUrl}`);
}; 