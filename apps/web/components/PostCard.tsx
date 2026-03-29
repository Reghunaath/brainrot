'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Post } from '@brainrot/shared';
import { formatRelativeTime, truncateContent } from '@brainrot/shared';
import { useUser } from './UserContext';
import { apiUrl } from '@/lib/api';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { userId } = useUser();
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [liked, setLiked] = useState(false);

  // Bug 2: mid-word truncation, no word boundary
  const displayContent = post.content.length > 100
    ? post.content.slice(0, 100) + '...'
    : post.content;

  async function handleLike() {
    // Bug 1: increments by 2 instead of 1
    setLikeCount(prev => liked ? prev - 1 : prev + 2);
    setLiked(prev => !prev);

    try {
      await fetch(apiUrl(`/api/posts/${post.id}/like`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
    } catch {
      // optimistic update stays
    }
  }

  return (
    <Link href={`/post/${post.id}`} className="block">
      <div className="bg-[#1a1a1a] rounded-xl p-4 mb-3 hover:bg-[#222] transition-colors cursor-pointer">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            style={{ backgroundColor: post.avatarColor }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          >
            {post.displayName[0].toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            {/* Bug 3: timestamp uses position:absolute without position:relative on parent */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#c084fc]">@{post.username}</span>
              <span style={{ position: 'absolute', right: 0 }} className="text-xs text-gray-500">
                {formatRelativeTime(post.createdAt)}
              </span>
            </div>

            <p className="text-[#fafafa] mt-1 text-sm leading-relaxed break-words">
              {displayContent}
            </p>

            <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm" onClick={(e) => e.preventDefault()}>
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 hover:text-orange-400 transition-colors ${liked ? 'text-orange-400' : ''}`}
              >
                <span>🔥</span>
                <span>{likeCount}</span>
              </button>
              <span className="flex items-center gap-1">
                <span>💬</span>
                <span>{post.commentCount}</span>
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setLikeCount(prev => prev + 1);
                  navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/post/${post.id}`).catch(() => {});
                }}
                className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                aria-label="Share"
              >
                <span>↗️</span>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
