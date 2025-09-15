# The Great Wall of Essays

## Overview

The Great Wall of Essays is a full-stack web application that allows anonymous users to recommend essays to the community. The platform features a Pinterest-style masonry grid layout where users can submit essay recommendations with details like title, author, reasoning, and source content. Users can recommend essays through links, text content, or both, with an elegant card-based interface that supports smooth animations and user interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and developer experience
- **Styling**: TailwindCSS for utility-first styling with shadcn/ui component library for consistent UI elements
- **Animations**: Framer Motion for smooth transitions, hover effects, and entrance animations
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Framework**: Express.js with TypeScript for the REST API server
- **Database**: JSON file-based storage using Lowdb for simplicity and development ease
- **Schema Validation**: Zod schemas shared between frontend and backend for consistent data validation
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Development**: Hot module replacement and concurrent client/server development

### Component Structure
- **MasonryGrid**: Pinterest-style responsive grid layout for displaying essay cards
- **PostCard**: Individual essay recommendation cards with hover animations and interaction buttons
- **NewPostForm**: Multi-step form for submitting essay recommendations with real-time validation
- **ModalViewer**: Full-screen modal for viewing text-based essay content
- **UndoToast**: 10-second undo functionality after essay submission with edit/delete options

### Data Model
The application centers around an Essay entity with the following schema:
- `id`: Unique identifier
- `title`: Essay title (required)
- `author`: Essay author (required) 
- `why`: User's recommendation reasoning (required)
- `sourceType`: Content delivery method (automatically detected based on content - "link" for URLs, "text" for direct content)
- `source`: Either URL link or full text content (automatically handled - URLs show "Read Now" button, text displays directly in cards)
- `pseudonym`: Optional user identifier for attribution
- `createdAt`: Timestamp for chronological ordering

### API Design
RESTful API endpoints following conventional patterns:
- `GET /api/essays` - Paginated essay retrieval with query parameters
- `POST /api/essays` - Essay creation with validation
- `GET /api/essays/:id` - Individual essay retrieval
- `PUT /api/essays/:id` - Essay updates (for undo functionality)
- `DELETE /api/essays/:id` - Essay deletion (for undo functionality)

### Development Experience
- **Concurrent Development**: Single `npm run dev` command runs both client and server simultaneously
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Hot Reloading**: Vite HMR for frontend changes and tsx for backend TypeScript execution
- **Path Aliases**: Configured import aliases for clean import statements (@/, @shared/)

## External Dependencies

### Database
- **Lowdb**: JSON file-based database for storing essays and user data in `db.json`
- **@neondatabase/serverless**: PostgreSQL adapter configured for potential database migration

### UI and Styling
- **shadcn/ui**: Comprehensive React component library built on Radix UI primitives
- **TailwindCSS**: Utility-first CSS framework with custom theme configuration
- **Radix UI**: Unstyled, accessible component primitives for complex interactions
- **Framer Motion**: Animation library for smooth transitions and micro-interactions

### Development and Build Tools
- **Vite**: Frontend build tool with React plugin and development server
- **TypeScript**: Type checking and enhanced developer experience
- **ESBuild**: Fast bundling for production server builds
- **PostCSS**: CSS processing with Autoprefixer for cross-browser compatibility

### Data Management
- **TanStack Query**: Server state management, caching, and data synchronization
- **React Hook Form**: Form state management with minimal re-renders
- **Zod**: Runtime type validation and schema definition
- **date-fns**: Date formatting and manipulation utilities

### Deployment and Runtime
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **connect-pg-simple**: PostgreSQL session store for production scalability