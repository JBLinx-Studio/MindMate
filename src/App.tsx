import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Analysis from "./pages/Analysis";
import Tournaments from "./pages/Tournaments";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Lobby from "./pages/Lobby";
import GameWindow from "./pages/GameWindow";
import Puzzles from "./pages/Puzzles";
import PuzzleThemes from "./pages/PuzzleThemes";
import PuzzleDashboard from "./pages/PuzzleDashboard";
import PuzzleStorm from "./pages/PuzzleStorm";
import PuzzleRacer from "./pages/PuzzleRacer";
import Learn from "./pages/Learn";
import Practice from "./pages/Practice";
import Coordinates from "./pages/Coordinates";
import Study from "./pages/Study";
import Coaches from "./pages/Coaches";
import TV from "./pages/TV";
import Games from "./pages/Games";
import Streamers from "./pages/Streamers";
import Broadcasts from "./pages/Broadcasts";
import VideoLibrary from "./pages/VideoLibrary";
import Players from "./pages/Players";
import Teams from "./pages/Teams";
import Forum from "./pages/Forum";
import Blog from "./pages/Blog";
import OpeningExplorer from "./pages/OpeningExplorer";
import BoardEditor from "./pages/BoardEditor";
import ImportGame from "./pages/ImportGame";
import AdvancedSearch from "./pages/AdvancedSearch";
import Simuls from "./pages/Simuls";
import Swiss from "./pages/Swiss";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game" element={<GameWindow />} />
          <Route path="/simuls" element={<Simuls />} />
          <Route path="/swiss" element={<Swiss />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/puzzles" element={<Puzzles />} />
          <Route path="/puzzle-themes" element={<PuzzleThemes />} />
          <Route path="/puzzle-dashboard" element={<PuzzleDashboard />} />
          <Route path="/puzzle-storm" element={<PuzzleStorm />} />
          <Route path="/puzzle-racer" element={<PuzzleRacer />} />
          <Route path="/learn/basics" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/coordinates" element={<Coordinates />} />
          <Route path="/study" element={<Study />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/tv" element={<TV />} />
          <Route path="/games" element={<Games />} />
          <Route path="/streamers" element={<Streamers />} />
          <Route path="/broadcasts" element={<Broadcasts />} />
          <Route path="/video" element={<VideoLibrary />} />
          <Route path="/players" element={<Players />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/opening-explorer" element={<OpeningExplorer />} />
          <Route path="/editor" element={<BoardEditor />} />
          <Route path="/import" element={<ImportGame />} />
          <Route path="/search" element={<AdvancedSearch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
