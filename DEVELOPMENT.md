# CleanHealth AI - Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
Create `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Run Development Server
```bash
npm run dev
```
Visit: http://localhost:3000

## 📦 Project Structure

See [STRUCTURE.md](./STRUCTURE.md) for detailed architecture documentation.

```
CleanHealth-AI/
├── src/               # Frontend application
│   ├── features/      # Feature modules
│   ├── components/    # Reusable components
│   ├── services/      # External services
│   ├── pages/         # Page components
│   └── ...
├── server/            # Backend API (to be implemented)
├── shared/            # Shared code between frontend/backend
└── public/            # Static assets
```

## 🛠️ Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## 🎨 Adding New Features

1. Create feature directory:
```bash
mkdir src/features/my-feature
```

2. Create feature files:
```
src/features/my-feature/
├── index.ts                    # Export public API
├── MyFeatureView.tsx          # Main component
├── components/                 # Feature components
├── hooks/                      # Feature hooks
└── types.ts                    # Feature types
```

3. Use path aliases:
```typescript
import { MyFeatureView } from '@features/my-feature';
```

## 📝 Code Style

- Use TypeScript for all new files
- Follow ESLint rules
- Use functional components with hooks
- Keep components small and focused
- Use descriptive variable names

## 🔧 Path Aliases

Available aliases:
- `@/` - src/
- `@components/` - src/components/
- `@features/` - src/features/
- `@services/` - src/services/
- `@hooks/` - src/hooks/
- `@utils/` - src/utils/
- `@types/` - src/types/
- `@config/` - src/config/
- `@store/` - src/store/
- `@shared/` - shared/

## 🧪 Testing (To Be Implemented)

```bash
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
Connect your repository and deploy automatically.

## 📚 Learn More

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Vite Documentation](https://vitejs.dev)
- [Google AI Gemini](https://ai.google.dev)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -m 'Add my feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Open Pull Request

## 📄 License

MIT
