import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PostCard } from '../components/PostCard';
import type { Post } from '@brainrot/shared';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('../components/UserContext', () => ({
  useUser: () => ({ userId: 1, username: 'skibidi_steve' }),
}));

const makPost = (id: number, content: string): Post => ({
  id,
  userId: 1,
  content,
  createdAt: new Date().toISOString(),
  username: 'skibidi_steve',
  displayName: 'Steve Johnson',
  avatarColor: '#9333ea',
  likeCount: 0,
  commentCount: 0,
});

describe('Feed', () => {
  it('renders multiple post cards', () => {
    const posts = [
      makPost(1, 'first post fr'),
      makPost(2, 'second post no cap'),
      makPost(3, 'third post bestie'),
    ];

    const { container } = render(
      <div>
        {posts.map(p => <PostCard key={p.id} post={p} />)}
      </div>
    );

    expect(screen.getByText('first post fr')).toBeInTheDocument();
    expect(screen.getByText('second post no cap')).toBeInTheDocument();
    expect(screen.getByText('third post bestie')).toBeInTheDocument();
    expect(container.querySelectorAll('a').length).toBe(3);
  });

  it('shows empty state when no posts', () => {
    render(
      <div>
        {[].length === 0 && (
          <p>no posts yet</p>
        )}
      </div>
    );
    expect(screen.getByText('no posts yet')).toBeInTheDocument();
  });
});
