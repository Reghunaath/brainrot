import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { PostDetail } from '@brainrot/shared';
import { formatRelativeTime } from '@brainrot/shared';
import { apiUrl } from '@/lib/api';
import { CommentSection } from './CommentSection';

async function getPost(id: string): Promise<PostDetail | null> {
  try {
    const res = await fetch(apiUrl(`/api/posts/${id}`), { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) notFound();

  return (
    <div className="px-4 pt-4">
      <Link href="/" className="text-[#c084fc] text-sm mb-4 inline-block hover:underline">
        ← back
      </Link>

      {/* Post header — Bug 4: post.commentCount is frozen from server data, never updates */}
      <div className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <div
            style={{ backgroundColor: post.avatarColor }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          >
            {post.displayName[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#c084fc]">@{post.username}</span>
              <span className="text-xs text-gray-500">{formatRelativeTime(post.createdAt)}</span>
            </div>
            <p className="text-[#fafafa] mt-2 text-sm leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <span>🔥</span>
                <span>{post.likeCount}</span>
              </span>
              {/* Bug 4: stale — reads initial server value, never updates when comments are added */}
              <span className="flex items-center gap-1">
                <span>💬</span>
                <span>{post.commentCount}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <CommentSection postId={post.id} initialComments={post.comments} />
    </div>
  );
}
