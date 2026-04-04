import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Event from "./pages/Event";
import Account from "./pages/Account";
import Summaries from "./pages/Summaries";
import TodoList from "./pages/TodoList";
import ReadingSystem from "./pages/ReadingSystem";
import EditAvatar from "./components/Profile/EditAvatar";

function App() {
  return (
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
      <Route path="/avatar" element={<EditAvatar />} />
      <Route path="/chat/:mode" element={<Chat />} />
    </Routes>
  );
}

export default App;
