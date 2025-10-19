import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_SECRET_LENGTH: process.env.NEXTAUTH_SECRET?.length || 0,
    };

    // Check MongoDB connection
    let dbStatus = 'disconnected';
    try {
      await connectDB();
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = `error: ${error instanceof Error ? error.message : 'unknown'}`;
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      },
      checks: {
        ...envCheck,
        database: dbStatus,
      },
      warnings: [
        !envCheck.MONGODB_URI && 'MONGODB_URI is not set',
        !envCheck.NEXTAUTH_URL && 'NEXTAUTH_URL is not set',
        !envCheck.NEXTAUTH_SECRET && 'NEXTAUTH_SECRET is not set',
        envCheck.NEXTAUTH_SECRET_LENGTH < 32 && 'NEXTAUTH_SECRET is too short (min 32 chars)',
      ].filter(Boolean),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
