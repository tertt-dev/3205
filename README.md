# URL Shortener

A full-stack URL shortener application built with TypeScript, React, Express.js, and PostgreSQL.

## Features

- Create short URLs with optional custom aliases
- Set expiration dates for URLs
- Track click counts and visitor analytics
- Modern, responsive UI with Tailwind CSS
- Docker support for easy deployment

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd url-shortener
```

2. Start the application:
```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## API Endpoints

### Create Short URL
```
POST /shorten
{
  "originalUrl": "https://example.com",
  "alias": "custom-alias",  // optional
  "expiresAt": "2024-12-31T23:59:59Z"  // optional
}
```

### Redirect to Original URL
```
GET /:shortUrl
```

### Get URL Info
```
GET /info/:shortUrl
```

### Get URL Analytics
```
GET /analytics/:shortUrl
```

### Delete URL
```
DELETE /delete/:shortUrl
```

## Development

### Frontend
The frontend is built with:
- React
- TypeScript
- Tailwind CSS
- Axios for API calls

### Backend
The backend uses:
- Express.js
- TypeScript
- PostgreSQL with Prisma ORM
- Jest for testing

## Testing

To run the tests:
```bash
# Backend tests
cd backend
yarn test
``` 