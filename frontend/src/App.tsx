import React, { useState } from 'react';
import { createShortUrl, getUrlInfo, getUrlAnalytics, deleteUrl } from './services/api';
import { UrlInfo, UrlAnalytics } from './types';

const App: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [urlInfo, setUrlInfo] = useState<UrlInfo | null>(null);
  const [analytics, setAnalytics] = useState<UrlAnalytics | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createShortUrl({
        originalUrl,
        alias: alias || undefined,
        expiresAt: expiresAt || undefined,
      });
      setShortUrl(result);
      setError('');
    } catch (err) {
      setError('Failed to create short URL');
    }
  };

  const handleGetInfo = async () => {
    try {
      const info = await getUrlInfo(shortUrl);
      setUrlInfo(info);
      setError('');
    } catch (err) {
      setError('Failed to get URL info');
    }
  };

  const handleGetAnalytics = async () => {
    try {
      const data = await getUrlAnalytics(shortUrl);
      setAnalytics(data);
      setError('');
    } catch (err) {
      setError('Failed to get analytics');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUrl(shortUrl);
      setShortUrl('');
      setUrlInfo(null);
      setAnalytics(null);
      setError('');
    } catch (err) {
      setError('Failed to delete URL');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">URL Shortener</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block mb-2">Original URL:</label>
          <input
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Custom Alias (optional):</label>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            maxLength={20}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Expires At (optional):</label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Short URL
        </button>
      </form>

      {shortUrl && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Short URL:</h2>
          <a
            href={`http://localhost:4000/${shortUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {`http://localhost:4000/${shortUrl}`}
          </a>

          <div className="mt-4 space-x-2">
            <button
              onClick={handleGetInfo}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Get Info
            </button>
            <button
              onClick={handleGetAnalytics}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Get Analytics
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete URL
            </button>
          </div>
        </div>
      )}

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {urlInfo && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">URL Info:</h2>
          <p>Original URL: {urlInfo.originalUrl}</p>
          <p>Created At: {new Date(urlInfo.createdAt).toLocaleString()}</p>
          <p>Click Count: {urlInfo.clickCount}</p>
        </div>
      )}

      {analytics && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Analytics:</h2>
          <p>Click Count: {analytics.clickCount}</p>
          <h3 className="font-bold mt-2">Recent Visitors:</h3>
          <ul className="list-disc pl-6">
            {analytics.recentVisitors.map((ip, index) => (
              <li key={index}>{ip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App; 