import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { setAuthToken } from './lib/api';

// Layout
import Header from './components/header';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AccountPage from './pages/AccountPage';
import TransactionPage from './pages/TransactionPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth token injector — sets Clerk token into the axios instance before every request
function AuthTokenInjector() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const refreshToken = async () => {
      const token = await getToken();
      setAuthToken(token);
      // Sync user to MongoDB on every sign-in
      if (isSignedIn && token) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/sync`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {
          console.warn("User sync failed:", e.message);
        }
      }
    };

    refreshToken();
    const interval = setInterval(refreshToken, 60000);
    return () => clearInterval(interval);
  }, [getToken, isSignedIn]);

  return null;
}

// Protected route wrapper
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthTokenInjector />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/account/:id"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/transaction/create"
              element={
                <ProtectedRoute>
                  <TransactionPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
