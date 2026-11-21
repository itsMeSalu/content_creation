import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CreatorProfile from './publicCreators/CreatorProfile'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import UserDashboard from './user/UserDashboard.jsx'
import CreatorWorkspace from './creator/CreatorWorkspace.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {window.location.pathname.startsWith('/creators/') ? <CreatorProfile /> : (window.location.pathname === '/creator' || window.location.pathname.startsWith('/creator/')) ? <CreatorWorkspace /> : (window.location.pathname === '/dashboard' || window.location.pathname.startsWith('/dashboard/')) ? <UserDashboard /> : (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) ? <AdminDashboard /> : ['/login', '/login-preview'].includes(window.location.pathname.replace(/\/$/, '')) ? <Login /> : window.location.pathname.replace(/\/$/, '') === '/signup' ? <Signup /> : <App />}
  </StrictMode>,
)
