import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home'; // This will be deprecated or converted to UserDashboard
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NavigationGuard from './components/NavigationGuard';

// Admin Components
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateQuiz from './pages/admin/CreateQuiz';
import EditQuiz from './pages/admin/EditQuiz';
import SystemSettings from './pages/admin/SystemSettings';
import ManageUsers from './pages/admin/ManageUsers';
import UserReport from './pages/admin/UserReport';

// User Components
import UserDashboard from './pages/user/UserDashboard';
import TakeQuiz from './pages/user/TakeQuiz';
import MyResults from './pages/user/MyResults';
import QuizReview from './pages/user/QuizReview';
import Profile from './pages/user/Profile';
import Achievements from './pages/user/Achievements';
import RedeemCoins from './pages/user/RedeemCoins';

// Shared
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<NavigationGuard><Login /></NavigationGuard>} />
          <Route path="/signup" element={<NavigationGuard><Signup /></NavigationGuard>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes for All Logged In Users */}
          <Route element={<ProtectedRoute />}>
             <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<NavigationGuard><AdminDashboard /></NavigationGuard>} />
            <Route path="/admin/create-quiz" element={<NavigationGuard><CreateQuiz /></NavigationGuard>} />
            <Route path="/admin/edit-quiz/:id" element={<NavigationGuard><EditQuiz /></NavigationGuard>} />
            <Route path="/admin/settings" element={<NavigationGuard><SystemSettings /></NavigationGuard>} />
            <Route path="/admin/users" element={<NavigationGuard><ManageUsers /></NavigationGuard>} />
            <Route path="/admin/user-report/:id" element={<NavigationGuard><UserReport /></NavigationGuard>} />
          </Route>

          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/dashboard" element={<NavigationGuard><UserDashboard /></NavigationGuard>} />
            <Route path="/quiz/:id/take" element={<NavigationGuard><TakeQuiz /></NavigationGuard>} />
            <Route path="/my-results" element={<NavigationGuard><MyResults /></NavigationGuard>} />
            <Route path="/quiz-review/:id" element={<NavigationGuard><QuizReview /></NavigationGuard>} />
            <Route path="/profile" element={<NavigationGuard><Profile /></NavigationGuard>} />
            <Route path="/achievements" element={<NavigationGuard><Achievements /></NavigationGuard>} />
            <Route path="/redeem" element={<NavigationGuard><RedeemCoins /></NavigationGuard>} />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
