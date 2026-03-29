import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const cors = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: { ...cors, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  });
}

export async function GET() {
  try {
    const db = getDb();
    const posts = db.prepare(`
      SELECT p.*, u.username, u.displayName, u.avatarColor,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likeCount,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentCount
      FROM posts p JOIN users u ON p.userId = u.id
      ORDER BY p.createdAt DESC
    `).all();
    return NextResponse.json(posts, { headers: cors });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500, headers: cors });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, content } = await req.json();
    if (!userId || !content) {
      return NextResponse.json({ error: 'userId and content are required' }, { status: 400, headers: cors });
    }
    const db = getDb();
    const result = db.prepare('INSERT INTO posts (userId, content) VALUES (?, ?)').run(userId, content);
    const post = db.prepare(`
      SELECT p.*, u.username, u.displayName, u.avatarColor,
        0 as likeCount, 0 as commentCount
      FROM posts p JOIN users u ON p.userId = u.id
      WHERE p.id = ?
    `).get(result.lastInsertRowid);
    return NextResponse.json(post, { status: 201, headers: cors });
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500, headers: cors });
  }
}
