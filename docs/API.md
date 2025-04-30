# BugSage API Documentation

## Authentication

All API endpoints require authentication using Clerk JWT tokens. The token should be included in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Analyze Logs

Analyzes provided logs and returns AI-powered insights.

**Endpoint:** `POST /api/analyze`

**Request Body:**
```json
{
  "logs": "string", // The logs to analyze
  "context": {
    "frontend": "string", // Frontend technology stack
    "backend": "string",  // Backend technology stack
    "platform": "string"  // Platform/environment
  }
}
```

**Response:**
```json
{
  "analysis": "string" // The AI-generated analysis
}
```

**Error Responses:**
- 400: Invalid input
- 401: Unauthorized
- 500: Server error

### Get Analysis History

Retrieves the user's analysis history.

**Endpoint:** `GET /api/history`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `sortBy`: Field to sort by (date|context)
- `sortOrder`: Sort order (asc|desc)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "logs": "string",
      "context": {
        "frontend": "string",
        "backend": "string",
        "platform": "string"
      },
      "analysis": "string",
      "created_at": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### Update Analysis

Updates an existing analysis.

**Endpoint:** `PUT /api/history/:id`

**Request Body:**
```json
{
  "analysis": "string" // Updated analysis text
}
```

**Response:**
```json
{
  "success": true
}
```

### Delete Analysis

Deletes an analysis from history.

**Endpoint:** `DELETE /api/history/:id`

**Response:**
```json
{
  "success": true
}
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": {
    "message": "string",
    "code": "string"
  }
}
```

Common error codes:
- `AUTH_REQUIRED`: Authentication required
- `INVALID_INPUT`: Invalid request parameters
- `NOT_FOUND`: Resource not found
- `SERVER_ERROR`: Internal server error

## Rate Limiting

API requests are limited to:
- 100 requests per minute per user
- 1000 requests per hour per user

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests per time window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time until rate limit resets (Unix timestamp) 