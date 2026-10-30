# Bennett University Portal

A modern university portal application built with Next.js 15, featuring AI-powered personalized news feeds and comprehensive student management features.

## Features

- 🎓 Student profile management
- 📊 Attendance tracking
- 📚 Course registration
- 📰 AI-powered personalized news feed (using Genkit + Google Gemini)
- 🍽️ Cafeteria menu
- 📅 Timetable and exam schedules
- 💰 Payment and dues management
- 📝 Leave and gate pass requests
- 🏠 Room partner selection
- And more...

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Appwrite (BaaS)
- **AI**: Genkit with Google Gemini
- **Deployment**: Vercel/Netlify (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Appwrite Cloud account (free at https://cloud.appwrite.io)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd mycamu
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_COLLECTION_STUDENTS=students
NEXT_PUBLIC_APPWRITE_COLLECTION_ATTENDANCE=attendance
NEXT_PUBLIC_APPWRITE_COLLECTION_COURSES=courses
NEXT_PUBLIC_APPWRITE_COLLECTION_ANNOUNCEMENTS=announcements
GEMINI_API_KEY=your-gemini-api-key
```

4. Set up Appwrite
- See `APPWRITE_MIGRATION.md` for detailed setup instructions
- Create database and collections
- Enable authentication

5. Run development server
```bash
npm run dev
```

6. Open [http://localhost:9002](http://localhost:9002)

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/        # React components
├── lib/              # Utilities and services
├── contexts/         # React contexts
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── ai/               # AI flows (Genkit)
```

## Migration from Local Server

This project has been migrated from a local server setup to use Appwrite BaaS. See:
- `MIGRATION_SUMMARY.md` - Quick overview of changes
- `APPWRITE_MIGRATION.md` - Detailed migration guide

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run genkit:dev` - Start Genkit AI server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Deploy to Netlify

1. Push code to GitHub
2. Import project in Netlify
3. Add environment variables
4. Deploy

## Documentation

- [Migration Summary](./MIGRATION_SUMMARY.md) - Overview of Appwrite migration
- [Appwrite Migration Guide](./APPWRITE_MIGRATION.md) - Detailed setup instructions
- [Appwrite Docs](https://appwrite.io/docs) - Appwrite documentation

## License

Private project for Bennett University
