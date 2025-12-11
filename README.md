<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CleanHealth AI - Full Stack Medical Analysis Platform

A modern, scalable full-stack application for medical document analysis and health consultation powered by Google's Gemini AI.

## 🌟 Features

- 📄 **Medical Document Analysis** - Lab reports, doctor's notes, clinical summaries
- 🖼️ **Symptom Image Analysis** - Visual symptom assessment
- 💬 **AI-Powered Chat** - Context-aware medical Q&A
- 🔊 **Audio Summaries** - Text-to-speech for analysis results
- 🏥 **Specialist Finder** - Location-based specialist recommendations
- 📱 **Responsive Design** - Works on all devices

## 🏗️ Architecture

This project uses a **modular, feature-based architecture** designed for scalability:

```
CleanHealth-AI/
├── src/           # Frontend (React + TypeScript + Vite)
├── server/        # Backend API (Node.js + Express) - To be implemented
├── shared/        # Shared code between frontend/backend
└── public/        # Static assets
```

📖 **[View Complete Structure Documentation](./STRUCTURE.md)**

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Gemini API key ([Get one here](https://ai.google.dev))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kartikey071999/CleanHealth-AI.git
   cd CleanHealth-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 📦 Available Scripts

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Build for production
npm run preview   # Preview production build
```

## 🎯 Project Structure

### Frontend (`src/`)

- **`features/`** - Feature modules (analysis, chat, upload, auth)
- **`components/`** - Reusable UI components
- **`services/`** - External service integrations (API, AI)
- **`pages/`** - Page components
- **`hooks/`** - Custom React hooks
- **`utils/`** - Utility functions
- **`types/`** - TypeScript type definitions
- **`config/`** - Configuration files

### Backend (`server/`) - To Be Implemented

- **`controllers/`** - Request handlers
- **`routes/`** - API route definitions
- **`models/`** - Database schemas
- **`services/`** - Business logic
- **`middleware/`** - Express middleware

### Shared (`shared/`)

- **`types/`** - Shared TypeScript types
- **`constants/`** - Shared constants
- **`utils/`** - Shared utilities

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling (via CDN)
- **Lucide React** - Icons
- **Google Gemini AI** - AI/ML capabilities

### Backend (Planned)
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB/PostgreSQL** - Database
- **JWT** - Authentication
- **Socket.io** - Real-time features

## 💡 Adding New Features

See **[DEVELOPMENT.md](./DEVELOPMENT.md)** for detailed development guidelines.

### Quick Feature Template

1. Create feature directory:
   ```bash
   mkdir src/features/my-feature
   ```

2. Add feature files:
   ```
   src/features/my-feature/
   ├── index.ts              # Public API exports
   ├── MyFeatureView.tsx     # Main component
   ├── components/           # Feature components
   ├── hooks/                # Feature hooks
   └── types.ts              # Feature types
   ```

3. Use path aliases:
   ```typescript
   import { MyFeatureView } from '@features/my-feature';
   ```

## 🔧 Path Aliases

The project uses path aliases for cleaner imports:

```typescript
@/          → src/
@components → src/components/
@features   → src/features/
@services   → src/services/
@hooks      → src/hooks/
@utils      → src/utils/
@types      → src/types/
@config     → src/config/
@shared     → shared/
```

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting platform

### Environment Variables

Set these on your hosting platform:
- `GEMINI_API_KEY` - Your Gemini API key

## 📚 Documentation

- **[STRUCTURE.md](./STRUCTURE.md)** - Complete architecture documentation
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development guidelines
- **[server/README.md](./server/README.md)** - Backend documentation
- **[src/features/README.md](./src/features/README.md)** - Features documentation

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **AI Studio App**: https://ai.studio/apps/drive/12a2Z0Hj8YqD4y_S97ZCyqk_9lGPcDTWf
- **Repository**: https://github.com/kartikey071999/CleanHealth-AI

## ⚠️ Medical Disclaimer

This application is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

---

**Built with ❤️ using React, TypeScript, and Google Gemini AI**
