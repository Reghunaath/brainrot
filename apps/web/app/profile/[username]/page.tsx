import { notFound } from 'next/navigation';
import type { User, Post } from '@brainrot/shared';
import { formatRelativeTime } from '@brainrot/shared';
import { apiUrl } from '@/lib/api';
import { PostCard } from '@/components/PostCard';

interface UserProfile extends User {
  posts: Post[];
}

async function getProfile(username: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(apiUrl(`/api/users/${username}`), { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const user = await getProfile(params.username);
  if (!user) notFound();

  return (
    <div className="px-4 pt-4">
      {/* Profile header */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 mb-4 flex flex-col items-center text-center">
        {/* Bug 5: missing w-XX h-XX — avatar collapses to 0x0 */}
        <div
          style={{ backgroundColor: user.avatarColor }}
          className="rounded-full flex items-center justify-center text-white font-bold text-4xl"
        >
          {user.displayName[0].toUpperCase()}
        </div>
        <h1 className="text-xl font-bold text-[#fafafa] mt-3">{user.displayName}</h1>
        <p className="text-[#c084fc] text-sm">@{user.username}</p>
        {user.bio && <p className="text-gray-400 text-sm mt-2">{user.bio}</p>}
        <p className="text-gray-600 text-xs mt-2">joined {formatRelativeTime(user.createdAt)}</p>
      </div>

      {/* User's posts */}
      <h2 className="text-sm font-semibold text-gray-400 mb-3">posts ({user.posts.length})</h2>
      {user.posts.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-8">no posts yet 💀</p>
      ) : (
        user.posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
