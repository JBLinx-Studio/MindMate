
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chess from "./pages/Chess";
import ChessLobby from "./pages/ChessLobby";
import Sudoku from "./pages/Sudoku";
import SudokuLobby from "./pages/SudokuLobby";
import Quiz from "./pages/Quiz";
import QuizLobby from "./pages/QuizLobby";
import Lobby from "./pages/Lobby";
import Puzzles from "./pages/Puzzles";
import Tournaments from "./pages/Tournaments";
import Analysis from "./pages/Analysis";
import OpeningExplorer from "./pages/OpeningExplorer";
import Learn from "./pages/Learn";
import Practice from "./pages/Practice";
import Coaches from "./pages/Coaches";
import TV from "./pages/TV";
import Games from "./pages/Games";
import Streamers from "./pages/Streamers";
import VideoLibrary from "./pages/VideoLibrary";
import Players from "./pages/Players";
import Teams from "./pages/Teams";
import Forum from "./pages/Forum";
import BoardEditor from "./pages/BoardEditor";
import ImportGame from "./pages/ImportGame";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import PuzzleDashboard from "./pages/PuzzleDashboard";
import PuzzleRacer from "./pages/PuzzleRacer";
import Coordinates from "./pages/Coordinates";
import PuzzleStorm from "./pages/PuzzleStorm";
import PuzzleThemes from "./pages/PuzzleThemes";
import GameWindow from "./pages/GameWindow";
import Study from "./pages/Study";
import Broadcasts from "./pages/Broadcasts";
import Simuls from "./pages/Simuls";
import Swiss from "./pages/Swiss";
import AdvancedSearch from "./pages/AdvancedSearch";
import Blog from "./pages/Blog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Game Lobbies */}
          <Route path="/chess-lobby" element={<ChessLobby />} />
          <Route path="/sudoku-lobby" element={<SudokuLobby />} />
          <Route path="/quiz-lobby" element={<QuizLobby />} />
          
          {/* Games */}
          <Route path="/chess" element={<Chess />} />
          <Route path="/sudoku" element={<Sudoku />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/lobby" element={<Lobby />} />
          
          {/* Existing routes */}
          <Route path="/puzzles" element={<Puzzles />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/leaderboards" element={<Index />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/opening-explorer" element={<OpeningExplorer />} />
          <Route path="/chess-puzzles" element={<Puzzles />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/rules" element={<Learn />} />
          <Route path="/learn/strategy" element={<Learn />} />
          <Route path="/tutorials" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/live" element={<TV />} />
          <Route path="/replays" element={<Games />} />
          <Route path="/streamers" element={<Streamers />} />
          <Route path="/watch-tournaments" element={<Tournaments />} />
          <Route path="/video" element={<VideoLibrary />} />
          <Route path="/players" element={<Players />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/events" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/editor" element={<BoardEditor />} />
          <Route path="/import" element={<ImportGame />} />
          <Route path="/stats" element={<Index />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/puzzle-dashboard" element={<PuzzleDashboard />} />
          <Route path="/speed-challenges" element={<PuzzleRacer />} />
          <Route path="/logic-puzzles" element={<Puzzles />} />
          <Route path="/coordinates" element={<Coordinates />} />
          <Route path="/puzzle-storm" element={<PuzzleStorm />} />
          <Route path="/puzzle-racer" element={<PuzzleRacer />} />
          <Route path="/puzzle-themes" element={<PuzzleThemes />} />
          <Route path="/games" element={<Games />} />
          <Route path="/game/:id" element={<GameWindow />} />
          <Route path="/study" element={<Study />} />
          <Route path="/broadcasts" element={<Broadcasts />} />
          <Route path="/simuls" element={<Simuls />} />
          <Route path="/swiss" element={<Swiss />} />
          <Route path="/tv" element={<TV />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="*" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
