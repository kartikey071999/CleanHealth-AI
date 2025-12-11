# Project Structure

This is a full-stack health analysis application with a modular architecture.

## 📁 Directory Structure

```
CleanHealth-AI/
├── src/                          # Frontend source code
│   ├── assets/                   # Static assets
│   │   ├── images/              # Image files
│   │   ├── icons/               # Icon files
│   │   └── styles/              # Global styles, themes
│   │
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Shared components (ThinkingIndicator, etc.)
│   │   ├── ui/                  # UI primitives (Button, Input, Card, etc.)
│   │   └── layout/              # Layout components (Header, Footer, Sidebar)
│   │
│   ├── features/                # Feature-based modules
│   │   ├── analysis/            # Medical analysis feature
│   │   ├── chat/                # Chat widget feature
│   │   ├── upload/              # File upload feature
│   │   └── auth/                # Authentication feature
│   │
│   ├── hooks/                   # Custom React hooks
│   │
│   ├── layouts/                 # Page layouts
│   │
│   ├── pages/                   # Page components (App.tsx, etc.)
│   │
│   ├── services/                # External services
│   │   ├── api/                 # API client services
│   │   └── ai/                  # AI/ML services (Gemini, etc.)
│   │
│   ├── store/                   # State management
│   │   └── slices/              # Redux/Zustand slices
│   │
│   ├── types/                   # TypeScript type definitions
│   │
│   ├── utils/                   # Utility functions
│   │
│   ├── config/                  # Configuration files
│   │
│   └── index.tsx                # Application entry point
│
├── server/                      # Backend source code
│   ├── controllers/             # Request handlers
│   │
│   ├── models/                  # Database models/schemas
│   │
│   ├── routes/                  # API routes
│   │
│   ├── middleware/              # Express middleware
│   │
│   ├── services/                # Business logic
│   │   ├── ai/                  # AI service integrations
│   │   └── database/            # Database services
│   │
│   ├── config/                  # Server configuration
│   │
│   ├── utils/                   # Helper functions
│   │
│   ├── types/                   # TypeScript types
│   │
│   └── validators/              # Input validation schemas
│
├── shared/                      # Code shared between client & server
│   ├── types/                   # Shared TypeScript types
│   ├── constants/               # Shared constants
│   └── utils/                   # Shared utility functions
│
├── public/                      # Static files
│
└── tests/                       # Test files
    ├── unit/                    # Unit tests
    ├── integration/             # Integration tests
    └── e2e/                     # End-to-end tests
```

## 🏗️ Architecture Principles

### Frontend (src/)
- **Feature-based**: Each feature is self-contained in `features/` with its own components, hooks, and logic
- **Component hierarchy**: `components/common` → `components/ui` → `features/` → `pages/`
- **Path aliases**: Use `@components`, `@features`, `@services`, etc. for cleaner imports

### Backend (server/)
- **MVC pattern**: Models, Controllers, Routes separated
- **Service layer**: Business logic in `services/`
- **Middleware**: Authentication, validation, error handling

### Shared (shared/)
- Code reused between frontend and backend
- Type definitions for API contracts
- Common utilities and constants

## 🔧 Path Aliases

You can use these aliases in your imports:

```typescript
import { Button } from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';
import { analyzeDocument } from '@services/ai/geminiService';
import { AnalysisResult } from '@types';
import { API_URL } from '@config/constants';
```

## 🚀 Adding New Features

1. Create a new folder in `src/features/[feature-name]/`
2. Add feature-specific components, hooks, and types
3. Export public API from `index.ts`
4. Import in pages or other features using `@features/[feature-name]`

## 📝 Naming Conventions

- **Components**: PascalCase (e.g., `AnalysisView.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAnalysis.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)
- **Types**: PascalCase (e.g., `AnalysisResult`)
