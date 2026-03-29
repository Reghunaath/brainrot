'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  userId: number;
  username: string;
  setUser: (id: number, username: string) => void;
}

const UserContext = createContext<UserContextType>({
  userId: 1,
  username: 'skibidi_steve',
  setUser: () => {},
});

const SEED_USERS = [
  { id: 1, username: 'skibidi_steve' },
  { id: 2, username: 'rizz_queen' },
  { id: 3, username: 'sigma_sam' },
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState(1);
  const [username, setUsername] = useState('skibidi_steve');

  function setUser(id: number, uname: string) {
    setUserId(id);
    setUsername(uname);
  }

  return (
    <UserContext.Provider value={{ userId, username, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function UserSelector() {
  const { userId, setUser } = useUser();

  return (
    <select
      value={userId}
      onChange={(e) => {
        const selected = SEED_USERS.find((u) => u.id === Number(e.target.value));
        if (selected) setUser(selected.id, selected.username);
      }}
      className="bg-[#1a1a1a] text-[#fafafa] text-sm border border-[#333] rounded px-2 py-1"
    >
      {SEED_USERS.map((u) => (
        <option key={u.id} value={u.id}>
          @{u.username}
        </option>
      ))}
    </select>
  );
}
