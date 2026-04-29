# Frontend Architecture Restructuring Plan

To make the frontend scalable and easy to maintain, we should adopt a **Feature-based + Modular** structure. This prevents huge files (like `Summaries.jsx`) and makes it easier for multiple developers to work together.

## 1. Proposed Folder Structure

```text
src/
├── assets/             # Images, SVGs, global styles
├── components/         # Shared components only
│   ├── ui/             # Atomic components (Button, Input, Modal, Card)
│   ├── common/         # Composite components (Navbar, Footer, Sidebar)
│   └── icons/          # SVG Icons as React components
├── layouts/            # Page layouts (MainLayout, AuthLayout, DashboardLayout)
├── pages/              # Clean page entries (minimal logic)
│   ├── Home/
│   ├── Chat/
│   └── Summaries/
├── features/           # Feature-specific logic & components (IMPORTANT)
│   ├── chat/           # ChatWindow, ChatInput, ChatService, useChat
│   ├── todos/          # TodoItem, TodoList, TodoService, useTodos
│   └── auth/           # LoginForm, RegisterForm, AuthService
├── services/           # Global API clients & generic services
│   ├── api.js          # Axios instance with interceptors
│   └── storage.js      # LocalStorage/SessionStorage helpers
├── hooks/              # Global reusable hooks
├── context/            # React Context or State Management (Zustand/Redux)
├── utils/              # Helper functions (date formatting, validators)
├── config/             # Environment variables & constants
└── types/              # TypeScript types (if applicable)
```

## 2. Key Improvement Strategies

### A. Modularize the "Feature" Logic
Currently, business logic is likely mixed inside `pages/`. We should move it to `features/`.
*   **Example**: `Summaries.jsx` is 66KB. It should be broken into:
    *   `features/summaries/components/SummaryList.jsx`
    *   `features/summaries/components/FileUpload.jsx`
    *   `features/summaries/services/summaryService.js`
    *   `features/summaries/hooks/useSummaries.js`

### B. Standardize the API Layer
Create a central `api.js` using **Axios**.
*   **Interceptors**: Automatically add `Authorization: Bearer <token>` to all requests.
*   **Error Handling**: Centralized handling for 401 (Logout) or 500 errors.

### C. UI Component Library (Atomic Design)
Move all small, generic components into `src/components/ui`.
*   This makes it easy to change the "Theme" or "Premium look" globally by editing just one file (e.g., `Button.jsx`).

### D. Layout System
Don't repeat the Navbar/Footer in every page. Wrap pages in `layouts/`.
```jsx
// layouts/MainLayout.jsx
export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      <Navbar />
      <main className="flex-1 container mx-auto p-4">{children}</main>
      <Footer />
    </div>
  );
}
```

## 3. Immediate Next Steps
1.  **Create UI Library**: Extract existing Button, Card, and Input styles from `Summaries.jsx` and `TodoList.jsx` into `src/components/ui`.
2.  **Axios Interceptor**: Setup `services/api.js` to handle token management automatically.
3.  **Refactor Summary Page**: Start with the largest file and break it down into the new structure as a pilot.
