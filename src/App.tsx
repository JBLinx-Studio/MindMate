
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Games from './pages/Games';
import Lobby from './pages/Lobby';
import Players from './pages/Players';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Puzzles from './pages/Puzzles';
import PuzzleThemes from './pages/PuzzleThemes';
import Tournaments from './pages/Tournaments';
// Import all the missing pages
import TV from './pages/TV';
import Streamers from './pages/Streamers';
import Broadcasts from './pages/Broadcasts';
import VideoLibrary from './pages/VideoLibrary';
import Teams from './pages/Teams';
import Forum from './pages/Forum';
import Blog from './pages/Blog';
import Analysis from './pages/Analysis';
import OpeningExplorer from './pages/OpeningExplorer';
import BoardEditor from './pages/BoardEditor';
import ImportGame from './pages/ImportGame';
import AdvancedSearch from './pages/AdvancedSearch';
import Learn from './pages/Learn';
import Practice from './pages/Practice';
import Coordinates from './pages/Coordinates';
import Study from './pages/Study';
import Coaches from './pages/Coaches';
import PuzzleDashboard from './pages/PuzzleDashboard';
import PuzzleStorm from './pages/PuzzleStorm';
import PuzzleRacer from './pages/PuzzleRacer';
import Simuls from './pages/Simuls';
import Swiss from './pages/Swiss';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLocalAuth, AuthProvider } from './hooks/useLocalAuth';
import Auth from './pages/Auth';

const queryClient = new QueryClient();

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
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/games" element={<Games />} />
        <Route path="/players" element={<Players />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/puzzles" element={<Puzzles />} />
        <Route path="/puzzle-themes" element={<PuzzleThemes />} />
        <Route path="/puzzle-dashboard" element={<PuzzleDashboard />} />
        <Route path="/puzzle-storm" element={<PuzzleStorm />} />
        <Route path="/puzzle-racer" element={<PuzzleRacer />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/simuls" element={<Simuls />} />
        <Route path="/swiss" element={<Swiss />} />
        <Route path="/learn/basics" element={<Learn />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/coordinates" element={<Coordinates />} />
        <Route path="/study" element={<Study />} />
        <Route path="/coaches" element={<Coaches />} />
        <Route path="/tv" element={<TV />} />
        <Route path="/streamers" element={<Streamers />} />
        <Route path="/broadcasts" element={<Broadcasts />} />
        <Route path="/video" element={<VideoLibrary />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/opening-explorer" element={<OpeningExplorer />} />
        <Route path="/editor" element={<BoardEditor />} />
        <Route path="/import" element={<ImportGame />} />
        <Route path="/search" element={<AdvancedSearch />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

function App() {
  const authProviderValue = useLocalAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider value={authProviderValue}>
        <Toaster />
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
