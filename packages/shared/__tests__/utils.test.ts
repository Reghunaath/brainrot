import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatRelativeTime, truncateContent } from '../src/index';

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for recent timestamps', () => {
    const date = new Date('2024-01-01T11:59:50Z').toISOString();
    expect(formatRelativeTime(date)).toBe('just now');
  });

  it('returns "2m ago" for 2 minutes ago', () => {
    const date = new Date('2024-01-01T11:58:00Z').toISOString();
    expect(formatRelativeTime(date)).toBe('2m ago');
  });

  it('returns "1h ago" for 1 hour ago', () => {
    const date = new Date('2024-01-01T11:00:00Z').toISOString();
    expect(formatRelativeTime(date)).toBe('1h ago');
  });

  it('returns "3d ago" for 3 days ago', () => {
    const date = new Date('2023-12-29T12:00:00Z').toISOString();
    expect(formatRelativeTime(date)).toBe('3d ago');
  });
});

describe('truncateContent', () => {
  it('does not truncate content at exactly 100 chars', () => {
    const content = 'a'.repeat(100);
    expect(truncateContent(content)).toBe(content);
  });

  it('truncates content at 101 chars mid-word', () => {
    const content = 'a'.repeat(101);
    expect(truncateContent(content)).toBe('a'.repeat(100) + '...');
  });

  it('does not truncate short content', () => {
    expect(truncateContent('hello')).toBe('hello');
  });
});
