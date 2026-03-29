import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PostCard } from '../components/PostCard';
import type { Post } from '@brainrot/shared';

// Mock next/navigation
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

// Mock UserContext
vi.mock('../components/UserContext', () => ({
  useUser: () => ({ userId: 1, username: 'skibidi_steve' }),
}));

const mockPost: Post = {
  id: 1,
  userId: 1,
  content: 'just mass-reported my own post for being too fire',
  createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  username: 'skibidi_steve',
  displayName: 'Steve Johnson',
  avatarColor: '#9333ea',
  likeCount: 5,
  commentCount: 2,
};

describe('PostCard', () => {
  it('renders username', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('@skibidi_steve')).toBeInTheDocument();
  });

  it('renders post content', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/mass-reported/)).toBeInTheDocument();
  });

  it('renders like count', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('truncates long posts with ellipsis', () => {
    const longPost: Post = {
      ...mockPost,
      content: 'a'.repeat(150),
    };
    render(<PostCard post={longPost} />);
    const truncated = screen.getByText(/a+\.\.\./);
    expect(truncated.textContent).toHaveLength(103); // 100 + '...'
  });

  it('does not truncate posts under 100 chars', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.queryByText(/\.\.\./)).not.toBeInTheDocument();
  });
});
