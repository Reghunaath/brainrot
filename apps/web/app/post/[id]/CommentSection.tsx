'use client';

import { useState } from 'react';
import type { Comment } from '@brainrot/shared';
import { formatRelativeTime } from '@brainrot/shared';
import { useUser } from '@/components/UserContext';
import { apiUrl } from '@/lib/api';

interface CommentSectionProps {
  postId: number;
  initialComments: Comment[];
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { userId } = useUser();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(apiUrl(`/api/posts/${postId}/comments`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content }),
      });
      const newComment = await res.json();
      setComments(prev => [...prev, newComment]);
      setContent('');
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-400 mb-3">comments ({comments.length})</h2>

      <div className="space-y-3 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-[#1a1a1a] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div
                style={{ backgroundColor: comment.avatarColor }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              >
                {comment.displayName[0].toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-[#c084fc]">@{comment.username}</span>
              <span className="text-xs text-gray-500">{formatRelativeTime(comment.createdAt)}</span>
            </div>
            <p className="text-[#fafafa] text-sm pl-9">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-4">no comments yet. be the first fr</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-xl p-3 flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="add a comment..."
          className="flex-1 bg-transparent text-[#fafafa] placeholder-gray-600 outline-none text-sm"
        />
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className="text-[#c084fc] font-semibold text-sm disabled:opacity-50 hover:text-[#a855f7] transition-colors"
        >
          {loading ? '...' : 'send'}
        </button>
      </form>
    </div>
  );
}
