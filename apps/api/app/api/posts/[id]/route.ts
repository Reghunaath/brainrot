import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const cors = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: { ...cors, 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const post = db.prepare(`
      SELECT p.*, u.username, u.displayName, u.avatarColor,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likeCount,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentCount
      FROM posts p JOIN users u ON p.userId = u.id
      WHERE p.id = ?
    `).get(params.id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404, headers: cors });
    }

    const comments = db.prepare(`
      SELECT c.*, u.username, u.displayName, u.avatarColor
      FROM comments c JOIN users u ON c.userId = u.id
      WHERE c.postId = ?
      ORDER BY c.createdAt ASC
    `).all(params.id);

    return NextResponse.json({ ...post as object, comments }, { headers: cors });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500, headers: cors });
  }
}
