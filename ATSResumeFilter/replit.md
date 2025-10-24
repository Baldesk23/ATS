# Filtro ATS - Sistema de Gestión de Candidatos

## Overview

Filtro ATS is a dual-mode applicant tracking system (ATS) for the San Roque school. The application serves two primary user types:

1. **Applicants**: Can upload CVs/resumes for job consideration
2. **Moderators**: Can publish job offers and manage the recruitment process

The system features a single-page application with role-based UI switching, where moderators access additional functionality through password authentication. The application is designed with Material Design principles for a clean, trustworthy, and efficient user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool

**UI Component System**: 
- Shadcn/ui component library (new-york style variant)
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling with custom design tokens
- Design system follows Material Design principles with focus on clarity and consistency

**Routing**: Wouter for lightweight client-side routing

**State Management**:
- React Query (TanStack Query) for server state management
- Local component state with React hooks
- No global state management library currently implemented

**Form Handling**: React Hook Form with Zod validation resolvers

**Key Design Decisions**:
- Single-column centered layout (max-width: 672px for forms, 640px for cards)
- Typography using Inter or DM Sans from Google Fonts
- Consistent spacing using Tailwind's spacing scale (2, 4, 6, 8, 12, 16, 24, 32)
- Card-based UI with 16px border radius and subtle shadows
- Responsive design with mobile-first approach

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**Architecture Pattern**: RESTful API structure (currently minimal implementation)

**Data Layer**: 
- In-memory storage implementation (`MemStorage` class)
- Interface-based design (`IStorage`) allowing easy swapping of storage implementations
- Prepared for future database integration with Drizzle ORM

**Development Setup**:
- Vite middleware mode for HMR during development
- Separate build process for client and server
- TypeScript compilation for type safety across stack

**Authentication**: 
- Currently uses hardcoded password ("Sanro") for moderator access
- Client-side password validation (no session management implemented)
- No user authentication system for applicants

**Key Design Decisions**:
- Modular route registration system
- Request/response logging middleware for API endpoints
- Raw body capture for potential webhook integrations
- Path aliasing for clean imports (@/, @shared/, @assets/)

### External Dependencies

**Firebase Services**:
- **Firebase Storage**: File storage for uploaded CVs and resumes
- **Firebase Firestore**: Document database for storing:
  - CV metadata and download URLs
  - Job offer descriptions and timestamps
- Configuration stored in client-side code with public API keys

**Database Preparation**:
- Drizzle ORM configured for PostgreSQL (schema defined but not actively used)
- Neon Database serverless PostgreSQL driver included
- Schema includes basic user table with username/password fields
- Migration system configured but application currently uses Firebase instead

**Third-Party UI Libraries**:
- Multiple Radix UI primitives for accessible components
- Embla Carousel for carousel functionality
- CMDK for command palette interface
- Lucide React for icons
- Class Variance Authority for variant-based styling
- date-fns for date manipulation

**Development Tools**:
- Replit-specific plugins for development banner and error overlay
- ESBuild for server bundling in production
- PostCSS with Tailwind and Autoprefixer

**Key Integration Points**:
- Firebase SDK initialized in `client/src/lib/firebase.ts`
- File uploads flow: Client → Firebase Storage → Firestore metadata
- No backend API integration for Firebase operations (all client-side)
- Future migration path exists to PostgreSQL with Drizzle schema

**Notable Architectural Considerations**:
- Firebase operations handled entirely on client-side (security rules should be configured in Firebase console)
- No authentication tokens or session management implemented
- Password-based role switching without persistent sessions
- Express backend currently serves as static file server and API placeholder