
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, CheckCircle } from 'lucide-react';

const Learn = () => {
  const lessons = [
    { title: "How pieces move", completed: true, duration: "5 min" },
    { title: "Capturing pieces", completed: true, duration: "7 min" },
    { title: "Check and checkmate", completed: false, duration: "10 min" },
    { title: "Special moves", completed: false, duration: "12 min" },
    { title: "Basic tactics", completed: false, duration: "15 min" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Learn Chess Basics</h1>
                <p className="text-[#b8b8b8]">Master the fundamentals of chess</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Course Progress</h2>
                    <div className="space-y-4">
                      {lessons.map((lesson, index) => (
                        <div key={index} className="flex items-center justify-between bg-[#3d3d37] rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            {lesson.completed ? (
                              <CheckCircle className="w-5 h-5 text-[#759900]" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-[#4a4a46] rounded-full" />
                            )}
                            <div>
                              <h3 className="text-white font-medium">{lesson.title}</h3>
                              <p className="text-[#b8b8b8] text-sm">{lesson.duration}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className={lesson.completed ? "bg-[#4a4a46] text-[#b8b8b8]" : "bg-[#759900] hover:bg-[#6a8700]"}
                            disabled={lesson.completed}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {lesson.completed ? "Completed" : "Start"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Progress</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Lessons completed:</span>
                        <span className="text-white">2/5</span>
                      </div>
                      <div className="w-full bg-[#4a4a46] rounded-full h-2">
                        <div className="bg-[#759900] h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <div className="text-center text-[#759900] font-medium">40% Complete</div>
                    </div>
                  </Card>

                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>
                    <ul className="text-[#b8b8b8] text-sm space-y-2">
                      <li>• Control the center of the board</li>
                      <li>• Protect your king early</li>
                      <li>• Develop pieces before attacking</li>
                      <li>• Don't move the same piece twice</li>
                    </ul>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Learn;
