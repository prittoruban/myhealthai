import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ConsumptionLog from '@/models/log.model';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mealName, oilType, quantityInMl } = await request.json();

    // Validation
    if (!mealName || !oilType || quantityInMl === undefined) {
      return NextResponse.json(
        { error: 'Meal name, oil type, and quantity are required' },
        { status: 400 }
      );
    }

    if (quantityInMl < 0) {
      return NextResponse.json(
        { error: 'Quantity cannot be negative' },
        { status: 400 }
      );
    }

    await connectDB();

    // Create consumption log
    const log = await ConsumptionLog.create({
      userId: session.user.id,
      mealName,
      oilType,
      quantityInMl,
      createdAt: new Date(),
    });

    // Award points (1 point per log entry)
    await User.findByIdAndUpdate(session.user.id, { $inc: { points: 1 } });

    return NextResponse.json(
      {
        message: 'Consumption log created successfully',
        log: {
          id: log._id,
          mealName: log.mealName,
          oilType: log.oilType,
          quantityInMl: log.quantityInMl,
          createdAt: log.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Log creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get today's start and end
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch logs for today
    const logs = await ConsumptionLog.find({
      userId: session.user.id,
      createdAt: { $gte: today, $lt: tomorrow },
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      logs: logs.map((log) => ({
        id: log._id,
        mealName: log.mealName,
        oilType: log.oilType,
        quantityInMl: log.quantityInMl,
        createdAt: log.createdAt,
      })),
    });
  } catch (error) {
    console.error('Logs fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
