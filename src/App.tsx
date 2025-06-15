import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Games from './pages/Games';
import Lobby from './pages/Lobby';
import Players from './pages/Players';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import { QueryClient } from 'react-query';
import { useLocalAuth, AuthProvider } from './hooks/useLocalAuth';
import Auth from './pages/Auth';

const AppContent = () => {
  const { authState } = useLocalAuth();

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-[#161512] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <Auth onAuthSuccess={() => window.location.reload()} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/games" element={<Games />} />
        <Route path="/players" element={<Players />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

function App() {
  const authProviderValue = useLocalAuth();

  return (
    <QueryClient>
      <AuthProvider value={authProviderValue}>
        <Toaster />
        <AppContent />
      </AuthProvider>
    </QueryClient>
  );
}

export default App;
