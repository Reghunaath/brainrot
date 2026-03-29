import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const cors = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: { ...cors, 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  });
}

export async function GET(_req: NextRequest, { params }: { params: { username: string } }) {
  try {
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(params.username);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: cors });
    }

    const posts = db.prepare(`
      SELECT p.*, u.username, u.displayName, u.avatarColor,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likeCount,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentCount
      FROM posts p JOIN users u ON p.userId = u.id
      WHERE u.username = ?
      ORDER BY p.createdAt DESC
    `).all(params.username);

    return NextResponse.json({ ...user as object, posts }, { headers: cors });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500, headers: cors });
  }
}
