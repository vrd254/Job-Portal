import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Shared & Auth Components
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'

// General Pages
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'

// Admin Pages
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from './components/admin/AdminJobs'
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import EditJob from './components/admin/EditJob'
import ProtectedRoute from './components/admin/ProtectedRoute'

// ✅ ChatBot Component
import ChatBot from './components/ChatBot'

const appRouter = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },           // fallback/reset page
  { path: '/reset-password/:token', element: <ResetPassword /> },   // ✅ dynamic token support
  { path: '/jobs', element: <Jobs /> },
  { path: '/description/:id', element: <JobDescription /> },
  { path: '/browse', element: <Browse /> },
  { path: '/profile', element: <Profile /> },

  // Admin Routes (protected)
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/edit",
    element: <ProtectedRoute><EditJob /></ProtectedRoute>
  },
])

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
      {/* ✅ ChatBot is always visible */}
      <ChatBot />
    </div>
  )
}

export default App
