
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Plus, 
  Clock, 
  Trophy, 
  Eye, 
  Star,
  Filter,
  Search,
  Play,
  Calendar,
  User
} from 'lucide-react';

const Simuls = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSimul, setNewSimul] = useState({
    name: '',
    timeControl: '10+5',
    maxPlayers: 20,
    minRating: 1200,
    maxRating: 2500
  });

  // Example simuls - these would come from actual data in a real app
  const activeSimuls = [
    {
      id: 1,
      hostName: 'Example Host 1',
      hostRating: 2400,
      title: 'Example Simul',
      timeControl: '10+5',
      participants: 12,
      maxParticipants: 20,
      status: 'accepting',
      created: new Date(Date.now() - 300000), // 5 minutes ago
      minRating: 1200,
      maxRating: 2500
    },
    {
      id: 2,
      hostName: 'Example Host 2',
      hostRating: 2650,
      title: 'Example Rapid Simul',
      timeControl: '15+10',
      participants: 8,
      maxParticipants: 15,
      status: 'playing',
      created: new Date(Date.now() - 900000), // 15 minutes ago
      minRating: 1500,
      maxRating: 2200
    }
  ];

  const handleCreateSimul = () => {
    console.log('Creating simul with data:', newSimul);
    // This would normally send data to a backend
    setShowCreateForm(false);
    setNewSimul({
      name: '',
      timeControl: '10+5',
      maxPlayers: 20,
      minRating: 1200,
      maxRating: 2500
    });
    alert('Simul created! (Example functionality)');
  };

  const handleJoinSimul = (simulId: number) => {
    console.log('Joining simul:', simulId);
    // This would handle joining logic
    alert(`Joined simul ${simulId}! (Example functionality)`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepting': return 'bg-green-500';
      case 'playing': return 'bg-blue-500';
      case 'finished': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredSimuls = activeSimuls.filter(simul =>
    simul.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    simul.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Simultaneous Exhibitions</h1>
                <p className="text-[#b8b8b8]">Play against one player simultaneously with multiple opponents</p>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#b8b8b8] w-4 h-4" />
                    <Input
                      placeholder="Search simuls..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-[#2c2c28] border-[#4a4a46] text-white placeholder:text-[#b8b8b8] w-64"
                    />
                  </div>
                  
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="bg-[#2c2c28] border-[#4a4a46] text-white w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2c2c28] border-[#4a4a46]">
                      <SelectItem value="all">All time controls</SelectItem>
                      <SelectItem value="bullet">Bullet</SelectItem>
                      <SelectItem value="blitz">Blitz</SelectItem>
                      <SelectItem value="rapid">Rapid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-[#759900] hover:bg-[#6a8700] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Simul
                </Button>
              </div>

              {/* Create Simul Form */}
              {showCreateForm && (
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Create New Simul</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#b8b8b8] mb-2">
                        Simul Name
                      </label>
                      <Input
                        value={newSimul.name}
                        onChange={(e) => setNewSimul({...newSimul, name: e.target.value})}
                        placeholder="Enter simul name"
                        className="bg-[#3d3d37] border-[#4a4a46] text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#b8b8b8] mb-2">
                        Time Control
                      </label>
                      <Select 
                        value={newSimul.timeControl} 
                        onValueChange={(value) => setNewSimul({...newSimul, timeControl: value})}
                      >
                        <SelectTrigger className="bg-[#3d3d37] border-[#4a4a46] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2c2c28] border-[#4a4a46]">
                          <SelectItem value="5+3">5+3</SelectItem>
                          <SelectItem value="10+5">10+5</SelectItem>
                          <SelectItem value="15+10">15+10</SelectItem>
                          <SelectItem value="30+0">30+0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#b8b8b8] mb-2">
                        Max Players
                      </label>
                      <Input
                        type="number"
                        value={newSimul.maxPlayers}
                        onChange={(e) => setNewSimul({...newSimul, maxPlayers: parseInt(e.target.value)})}
                        min="5"
                        max="50"
                        className="bg-[#3d3d37] border-[#4a4a46] text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#b8b8b8] mb-2">
                        Rating Range
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={newSimul.minRating}
                          onChange={(e) => setNewSimul({...newSimul, minRating: parseInt(e.target.value)})}
                          placeholder="Min"
                          className="bg-[#3d3d37] border-[#4a4a46] text-white"
                        />
                        <Input
                          type="number"
                          value={newSimul.maxRating}
                          onChange={(e) => setNewSimul({...newSimul, maxRating: parseInt(e.target.value)})}
                          placeholder="Max"
                          className="bg-[#3d3d37] border-[#4a4a46] text-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <Button 
                      onClick={handleCreateSimul}
                      className="bg-[#759900] hover:bg-[#6a8700] text-white"
                    >
                      Create Simul
                    </Button>
                    <Button 
                      onClick={() => setShowCreateForm(false)}
                      variant="outline"
                      className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
              )}

              {/* Simuls Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-[#2c2c28] border-[#4a4a46]">
                  <TabsTrigger value="active" className="data-[state=active]:bg-[#759900]">
                    Active Simuls
                  </TabsTrigger>
                  <TabsTrigger value="finished" className="data-[state=active]:bg-[#759900]">
                    Finished
                  </TabsTrigger>
                  <TabsTrigger value="created" className="data-[state=active]:bg-[#759900]">
                    My Simuls
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-6">
                  <div className="space-y-4">
                    {filteredSimuls.map((simul) => (
                      <Card key={simul.id} className="bg-[#2c2c28] border-[#4a4a46] p-6 hover:bg-[#3d3d37] transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-[#4a4a46] rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-semibold text-white">
                                  {simul.title}
                                </h3>
                                <Badge 
                                  className={`${getStatusColor(simul.status)} text-white text-xs`}
                                >
                                  {simul.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-[#b8b8b8]">
                                <span className="font-medium text-white">
                                  {simul.hostName} ({simul.hostRating})
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{simul.timeControl}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{simul.participants}/{simul.maxParticipants}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Trophy className="w-4 h-4" />
                                  <span>{simul.minRating}-{simul.maxRating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="text-right text-sm text-[#b8b8b8]">
                              <div>Created</div>
                              <div>{simul.created.toLocaleTimeString()}</div>
                            </div>
                            
                            {simul.status === 'accepting' && (
                              <Button 
                                onClick={() => handleJoinSimul(simul.id)}
                                className="bg-[#759900] hover:bg-[#6a8700] text-white"
                              >
                                Join
                              </Button>
                            )}
                            
                            {simul.status === 'playing' && (
                              <Button 
                                variant="outline"
                                className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Watch
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    {filteredSimuls.length === 0 && (
                      <Card className="bg-[#2c2c28] border-[#4a4a46] p-8 text-center">
                        <div className="text-[#b8b8b8]">
                          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-medium mb-2">No simuls found</h3>
                          <p>Try adjusting your search criteria or create a new simul.</p>
                        </div>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="finished" className="mt-6">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-8 text-center">
                    <div className="text-[#b8b8b8]">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No finished simuls</h3>
                      <p>Completed simuls will appear here.</p>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="created" className="mt-6">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-8 text-center">
                    <div className="text-[#b8b8b8]">
                      <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No simuls created</h3>
                      <p>Simuls you create will appear here.</p>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Simuls;
