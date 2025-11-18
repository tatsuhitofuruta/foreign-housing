import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const startTime = Date.now();

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    const dbLatency = Date.now() - startTime;

    // Check environment variables
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
    ];

    const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || 'unknown',
      checks: {
        database: {
          status: 'healthy',
          latency: `${dbLatency}ms`,
        },
        environment: {
          status: missingEnvVars.length === 0 ? 'healthy' : 'unhealthy',
          missing: missingEnvVars,
        },
      },
    };

    const statusCode = missingEnvVars.length === 0 ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
