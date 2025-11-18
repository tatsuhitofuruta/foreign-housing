# API Documentation

## Authentication

All authenticated endpoints require a valid session cookie from NextAuth.js.

### Sign In
- **POST** `/api/auth/signin`
- Providers: Google OAuth, Email

### Sign Out
- **POST** `/api/auth/signout`

## Properties

### Get All Properties
```
GET /api/properties
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 12)
- `query` (string) - Search query
- `propertyType` (string[]) - Filter by property type
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `bedrooms` (number) - Minimum bedrooms
- `prefecture` (string) - Filter by prefecture
- `city` (string) - Filter by city
- `sortBy` (string) - Sort field (default: publishedAt)
- `sortOrder` (string) - asc/desc (default: desc)

**Response:**
```json
{
  "properties": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

### Get Property by ID
```
GET /api/properties/:id
```

**Response:**
```json
{
  "id": "...",
  "title": "...",
  "averageRating": 4.5,
  "averageRatings": {
    "location": 4.8,
    "facilities": 4.5,
    "management": 4.3,
    "value": 4.2
  },
  "reviewCount": 12,
  "reviews": [...]
}
```

## Reviews

### Create Review
```
POST /api/reviews
```

**Headers:**
- Authentication required

**Body:**
```json
{
  "propertyId": "string",
  "ratingOverall": 5,
  "ratingLocation": 5,
  "ratingFacilities": 4,
  "ratingManagement": 5,
  "ratingValue": 4,
  "title": "Great apartment",
  "comment": "Detailed review text...",
  "images": ["url1", "url2"],
  "moveInDate": "2024-01-01",
  "moveOutDate": "2024-12-31"
}
```

**Validation:**
- All ratings: 1-5
- Title: 5-200 characters
- Comment: 20-2000 characters

### Mark Review as Helpful
```
POST /api/reviews/:id/helpful
```

**Headers:**
- Authentication required

**Response:**
```json
{
  "helpful": true
}
```

## Favorites

### Get User Favorites
```
GET /api/favorites
```

**Headers:**
- Authentication required

**Response:**
```json
[
  {
    "id": "...",
    "title": "...",
    "averageRating": 4.5,
    "favoritedAt": "2024-01-15T00:00:00Z"
  }
]
```

### Toggle Favorite
```
POST /api/favorites
```

**Headers:**
- Authentication required

**Body:**
```json
{
  "propertyId": "string"
}
```

**Response:**
```json
{
  "favorited": true
}
```

## Image Upload

### Get Presigned Upload URL
```
POST /api/upload
```

**Headers:**
- Authentication required

**Body:**
```json
{
  "fileName": "image.jpg",
  "contentType": "image/jpeg",
  "folder": "reviews"
}
```

**Response:**
```json
{
  "uploadUrl": "https://...",
  "publicUrl": "https://...",
  "key": "uploads/123456-image.jpg"
}
```

**Allowed File Types:**
- image/jpeg
- image/png
- image/webp
- image/gif

**Usage:**
1. Request presigned URL from API
2. Upload file directly to S3 using presigned URL
3. Use publicUrl in your application

## Error Responses

All endpoints may return these error codes:

- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

**Error Format:**
```json
{
  "error": "Error message",
  "details": { ... }
}
```

## Rate Limiting

- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` - Page number (starting from 1)
- `limit` - Items per page (max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Sorting

Supported sort fields:
- `publishedAt` - Publication date
- `price` - Property price
- `createdAt` - Creation date
- `viewCount` - View count

Sort order:
- `asc` - Ascending
- `desc` - Descending (default)
