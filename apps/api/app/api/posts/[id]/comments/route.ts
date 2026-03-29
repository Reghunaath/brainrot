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
    const { userId, content } = await req.json();
    if (!userId || !content) {
      return NextResponse.json({ error: 'userId and content are required' }, { status: 400, headers: cors });
    }

    const db = getDb();
    const result = db.prepare(
      'INSERT INTO comments (postId, userId, content) VALUES (?, ?, ?)'
    ).run(params.id, userId, content);

    const comment = db.prepare(`
      SELECT c.*, u.username, u.displayName, u.avatarColor
      FROM comments c JOIN users u ON c.userId = u.id
      WHERE c.id = ?
    `).get(result.lastInsertRowid);

    return NextResponse.json(comment, { status: 201, headers: cors });
  } catch {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500, headers: cors });
  }
}
