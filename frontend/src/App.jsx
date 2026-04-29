import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { pdfjs } from "react-pdf";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;

// Lazy loading components for faster initial load
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Event = lazy(() => import("./pages/Event"));
const Account = lazy(() => import("./pages/Account"));
const Summaries = lazy(() => import("./pages/Summaries"));
const TodoList = lazy(() => import("./pages/TodoList"));
const ReadingSystem = lazy(() => import("./pages/ReadingSystem"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const EditAvatar = lazy(() => import("./components/Profile/EditAvatar"));

const PageLoading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
    <div style={{ padding: '20px', fontSize: '1.2rem', color: '#666' }}>Loading...</div>
  </div>
);

function App() {
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<Account />} />
          <Route path="/event" element={<Event />} />
          <Route path="/about" element={<About />} />
          <Route path="/summaries" element={<Summaries />} />
          <Route path="/todo" element={<TodoList />} />
          <Route path="/reading" element={<ReadingSystem />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/avatar" element={<EditAvatar />} />
          <Route path="/chat/:mode" element={<Chat />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
