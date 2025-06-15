
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Calendar, Plus, Filter } from 'lucide-react';
import TournamentCard from '../components/TournamentCard';
import { toast } from 'sonner';

const Tournaments = () => {
  const [tournaments] = useState([
    {
      id: 1,
      title: 'Weekly Blitz Championship',
      type: 'Swiss System',
      timeControl: '3+2',
      players: 45,
      maxPlayers: 64,
      startTime: 'Today 8:00 PM',
      prizePool: '$500',
      status: 'upcoming' as const
    },
    {
      id: 2,
      title: 'Speed Chess Arena',
      type: 'Arena',
      timeControl: '1+0',
      players: 128,
      maxPlayers: 200,
      startTime: 'Live Now',
      status: 'live' as const
    },
    {
      id: 3,
      title: 'Monthly Classical',
      type: 'Round Robin',
      timeControl: '15+10',
      players: 16,
      maxPlayers: 16,
      startTime: 'Tomorrow 2:00 PM',
      prizePool: '$1000',
      status: 'upcoming' as const
    },
    {
      id: 4,
      title: 'Beginner Friendly',
      type: 'Swiss System',
      timeControl: '10+5',
      players: 32,
      maxPlayers: 50,
      startTime: 'Dec 20, 6:00 PM',
      status: 'upcoming' as const
    }
  ]);

  const handleJoinTournament = (tournamentId: number) => {
    toast.success('Successfully joined tournament!', {
      description: 'You will receive a notification when the tournament starts.',
      duration: 4000,
    });
  };

  const liveTournaments = tournaments.filter(t => t.status === 'live');
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-amber-50 to-orange-100">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b shadow-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-2xl font-bold text-amber-800">Tournaments</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Tournament
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Featured Section */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">ChessMaster Cup 2024</h2>
                    <p className="text-purple-100 mb-4">Join our biggest tournament of the year!</p>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1" />
                        $10,000 Prize Pool
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        1000+ Players
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        December 25, 2024
                      </div>
                    </div>
                  </div>
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                    Register Now
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="all">All Tournaments</TabsTrigger>
                  <TabsTrigger value="live">Live Now ({liveTournaments.length})</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming ({upcomingTournaments.length})</TabsTrigger>
                  <TabsTrigger value="my">My Tournaments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map((tournament) => (
                      <TournamentCard
                        key={tournament.id}
                        title={tournament.title}
                        type={tournament.type}
                        timeControl={tournament.timeControl}
                        players={tournament.players}
                        maxPlayers={tournament.maxPlayers}
                        startTime={tournament.startTime}
                        prizePool={tournament.prizePool}
                        status={tournament.status}
                        onJoin={() => handleJoinTournament(tournament.id)}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="live" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveTournaments.map((tournament) => (
                      <TournamentCard
                        key={tournament.id}
                        title={tournament.title}
                        type={tournament.type}
                        timeControl={tournament.timeControl}
                        players={tournament.players}
                        maxPlayers={tournament.maxPlayers}
                        startTime={tournament.startTime}
                        prizePool={tournament.prizePool}
                        status={tournament.status}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="upcoming" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingTournaments.map((tournament) => (
                      <TournamentCard
                        key={tournament.id}
                        title={tournament.title}
                        type={tournament.type}
                        timeControl={tournament.timeControl}
                        players={tournament.players}
                        maxPlayers={tournament.maxPlayers}
                        startTime={tournament.startTime}
                        prizePool={tournament.prizePool}
                        status={tournament.status}
                        onJoin={() => handleJoinTournament(tournament.id)}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="my" className="space-y-6">
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">No tournaments yet</h3>
                    <p className="text-gray-600 mb-6">Join your first tournament to see it here</p>
                    <Button>Browse Tournaments</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Tournaments;
