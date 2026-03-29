'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './UserContext';
import { apiUrl } from '@/lib/api';

export function CreatePost() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { userId } = useUser();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    try {
      await fetch(apiUrl('/api/posts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content }),
      });
      setContent('');
      router.refresh();
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-xl p-4 mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={280}
        placeholder="what's rotting your brain today? 🧠"
        className="w-full bg-transparent text-[#fafafa] placeholder-gray-600 resize-none outline-none text-sm"
        rows={3}
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-600">{content.length}/280</span>
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className="bg-[#c084fc] text-black font-bold px-4 py-1.5 rounded-full text-sm disabled:opacity-50 hover:bg-[#a855f7] transition-colors"
        >
          {loading ? 'posting...' : 'post it fr'}
        </button>
      </div>
    </form>
  );
}
