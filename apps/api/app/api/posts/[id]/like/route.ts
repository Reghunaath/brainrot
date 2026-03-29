import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const cors = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: { ...cors, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400, headers: cors });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM likes WHERE postId = ? AND userId = ?').get(params.id, userId);

    if (existing) {
      db.prepare('DELETE FROM likes WHERE postId = ? AND userId = ?').run(params.id, userId);
    } else {
      db.prepare('INSERT INTO likes (postId, userId) VALUES (?, ?)').run(params.id, userId);
    }

    const { likeCount } = db.prepare('SELECT COUNT(*) as likeCount FROM likes WHERE postId = ?').get(params.id) as { likeCount: number };
    return NextResponse.json({ liked: !existing, likeCount }, { headers: cors });
  } catch {
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500, headers: cors });
  }
}
