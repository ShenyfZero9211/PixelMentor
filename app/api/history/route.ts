import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Analysis from '@/models/Analysis';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Find all analyses for this user, sorted by newest first
        const histories = await Analysis.find({ userId: session.id }).sort({ createdAt: -1 });

        return NextResponse.json({ histories });
    } catch (error: any) {
        console.error('History API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
