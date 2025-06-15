
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, UserPlus, LogIn } from 'lucide-react';
import { useLocalAuth } from '../hooks/useLocalAuth';
import { toast } from 'sonner';

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const { loginAsGuest, register } = useLocalAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      loginAsGuest();
      toast.success('Logged in as guest!');
      onAuthSuccess();
    } catch (error) {
      toast.error('Failed to login as guest');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Username is required');
      return;
    }

    setIsLoading(true);
    try {
      register(username.trim(), email.trim() || undefined);
      toast.success('Account created successfully!');
      onAuthSuccess();
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161512] flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-[#2c2c28] border-[#4a4a46] p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Chess</h1>
          <p className="text-[#b8b8b8]">Join the game or play as a guest</p>
        </div>

        <Tabs defaultValue="guest" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-[#161512]">
            <TabsTrigger value="guest" className="text-[#b8b8b8] data-[state=active]:text-white">
              Guest
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-[#b8b8b8] data-[state=active]:text-white">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guest" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="p-6 border border-[#4a4a46] rounded-lg">
                <User className="w-12 h-12 mx-auto mb-3 text-[#759900]" />
                <h3 className="text-lg font-semibold text-white mb-2">Play as Guest</h3>
                <p className="text-[#b8b8b8] text-sm mb-4">
                  Start playing immediately without creating an account. 
                  Your games and progress will be saved locally on this device.
                </p>
                <ul className="text-[#b8b8b8] text-xs space-y-1 mb-4">
                  <li>• Play unlimited games</li>
                  <li>• Track your progress locally</li>
                  <li>• Export your data anytime</li>
                  <li>• No email required</li>
                </ul>
              </div>
              
              <Button
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full bg-[#759900] hover:bg-[#6a8700] text-white"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {isLoading ? 'Logging in...' : 'Continue as Guest'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Username *</label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#161512] border-[#4a4a46] text-white placeholder:text-[#b8b8b8]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Email (optional)</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#161512] border-[#4a4a46] text-white placeholder:text-[#b8b8b8]"
                />
                <p className="text-xs text-[#b8b8b8]">
                  Email is optional and only used for account recovery
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#759900] hover:bg-[#6a8700] text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs text-[#b8b8b8] mb-3">
                Your account data will be stored locally on this device
              </p>
              <Button
                variant="outline"
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
              >
                Or continue as guest
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t border-[#4a4a46]">
          <div className="text-center">
            <h4 className="text-sm font-medium text-white mb-2">Why create an account?</h4>
            <ul className="text-xs text-[#b8b8b8] space-y-1">
              <li>• Personalized username and profile</li>
              <li>• Better game history tracking</li>
              <li>• Optional email for data recovery</li>
              <li>• All data still stored locally</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
