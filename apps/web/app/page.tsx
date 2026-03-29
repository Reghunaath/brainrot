import { PostCard } from '@/components/PostCard';
import { CreatePost } from '@/components/CreatePost';
import type { Post } from '@brainrot/shared';
import { apiUrl } from '@/lib/api';

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(apiUrl('/api/posts'), { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function FeedPage() {
  const posts = await getPosts();

  return (
    <div className="px-4 pt-4">
      <CreatePost />
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <p className="text-4xl mb-4">💀</p>
          <p className="text-lg">no posts yet</p>
          <p className="text-sm mt-2">be the first to post something unhinged</p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
