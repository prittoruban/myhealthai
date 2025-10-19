import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ConsumptionLog from '@/models/log.model';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get logs from the past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const logs = await ConsumptionLog.find({
      userId: session.user.id,
      createdAt: { $gte: sevenDaysAgo },
    })
      .sort({ createdAt: -1 })
      .lean();

    const logsWithStringId = logs.map((log) => ({
      ...log,
      id: log._id.toString(),
      userId: log.userId.toString(),
    }));

    return NextResponse.json({ logs: logsWithStringId });
  } catch (error) {
    console.error('Error fetching weekly logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
