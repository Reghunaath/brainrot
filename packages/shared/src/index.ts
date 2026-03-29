// Types

export interface User {
  id: number;
  username: string;
  displayName: string;
  bio: string | null;
  avatarColor: string;
  createdAt: string;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  username: string;
  displayName: string;
  avatarColor: string;
  likeCount: number;
  commentCount: number;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  username: string;
  displayName: string;
  avatarColor: string;
}

export interface PostDetail extends Post {
  comments: Comment[];
}

// Utils

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function truncateContent(content: string, maxLength = 100): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + '...';
}
