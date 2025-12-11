# Server Directory

Backend API server for CleanHealth AI application.

## Structure

```
server/
├── controllers/      # Request handlers - handle HTTP requests/responses
├── models/          # Database schemas and models
├── routes/          # API route definitions
├── middleware/      # Express middleware (auth, validation, etc.)
├── services/        # Business logic layer
├── config/          # Configuration (database, env, etc.)
├── utils/           # Helper functions
├── types/           # TypeScript type definitions
└── validators/      # Request validation schemas
```

## Getting Started (To Be Implemented)

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Setup
Create `server/.env`:
```
PORT=5000
NODE_ENV=development
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_api_key
JWT_SECRET=your_jwt_secret
```

### 3. Run Server
```bash
npm run dev        # Development with hot reload
npm run build      # Build for production
npm start          # Run production build
```

## Planned API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Analysis
- `POST /api/analysis/document` - Analyze medical document
- `POST /api/analysis/image` - Analyze symptom image
- `GET /api/analysis/:id` - Get analysis result
- `GET /api/analysis/history` - User's analysis history

### Chat
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/history/:analysisId` - Get chat history

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/reports` - Get saved reports

## Best Practices

1. **Controllers**: Keep thin, delegate to services
2. **Services**: Contain business logic
3. **Models**: Define data structure and validation
4. **Middleware**: Reusable request processing (auth, logging, etc.)
5. **Error Handling**: Use centralized error handling middleware
6. **Validation**: Validate all inputs using validators
7. **Security**: Implement rate limiting, CORS, helmet
