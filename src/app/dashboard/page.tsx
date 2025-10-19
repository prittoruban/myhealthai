'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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

interface WeeklyStats {
  day: string;
  total: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  const fetchData = async () => {
    try {
      const [logsResponse, userResponse, weeklyResponse] = await Promise.all([
        fetch('/api/logs'),
        fetch('/api/user'),
        fetch('/api/logs/weekly'),
      ]);

      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setLogs(logsData.logs);
      }

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserProfile(userData.user);
      }

      if (weeklyResponse.ok) {
        const weeklyData = await weeklyResponse.json();
        processWeeklyStats(weeklyData.logs);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processWeeklyStats = (allLogs: Log[]) => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayLogs = allLogs.filter(log => {
        const logDate = new Date(log.createdAt);
        return logDate >= date && logDate < nextDate;
      });
      
      const total = dayLogs.reduce((sum, log) => sum + log.quantityInMl, 0);
      
      last7Days.push({
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        total,
      });
    }
    
    setWeeklyStats(last7Days);
  };

  const handleLogSuccess = () => {
    fetchData();
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
  const percentageUsed = (totalOilToday / dailyGoal) * 100;

  // Calculate insights
  const weeklyAverage = weeklyStats.length > 0 
    ? Math.round(weeklyStats.reduce((sum, stat) => sum + stat.total, 0) / weeklyStats.length)
    : 0;
  
  const daysUnderGoal = weeklyStats.filter(stat => stat.total <= dailyGoal).length;
  
  const getInsight = () => {
    if (totalOilToday === 0) {
      return { icon: '🎯', text: 'Start tracking your meals today!', color: 'text-blue-600' };
    }
    if (percentageUsed > 100) {
      return { icon: '⚠️', text: 'You\'ve exceeded your daily goal. Consider lighter cooking methods.', color: 'text-red-600' };
    }
    if (percentageUsed > 80) {
      return { icon: '🔔', text: 'Approaching your daily limit. Choose wisely for your next meal!', color: 'text-yellow-600' };
    }
    if (daysUnderGoal >= 5) {
      return { icon: '🏆', text: 'Amazing! You\'ve stayed under your goal most of this week!', color: 'text-green-600' };
    }
    return { icon: '💪', text: 'Great progress! Keep maintaining healthy oil consumption.', color: 'text-green-600' };
  };

  const insight = getInsight();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 mb-8 text-white"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
              <p className="text-green-100">{session?.user?.email}</p>
            </div>
            <div className="flex gap-4">
              <div className="text-right bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm mb-1">Your Points</p>
                <p className="text-4xl font-bold">{userProfile?.points || 0}</p>
              </div>
              <div className="text-right bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm mb-1">Weekly Avg</p>
                <p className="text-4xl font-bold">{weeklyAverage}ml</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personalized Insight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white rounded-xl p-4 mb-6 shadow-md border-l-4 border-green-500"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{insight.icon}</span>
            <p className={`font-medium ${insight.color}`}>{insight.text}</p>
          </div>
        </motion.div>

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

            {/* Weekly Trends */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Weekly Trends
              </h2>
              <div className="space-y-4">
                {weeklyStats.map((stat, index) => {
                  const percentage = (stat.total / dailyGoal) * 100;
                  const isToday = index === weeklyStats.length - 1;
                  const barColor = percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500';
                  
                  return (
                    <div key={stat.day} className={`${isToday ? 'bg-green-50' : ''} p-3 rounded-lg`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium ${isToday ? 'text-green-700' : 'text-gray-700'}`}>
                          {stat.day} {isToday && '(Today)'}
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                          {stat.total} ml
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
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
      </motion.main>

      {/* Log Meal Modal */}
      <LogMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleLogSuccess}
      />
    </div>
  );
}
