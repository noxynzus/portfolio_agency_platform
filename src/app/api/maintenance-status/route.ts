import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: 'site-settings' },
      select: { maintenanceMode: true }
    });

    // console.log('Maintenance status fetched:', settings?.maintenanceMode);

    return NextResponse.json({
      maintenanceMode: settings?.maintenanceMode ?? false
    });
  } catch (error) {
    console.error('Failed to fetch maintenance status:', error);
    return NextResponse.json(
      { maintenanceMode: false },
      { status: 500 }
    );
  }
}
