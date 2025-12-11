// Shared constants between client and server

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  ANALYSIS: {
    DOCUMENT: '/api/analysis/document',
    IMAGE: '/api/analysis/image',
    GET: '/api/analysis/:id',
    HISTORY: '/api/analysis/history',
  },
  CHAT: {
    MESSAGE: '/api/chat/message',
    HISTORY: '/api/chat/history/:analysisId',
  },
  USER: {
    PROFILE: '/api/user/profile',
    REPORTS: '/api/user/reports',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You must be logged in to access this resource',
  FORBIDDEN: 'You do not have permission to access this resource',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
} as const;
