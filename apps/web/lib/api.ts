const API = typeof window === 'undefined' ? 'http://localhost:3001' : '';

export const apiUrl = (path: string) => API + path;
