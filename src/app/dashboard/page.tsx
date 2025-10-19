'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProgressCircle from '@/components/ProgressCircle';
import LogMealModal from '@/components/LogMealModal';
import RasoiAISearch from '@/components/RasoiAISearch';

interface Log {
  id: string;
  mealName: string;
  oilType: string;
  quantityInMl: number;
  createdAt: string;
}

interface UserProfile {
  email: string;
  dailyOilGoal: number;
  points: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    try {
      const [logsResponse, userResponse] = await Promise.all([
        fetch('/api/logs'),
        fetch('/api/user'),
      ]);

      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setLogs(logsData.logs);
      }

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserProfile(userData.user);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSuccess = () => {
    fetchData();
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const totalOilToday = logs.reduce((sum, log) => sum + log.quantityInMl, 0);
  const dailyGoal = userProfile?.dailyOilGoal || 30;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">MyHealthAI</h1>
              <p className="text-sm text-gray-600">{session?.user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Points</p>
                <p className="text-2xl font-bold text-green-600">
                  {userProfile?.points || 0}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-gray-700 hover:text-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Progress & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Today&apos;s Oil Consumption
              </h2>
              <div className="flex justify-center">
                <ProgressCircle
                  current={totalOilToday}
                  goal={dailyGoal}
                  label="Total Oil Used"
                />
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md text-lg font-medium"
                >
                  + Log Meal
                </button>
              </div>
            </div>

            {/* Today's Logs */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Today&apos;s Meals
              </h2>
              {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No meals logged yet today.</p>
                  <p className="text-sm mt-2">
                    Start tracking your oil consumption!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {log.mealName}
                        </p>
                        <p className="text-sm text-gray-600">{log.oilType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {log.quantityInMl} ml
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - RasoiAI */}
          <div className="lg:col-span-1">
            <RasoiAISearch />
          </div>
        </div>
      </main>

      {/* Log Meal Modal */}
      <LogMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleLogSuccess}
      />
    </div>
  );
}
