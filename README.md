# MPMS Client (Frontend)

Minimal Project Management System (MPMS) is an enterprise-grade, high-fidelity project management interface built with state-of-the-art frontend web technologies. It focuses on a minimal, premium aesthetic paired with robust, highly responsive interactivity.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Server-Side Rendering)
- **Library**: [React 19](https://react.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) & Custom OKLCH Color Tokens
- **Components**: [Shadcn UI](https://ui.shadcn.com) & [Radix UI](https://www.radix-ui.com) primitives
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com) & [Zod](https://zod.dev)
- **Animations**: [Framer Motion](https://www.framer.com/motion)
- **Data Visualization**: [Recharts](https://recharts.org)

## 📁 Architecture Overview

The `src/` directory is architected for modularity and scalability, adhering strictly to enterprise separation of concerns:

- **`app/`**: Next.js 16 App Router definitions. Contains server-side layout shells and root configurations.
- **`view/`**: Large-scale composition views (e.g., `MyProjectDetailsView.tsx`, `TasksView.tsx`). These orchestrate multiple features and provide the main layout structures for distinct pages.
- **`components/`**: 
  - `features/`: Domain-specific modular components (e.g., `TaskCanvas`, `KanbanBoard`, `TeamMemberDetails`).
  - `shared/`: Generic, reusable components (e.g., `Preloader`, `MpmsInput`).
  - `ui/`: Fundamental building blocks (often Shadcn UI generated).
- **`redux/`**: Global state and data fetching layer.
  - `api/`: Base RTK Query configurations.
  - `feature/`: API endpoints segregated by domains (`tasksApi`, `sprintsApi`, `projectsApi`).
- **`hooks/`**: Custom React hooks encapsulating complex UI or data logic (e.g., `useMyProjects`, `useMyTaskDetails`).
- **`types/`**: Global TypeScript domain models (`domain.types.ts`). Ensures exact parity with the backend schema.
- **`utils/` / `helper/`**: Pure functions, date formatters, and environment configuration parsers.

## 🌟 Key Features

1. **Role-Based Access**: Specialized interfaces dynamically rendering based on Admin, Manager, or Member privileges.
2. **Global Task Kanban**: Highly optimized drag-and-drop task boards supporting optimistic updates and precise server-synchronization.
3. **Advanced Filtering & Search**: Instantaneous client-side filtering augmented by scalable server-side pagination.
4. **Premium UI/UX**:
   - Integrated dark/light mode toggle via custom theme tokens.
   - Zero-hydration-flicker preloader strategy resolving initial state shifts.
   - Smooth transitions and micro-interactions utilizing Framer Motion.
5. **Real-Time Data Mutability**: RTK Query auto-caching and tag invalidation ensure interfaces instantly reflect backend state changes seamlessly.

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 18.0.0
- Backend server running locally or accessible via URL.

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your backend API URL (e.g., NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1)

# Start development server (Turbopack enabled)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Starts the application in production mode.
- `npm run lint` / `npm run format`: Runs ESLint and Prettier for code quality.
- `npm run type-check`: Verifies exact TypeScript conformance across the workspace.
