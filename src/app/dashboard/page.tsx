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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#141010] via-[#680747] to-[#141010]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f70776] mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-[#141010] via-[#680747] to-[#141010]">
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
          className="bg-gradient-to-r from-[#f70776] to-[#c3195d] rounded-2xl p-6 mb-8 text-white shadow-2xl shadow-[#f70776]/30"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Welcome back! 🙏</h1>
              <p className="text-pink-100">{session?.user?.email}</p>
              <p className="text-sm text-pink-200 mt-1">Contributing to India&apos;s 10% Oil Reduction Campaign 🇮🇳</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="text-right glass-strong rounded-xl p-4 border border-white/20 min-w-[120px]">
                <p className="text-xs mb-1 text-pink-100">🏆 Your Points</p>
                <p className="text-3xl font-bold">{userProfile?.points || 0}</p>
              </div>
              <div className="text-right glass-strong rounded-xl p-4 border border-white/20 min-w-[120px]">
                <p className="text-xs mb-1 text-pink-100">📊 Weekly Avg</p>
                <p className="text-3xl font-bold">{weeklyAverage}ml</p>
              </div>
              <div className="text-right glass-strong rounded-xl p-4 border border-white/20 min-w-[120px]">
                <p className="text-xs mb-1 text-pink-100">🎯 Goal Days</p>
                <p className="text-3xl font-bold">{daysUnderGoal}/7</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* National Campaign Impact Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="glass-strong rounded-xl p-4 mb-6 border border-[#f70776]/30 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇮🇳</span>
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm">National Campaign Progress</h3>
              <p className="text-xs text-gray-400">Join millions of Indians in reducing oil consumption by 10%</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-[#f70776]">{Math.max(0, Math.round(((dailyGoal - weeklyAverage) / dailyGoal) * 100))}%</p>
              <p className="text-xs text-gray-400">Your reduction</p>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(Math.max(0, ((dailyGoal - weeklyAverage) / dailyGoal) * 100), 100)}%` }}
            />
          </div>
        </motion.div>

        {/* Personalized Insight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="glass rounded-xl p-4 mb-6 border border-white/10 border-l-4 border-l-[#f70776] shadow-lg shadow-[#f70776]/10"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{insight.icon}</span>
            <p className={`font-medium ${insight.color === 'text-green-600' ? 'text-[#f70776]' : insight.color === 'text-red-600' ? 'text-red-400' : insight.color === 'text-yellow-600' ? 'text-yellow-400' : 'text-[#c3195d]'}`}>{insight.text}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Progress & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <div className="glass rounded-2xl p-8 border border-white/10 shadow-2xl shadow-[#f70776]/10">
              <h2 className="text-xl font-bold text-white mb-6">
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
                  className="px-8 py-3 bg-gradient-to-r from-[#f70776] to-[#c3195d] text-white rounded-lg hover:shadow-xl hover:shadow-[#f70776]/50 transition-all transform hover:-translate-y-1 text-lg font-medium"
                >
                  + Log Meal
                </button>
              </div>
            </div>

            {/* Weekly Trends */}
            <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl shadow-[#c3195d]/10">
              <h2 className="text-xl font-bold text-white mb-4">
                Weekly Trends
              </h2>
              <div className="space-y-4">
                {weeklyStats.map((stat, index) => {
                  const percentage = (stat.total / dailyGoal) * 100;
                  const isToday = index === weeklyStats.length - 1;
                  const barColor = percentage > 100 ? 'bg-gradient-to-r from-red-500 to-red-600' : percentage > 80 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-[#f70776] to-[#c3195d]';
                  
                  return (
                    <div key={stat.day} className={`${isToday ? 'glass-strong border border-[#f70776]/30' : 'glass-strong border border-white/5'} p-3 rounded-lg`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium ${isToday ? 'text-[#f70776]' : 'text-gray-300'}`}>
                          {stat.day} {isToday && '(Today)'}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {stat.total} ml
                        </span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${barColor} transition-all duration-500 rounded-full shadow-lg`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's Logs */}
            <div className="glass rounded-2xl p-6 border border-white/10 shadow-2xl shadow-[#680747]/10">
              <h2 className="text-xl font-bold text-white mb-4">
                Today&apos;s Meals
              </h2>
              {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
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
                      className="flex justify-between items-center p-4 glass-strong border border-white/10 rounded-lg hover:border-[#f70776]/30 transition-all"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {log.mealName}
                        </p>
                        <p className="text-sm text-gray-400">{log.oilType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#f70776]">
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

        {/* Health Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">📊 Your Health Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Calories Saved */}
            <div className="glass-strong rounded-xl p-6 border border-white/10 hover:border-[#f70776]/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🔥</span>
                <span className="text-xs px-2 py-1 bg-[#f70776]/20 text-[#f70776] rounded-full">This Week</span>
              </div>
              <h3 className="text-sm text-gray-400 mb-2">Calories Saved</h3>
              <p className="text-3xl font-bold text-white">
                {Math.round((dailyGoal * 7 - weeklyStats.reduce((sum, stat) => sum + stat.total, 0)) * 9)}
              </p>
              <p className="text-xs text-gray-500 mt-2">vs. your goal × 7 days</p>
            </div>

            {/* Weight Impact */}
            <div className="glass-strong rounded-xl p-6 border border-white/10 hover:border-[#c3195d]/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">⚖️</span>
                <span className="text-xs px-2 py-1 bg-[#c3195d]/20 text-[#c3195d] rounded-full">Monthly Est.</span>
              </div>
              <h3 className="text-sm text-gray-400 mb-2">Potential Weight Loss</h3>
              <p className="text-3xl font-bold text-white">
                {Math.max(0, ((dailyGoal * 30 - weeklyAverage * 30) * 9 / 7700)).toFixed(1)} kg
              </p>
              <p className="text-xs text-gray-500 mt-2">at current trend</p>
            </div>

            {/* Money Saved */}
            <div className="glass-strong rounded-xl p-6 border border-white/10 hover:border-[#680747]/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">💰</span>
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">This Month</span>
              </div>
              <h3 className="text-sm text-gray-400 mb-2">Money Saved</h3>
              <p className="text-3xl font-bold text-white">
                ₹{Math.round((dailyGoal * 30 - weeklyAverage * 30) * 0.2)}
              </p>
              <p className="text-xs text-gray-500 mt-2">@ ₹200/liter avg</p>
            </div>

            {/* Environmental Impact */}
            <div className="glass-strong rounded-xl p-6 border border-white/10 hover:border-[#f70776]/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🌱</span>
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Impact</span>
              </div>
              <h3 className="text-sm text-gray-400 mb-2">CO₂ Reduction</h3>
              <p className="text-3xl font-bold text-white">
                {((dailyGoal * 30 - weeklyAverage * 30) * 2.5 / 1000).toFixed(2)} kg
              </p>
              <p className="text-xs text-gray-500 mt-2">carbon footprint saved</p>
            </div>
          </div>
        </motion.div>

        {/* Achievements & Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">🏆 Achievements & Rewards</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Achievement Badges */}
            <div className={`glass-strong rounded-xl p-4 text-center border ${daysUnderGoal >= 7 ? 'border-[#f70776]/50 bg-[#f70776]/10' : 'border-white/10 opacity-50'} transition-all`}>
              <span className="text-4xl block mb-2">{daysUnderGoal >= 7 ? '🏆' : '🔒'}</span>
              <p className="text-xs text-gray-300 font-medium">Perfect Week</p>
              <p className="text-xs text-gray-500 mt-1">7 days under goal</p>
            </div>

            <div className={`glass-strong rounded-xl p-4 text-center border ${userProfile && userProfile.points >= 50 ? 'border-[#f70776]/50 bg-[#f70776]/10' : 'border-white/10 opacity-50'} transition-all`}>
              <span className="text-4xl block mb-2">{userProfile && userProfile.points >= 50 ? '⭐' : '🔒'}</span>
              <p className="text-xs text-gray-300 font-medium">Star Tracker</p>
              <p className="text-xs text-gray-500 mt-1">50+ points earned</p>
            </div>

            <div className={`glass-strong rounded-xl p-4 text-center border ${logs.length >= 3 ? 'border-[#f70776]/50 bg-[#f70776]/10' : 'border-white/10 opacity-50'} transition-all`}>
              <span className="text-4xl block mb-2">{logs.length >= 3 ? '📝' : '🔒'}</span>
              <p className="text-xs text-gray-300 font-medium">Consistent Logger</p>
              <p className="text-xs text-gray-500 mt-1">3+ meals today</p>
            </div>

            <div className={`glass-strong rounded-xl p-4 text-center border ${weeklyAverage < dailyGoal ? 'border-[#f70776]/50 bg-[#f70776]/10' : 'border-white/10 opacity-50'} transition-all`}>
              <span className="text-4xl block mb-2">{weeklyAverage < dailyGoal ? '🎯' : '🔒'}</span>
              <p className="text-xs text-gray-300 font-medium">Goal Crusher</p>
              <p className="text-xs text-gray-500 mt-1">Below weekly avg</p>
            </div>

            <div className={`glass-strong rounded-xl p-4 text-center border ${daysUnderGoal >= 5 ? 'border-[#f70776]/50 bg-[#f70776]/10' : 'border-white/10 opacity-50'} transition-all`}>
              <span className="text-4xl block mb-2">{daysUnderGoal >= 5 ? '💪' : '🔒'}</span>
              <p className="text-xs text-gray-300 font-medium">Healthy Habit</p>
              <p className="text-xs text-gray-500 mt-1">5+ goal days</p>
            </div>

            <div className={`glass-strong rounded-xl p-4 text-center border ${userProfile && userProfile.points >= 100 ? 'border-[#f70776]/50 bg-[#f70776]/10' : 'border-white/10 opacity-50'} transition-all`}>
              <span className="text-4xl block mb-2">{userProfile && userProfile.points >= 100 ? '👑' : '🔒'}</span>
              <p className="text-xs text-gray-300 font-medium">Champion</p>
              <p className="text-xs text-gray-500 mt-1">100+ points</p>
            </div>
          </div>
        </motion.div>

        {/* Behavioral Nudges & Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">💡 Smart Tips & Nudges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tip 1: Cooking Method */}
            <div className="glass-strong rounded-xl p-6 border border-white/10 hover:border-[#f70776]/30 transition-all">
              <span className="text-3xl block mb-3">🍳</span>
              <h3 className="font-bold text-white mb-2">Try Healthier Cooking Methods</h3>
              <p className="text-sm text-gray-400 mb-3">
                Steam, bake, or air-fry instead of deep frying. Save up to 80% oil!
              </p>
              <button className="text-xs text-[#f70776] hover:text-[#c3195d] font-medium transition-colors">
                Learn more →
              </button>
            </div>

            {/* Tip 2: Domestic Oils */}
            <div className="glass-strong rounded-xl p-6 border border-white/10 hover:border-[#c3195d]/30 transition-all">
              <span className="text-3xl block mb-3">🥥</span>
              <h3 className="font-bold text-white mb-2">Choose Domestic Oils</h3>
              <p className="text-sm text-gray-400 mb-3">
                Mustard, coconut & groundnut oils support Indian farmers & save forex.
              </p>
              <button className="text-xs text-[#f70776] hover:text-[#c3195d] font-medium transition-colors">
                View options →
              </button>
            </div>

            {/* Tip 3: Portion Control */}
            <div className="glass-strong rounded-xl p-6 border border-white/10 hover:border-[#680747]/30 transition-all">
              <span className="text-3xl block mb-3">🥄</span>
              <h3 className="font-bold text-white mb-2">Measure Your Oil</h3>
              <p className="text-sm text-gray-400 mb-3">
                Use a tablespoon (15ml) instead of pouring directly. Each spoon counts!
              </p>
              <button className="text-xs text-[#f70776] hover:text-[#c3195d] font-medium transition-colors">
                Get tips →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Community Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 mb-8"
        >
          <div className="glass-strong rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">🌍 Your Contribution to National Goal</h2>
              <p className="text-gray-400">Together we&apos;re making a difference for India&apos;s health & economy</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Health Benefit */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#f70776] to-[#c3195d] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#f70776]/30">
                  <span className="text-4xl">❤️</span>
                </div>
                <h3 className="font-bold text-white mb-2">Health Impact</h3>
                <p className="text-sm text-gray-400">
                  Reducing NCDs burden - targeting ₹4.58T economic loss by 2030
                </p>
              </div>

              {/* Economic Benefit */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#c3195d] to-[#680747] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#c3195d]/30">
                  <span className="text-4xl">💵</span>
                </div>
                <h3 className="font-bold text-white mb-2">Economic Savings</h3>
                <p className="text-sm text-gray-400">
                  Supporting Atmanirbhar Bharat - reducing 56% import dependency
                </p>
              </div>

              {/* Farmer Support */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#680747] to-[#f70776] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#680747]/30">
                  <span className="text-4xl">🌾</span>
                </div>
                <h3 className="font-bold text-white mb-2">Supporting Farmers</h3>
                <p className="text-sm text-gray-400">
                  Boosting domestic oilseed cultivation & farmer incomes
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400 mb-2">Share your progress and inspire others!</p>
              <button className="px-6 py-3 bg-gradient-to-r from-[#f70776] to-[#c3195d] text-white rounded-lg hover:shadow-xl hover:shadow-[#f70776]/50 transition-all transform hover:-translate-y-1 font-medium">
                📱 Share on Social Media
              </button>
            </div>
          </div>
        </motion.div>
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
