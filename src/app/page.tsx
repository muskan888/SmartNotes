'use client';

import { trpc } from '@/app/_trpc/client';
import { useState, useEffect } from 'react';
import MemberCard from '@/components/Member';


export default function Home() {
  const [noteTexts, setNoteTexts] = useState<{ [memberId: string]: string }>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({ firstName: '', lastName: '', password: '' });
  const [unlockedMembers, setUnlockedMembers] = useState<{ [memberId: string]: boolean }>({});
  const [passwordInputs, setPasswordInputs] = useState<{ [memberId: string]: string }>({});

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const utils = trpc.useContext();

  const { data: members = [] } = trpc.member.getAll.useQuery(undefined, {
    enabled: !!token,
  });

  const createNote = trpc.member.createNote.useMutation({
    onSuccess: () => utils.member.getAll.invalidate(),
  });

  const createMember = trpc.member.createMember.useMutation({
    onSuccess: () => utils.member.getAll.invalidate(),
  });

  const updateNote = trpc.member.updateNote.useMutation({
    onSuccess: () => {
      utils.member.getAll.invalidate();
      setEditNoteIds({});
      setEditTexts({});
    },
  });

  const deleteNote = trpc.member.deleteNote.useMutation({
    onSuccess: () => utils.member.getAll.invalidate(),
  });

  const verifyPassword = trpc.member.verifyPassword.useMutation({
    onSuccess: (data, variables) => {
      if (data.isValid) {
        setUnlockedMembers({ ...unlockedMembers, [variables.memberId]: true });
        setPasswordInputs({ ...passwordInputs, [variables.memberId]: '' });
      } else {
        alert('Incorrect password!');
      }
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUnlockedMembers({});
    window.location.reload();
  };

  const handleAddNote = (memberId: string, text: string) => {
    if (!text.trim() || !unlockedMembers[memberId]) return;

    createNote.mutate({
      memberId: memberId.trim(),
      text: text.trim(),
    });

    setNoteTexts({ ...noteTexts, [memberId]: '' });
  };

  const handleNewUser = () => {
    if (!newMember.firstName.trim() && !newMember.lastName.trim()) {
      alert('First name and last name are missing!');
      return;
    }
    if (!newMember.firstName.trim()) {
      alert('First name is missing!');
      return;
    }
    if (!newMember.lastName.trim()) {
      alert('Last name is missing!');
      return;
    }
    if (!newMember.password.trim()) {
      alert('Password is missing!');
      return;
    }

    createMember.mutate({
      firstName: newMember.firstName.trim(),
      lastName: newMember.lastName.trim(),
      password: newMember.password.trim(),
    });

    setNewMember({ firstName: '', lastName: '', password: '' });
  };

  const handleUnlock = (memberId: string) => {
    const password = passwordInputs[memberId] || '';
    if (!password.trim()) {
      alert('Please enter a password!');
      return;
    }
    verifyPassword.mutate({ memberId, password });
  };

  return (
    <main className="container mx-auto p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">
          📜 Member Notes Kibu
        </h1>
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            🚪 Logout
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="🔍 Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-200"
        />
      </div>

      {/* New User Input */}
      <div className="mb-10 flex justify-center gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={newMember.firstName}
          onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
          className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-200 w-1/4"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newMember.lastName}
          onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
          className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-200 w-1/4"
        />
        <input
          type="password"
          placeholder="Password"
          value={newMember.password}
          onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
          className="p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-200 w-1/4"
        />
        <button
          onClick={handleNewUser}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          ➕ New User
        </button>
      </div>

      {/* Protected Content */}
      {token ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.length > 0 ? (
            members.map(member => (
              <MemberCard key={member.id} member={member}/>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg italic col-span-full py-10">
              No members found.
            </p>
          )}
        </div>
      ) : (
        <p className="text-center text-red-500 text-xl font-semibold py-10">
          🔒 Please log in to access notes.
        </p>
      )}
    </main>
  );
}