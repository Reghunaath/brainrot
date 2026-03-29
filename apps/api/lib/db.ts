import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export function createDb(dbPath = './data/brainrot.db'): Database.Database {
  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');

  // Schema
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT UNIQUE NOT NULL,
      displayName TEXT NOT NULL,
      bio         TEXT,
      avatarColor TEXT NOT NULL,
      createdAt   TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      userId      INTEGER REFERENCES users(id),
      content     TEXT NOT NULL,
      createdAt   TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS likes (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      postId  INTEGER REFERENCES posts(id),
      userId  INTEGER REFERENCES users(id),
      UNIQUE(postId, userId)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      postId    INTEGER REFERENCES posts(id),
      userId    INTEGER REFERENCES users(id),
      content   TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now'))
    );
  `);

  // Auto-seed on first run
  const userCount = sqlite.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    seed(sqlite);
  }

  return sqlite;
}

function seed(sqlite: Database.Database) {
  const insertUser = sqlite.prepare(
    'INSERT INTO users (username, displayName, bio, avatarColor) VALUES (?, ?, ?, ?)'
  );

  insertUser.run('skibidi_steve', 'Steve Johnson', 'chronically online since 2009. no cap.', '#9333ea');
  insertUser.run('rizz_queen', 'Madison Chen', 'main character energy 24/7 💅 | manifesting greatness', '#ec4899');
  insertUser.run('sigma_sam', 'Sam Williams', 'sigma grindset. touch grass? never heard of it.', '#3b82f6');

  const steve = sqlite.prepare('SELECT id FROM users WHERE username = ?').get('skibidi_steve') as { id: number };
  const madison = sqlite.prepare('SELECT id FROM users WHERE username = ?').get('rizz_queen') as { id: number };
  const sam = sqlite.prepare('SELECT id FROM users WHERE username = ?').get('sigma_sam') as { id: number };

  const insertPost = sqlite.prepare('INSERT INTO posts (userId, content, createdAt) VALUES (?, ?, ?)');

  insertPost.run(steve.id, 'just mass-reported my own post for being too fire 🔥🔥🔥', '2024-01-15 10:00:00');
  insertPost.run(madison.id, 'me explaining to my therapist why I need validation from strangers on the internet 💀', '2024-01-15 10:05:00');
  insertPost.run(sam.id, 'sigma grindset is just being unemployed with confidence', '2024-01-15 10:10:00');
  insertPost.run(steve.id, "POV: you're scrolling brainrot instead of doing your assignment fr fr", '2024-01-15 10:15:00');
  insertPost.run(madison.id, "if you're reading this, drink some water bestie 💧", '2024-01-15 10:20:00');
  insertPost.run(sam.id, 'the industrial revolution and its consequences have been a disaster for my screen time', '2024-01-15 10:25:00');
  insertPost.run(steve.id, 'I fear my fyp knows me better than my parents do', '2024-01-15 10:30:00');
  insertPost.run(madison.id, "this app is giving unhinged and I'm here for it no cap", '2024-01-15 10:35:00');
  insertPost.run(sam.id, 'woke up and chose chaos. another day of pure sigma behavior. the grind never stops. no days off. we move. 🐺', '2024-01-15 10:40:00');
  insertPost.run(steve.id, 'bro really said "let me cook" and then served us a whole meal fr fr. absolute W behavior. this is the way. slay.', '2024-01-15 10:45:00');
  insertPost.run(madison.id, "hot take: we should normalize telling people their aura is off. like babe your vibes are not adding up and it's giving very much not okay bestie 💅", '2024-01-15 10:50:00');
  insertPost.run(sam.id, 'npc behavior detected', '2024-01-15 10:55:00');
  insertPost.run(steve.id, 'the way I gaslit myself into thinking I was productive today when I literally just reorganized my desktop icons 💀💀', '2024-01-15 11:00:00');
  insertPost.run(madison.id, 'slay', '2024-01-15 11:05:00');
  insertPost.run(sam.id, 'just found out my rizz is actually just charisma with extra steps. academic literature could never. the sigma grindset demands constant intellectual evolution no cap fr fr 🐺', '2024-01-15 11:10:00');

  const insertLike = sqlite.prepare('INSERT OR IGNORE INTO likes (postId, userId) VALUES (?, ?)');
  insertLike.run(1, madison.id);
  insertLike.run(1, sam.id);
  insertLike.run(2, steve.id);
  insertLike.run(3, madison.id);
  insertLike.run(5, steve.id);
  insertLike.run(5, sam.id);
  insertLike.run(7, madison.id);
  insertLike.run(8, steve.id);
  insertLike.run(8, sam.id);

  const insertComment = sqlite.prepare(
    'INSERT INTO comments (postId, userId, content, createdAt) VALUES (?, ?, ?, ?)'
  );
  insertComment.run(1, madison.id, 'no fr this is literally me 💀', '2024-01-15 10:02:00');
  insertComment.run(1, sam.id, 'based behavior', '2024-01-15 10:03:00');
  insertComment.run(2, steve.id, 'we are not the same but also we are exactly the same', '2024-01-15 10:07:00');
  insertComment.run(5, steve.id, 'already drank water. thanks for the reminder queen 👑', '2024-01-15 10:22:00');
  insertComment.run(8, steve.id, 'real and true', '2024-01-15 10:37:00');
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}
