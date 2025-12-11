# Features Directory

This directory contains feature-based modules. Each feature is a self-contained unit with its own components, hooks, types, and logic.

## Current Features

### 📊 Analysis (`/analysis`)
Medical document and image analysis
- `AnalysisView.tsx` - Main analysis display component
- Handles lab reports, doctor's notes, symptom images

### 💬 Chat (`/chat`)
AI-powered chat widget
- `ChatWidget.tsx` - Interactive chat interface
- Context-aware medical Q&A

### 📤 Upload (`/upload`)
File upload functionality (to be implemented)
- Document upload
- Image upload
- File validation

### 🔐 Auth (`/auth`)
Authentication and authorization (to be implemented)
- Login/Register
- User profiles
- Session management

## Adding a New Feature

1. Create a new directory: `src/features/[feature-name]/`
2. Structure your feature:
```
feature-name/
├── index.ts                 # Public API exports
├── [FeatureName]View.tsx   # Main component
├── components/              # Feature-specific components
├── hooks/                   # Feature-specific hooks
├── types.ts                 # Feature-specific types
└── utils.ts                 # Feature-specific utilities
```

3. Export from `index.ts`:
```typescript
export { FeatureNameView } from './FeatureNameView';
export type { FeatureNameProps } from './types';
```

4. Use in pages:
```typescript
import { FeatureNameView } from '@features/feature-name';
```
