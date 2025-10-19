import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/user.model';
import ConsumptionLog from '@/models/log.model';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await connectDB();

    // Check if demo user exists
    let demoUser = await User.findOne({ email: 'demo@myhealthai.com' });

    // Create demo user if doesn't exist
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      demoUser = await User.create({
        email: 'demo@myhealthai.com',
        password: hashedPassword,
        dailyOilGoal: 30,
        points: 75, // Some gamification points
      });
    }

    // Clear existing demo logs
    await ConsumptionLog.deleteMany({ userId: demoUser._id });

    // Create sample logs for the past week
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sampleLogs = [
      // Today
      { day: 0, mealName: 'Masala Dosa', oilType: 'Coconut Oil', quantityInMl: 8, hour: 8 },
      { day: 0, mealName: 'Dal Tadka', oilType: 'Ghee', quantityInMl: 10, hour: 13 },
      
      // Yesterday
      { day: 1, mealName: 'Poha', oilType: 'Sunflower Oil', quantityInMl: 5, hour: 8 },
      { day: 1, mealName: 'Paneer Tikka', oilType: 'Mustard Oil', quantityInMl: 12, hour: 13 },
      { day: 1, mealName: 'Roti with Sabzi', oilType: 'Ghee', quantityInMl: 8, hour: 20 },
      
      // 2 days ago
      { day: 2, mealName: 'Idli Sambar', oilType: 'Coconut Oil', quantityInMl: 6, hour: 8 },
      { day: 2, mealName: 'Aloo Paratha', oilType: 'Ghee', quantityInMl: 15, hour: 13 },
      
      // 3 days ago
      { day: 3, mealName: 'Upma', oilType: 'Sunflower Oil', quantityInMl: 7, hour: 8 },
      { day: 3, mealName: 'Chole Bhature', oilType: 'Sunflower Oil', quantityInMl: 20, hour: 13 },
      { day: 3, mealName: 'Khichdi', oilType: 'Ghee', quantityInMl: 8, hour: 20 },
      
      // 4 days ago
      { day: 4, mealName: 'Dosa', oilType: 'Coconut Oil', quantityInMl: 8, hour: 8 },
      { day: 4, mealName: 'Rajma Rice', oilType: 'Mustard Oil', quantityInMl: 10, hour: 13 },
      
      // 5 days ago
      { day: 5, mealName: 'Methi Paratha', oilType: 'Ghee', quantityInMl: 12, hour: 8 },
      { day: 5, mealName: 'Sambar Rice', oilType: 'Coconut Oil', quantityInMl: 8, hour: 13 },
      { day: 5, mealName: 'Palak Paneer', oilType: 'Olive Oil', quantityInMl: 14, hour: 20 },
      
      // 6 days ago
      { day: 6, mealName: 'Poha', oilType: 'Sunflower Oil', quantityInMl: 5, hour: 8 },
      { day: 6, mealName: 'Biryani', oilType: 'Ghee', quantityInMl: 18, hour: 13 },
    ];

    const logsToInsert = sampleLogs.map(log => {
      const logDate = new Date(today);
      logDate.setDate(logDate.getDate() - log.day);
      logDate.setHours(log.hour, 0, 0, 0);

      return {
        userId: demoUser._id,
        mealName: log.mealName,
        oilType: log.oilType,
        quantityInMl: log.quantityInMl,
        createdAt: logDate,
      };
    });

    await ConsumptionLog.insertMany(logsToInsert);

    return NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully',
      logsCreated: logsToInsert.length,
    });
  } catch (error) {
    console.error('Seed demo error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed demo data' },
      { status: 500 }
    );
  }
}
