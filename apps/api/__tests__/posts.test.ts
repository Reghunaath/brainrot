import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDb } from '../lib/db';

// Create a fresh in-memory DB for each test
let db: ReturnType<typeof createDb>;

beforeEach(() => {
  db = createDb(':memory:');
});

describe('GET /api/posts', () => {
  it('returns seeded posts', () => {
    const posts = db.prepare(`
      SELECT p.*, u.username, u.displayName, u.avatarColor,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likeCount,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentCount
      FROM posts p JOIN users u ON p.userId = u.id
      ORDER BY p.createdAt DESC
    `).all();

    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBe(15);
  });

  it('returns posts with required fields', () => {
    const post = db.prepare(`
      SELECT p.*, u.username, u.displayName, u.avatarColor,
        (SELECT COUNT(*) FROM likes WHERE postId = p.id) as likeCount,
        (SELECT COUNT(*) FROM comments WHERE postId = p.id) as commentCount
      FROM posts p JOIN users u ON p.userId = u.id
      LIMIT 1
    `).get() as Record<string, unknown>;

    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('content');
    expect(post).toHaveProperty('username');
    expect(post).toHaveProperty('likeCount');
    expect(post).toHaveProperty('commentCount');
  });
});

describe('POST /api/posts', () => {
  it('creates a new post', () => {
    const user = db.prepare('SELECT id FROM users LIMIT 1').get() as { id: number };

    const result = db.prepare('INSERT INTO posts (userId, content) VALUES (?, ?)').run(user.id, 'test post content');
    expect(result.lastInsertRowid).toBeTruthy();

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid) as Record<string, unknown>;
    expect(post.content).toBe('test post content');
    expect(post.userId).toBe(user.id);
  });

  it('total post count increases after insert', () => {
    const before = (db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number }).count;
    const user = db.prepare('SELECT id FROM users LIMIT 1').get() as { id: number };
    db.prepare('INSERT INTO posts (userId, content) VALUES (?, ?)').run(user.id, 'another one');
    const after = (db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number }).count;
    expect(after).toBe(before + 1);
  });
});
