'use client';

import { trpc } from '@/app/_trpc/client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [noteTexts, setNoteTexts] = useState<{ [memberId: string]: string }>({});
  const [editNoteIds, setEditNoteIds] = useState<{ [key: string]: string | null }>({});
  const [editTexts, setEditTexts] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Load token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // tRPC Context
  const utils = trpc.useContext();

  // Fetch members (only when token exists)
  const { data: members = [] } = trpc.member.getAll.useQuery(
    token ? { token } : '',
    { enabled: !!token }
  );

  // Mutations
  const createNote = trpc.member.createNote.useMutation({
    onSuccess: () => {
      utils.member.getAll.invalidate();
    },
  });

  const updateNote = trpc.member.updateNote.useMutation({
    onSuccess: () => {
      utils.member.getAll.invalidate();
      setEditNoteIds({});
      setEditTexts({});
    },
  });

  const deleteNote = trpc.member.deleteNote.useMutation({
    onSuccess: () => {
      utils.member.getAll.invalidate();
    },
  });

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.reload();
  };

  // Filter members based on search term
  const filteredMembers = members
    .map(member => ({
      ...member,
      notes: member.notes.filter(note =>
        note.text.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(member => member.notes.length > 0 || searchTerm === '');

  // Read note aloud
  const readNote = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  };

  return (
    <main className="container mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold mb-8 text-blue-700">📜 Member Notes Kibu</h1>
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            🚪 Logout
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="🔍 Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Protected Content */}
      {token ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.length > 0 ? (
            filteredMembers.map(member => (
              <div
                key={member.id}
                className="bg-white shadow-lg p-6 rounded-xl border border-gray-200"
              >
                <h2 className="text-2xl font-semibold text-gray-700">
                  {member.firstName} {member.lastName}
                </h2>

                {/* Notes Section */}
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-600">📝 Notes:</h3>
                  {member.notes.map(note => {
                    const uniqueKey = `${member.id}-${note.id}`;

                    return (
                      <div
                        key={uniqueKey}
                        className={`p-4 rounded-lg mt-3 shadow-sm flex justify-between items-center ${
                          editNoteIds[uniqueKey] ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}
                      >
                        {/* Editing Mode */}
                        {editNoteIds[uniqueKey] ? (
                          <div className="flex-grow">
                            <textarea
                              value={editTexts[uniqueKey] || note.text}
                              onChange={(e) =>
                                setEditTexts({
                                  ...editTexts,
                                  [uniqueKey]: e.target.value,
                                })
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                            />
                            <div className="mt-3 flex gap-3">
                            <button
  onClick={() => {
    updateNote.mutate({
      noteId: note.id,
      memberId: member.id, // Ensure memberId is passed
      text: editTexts[`${member.id}-${note.id}`] || note.text, // Fetch correct text
    });
    setEditNoteIds({ ...editNoteIds, [`${member.id}-${note.id}`]: null });
    setEditTexts({ ...editTexts, [`${member.id}-${note.id}`]: '' });
  }}
  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
>
  .Save
</button>

                              <button
                                onClick={() => {
                                  setEditNoteIds({ ...editNoteIds, [uniqueKey]: null });
                                  setEditTexts({});
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                              >
                                ❌ Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Display Mode
                          <div className="flex-grow">
                            <p className="text-gray-800">{note.text}</p>
                            {note.timestamp ? (
                              <p className="text-sm text-gray-500 mt-1">
                                🕒 {new Date(note.timestamp).toLocaleString()}
                              </p>
                            ) : (
                              <p className="text-gray-500 text-sm italic">No timestamp</p>
                            )}
                            <div className="mt-3 flex gap-3">
                              <button
                                onClick={() => {
                                  setEditNoteIds({ ...editNoteIds, [uniqueKey]: note.id });
                                  setEditTexts({
                                    ...editTexts,
                                    [uniqueKey]: note.text,
                                  });
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => deleteNote.mutate({ noteId: note.id })}
                                className="text-red-600 hover:text-red-800 text-sm font-medium transition"
                              >
                                🗑️ Delete
                              </button>
                              <button
                                onClick={() => readNote(note.text)}
                                className="text-purple-600 hover:text-purple-800 text-sm font-medium transition"
                              >
                                🔊 Read
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Note Form */}
                <div className="mt-6">
                  <textarea
                    value={noteTexts[member.id] || ''}
                    onChange={(e) => setNoteTexts({ ...noteTexts, [member.id]: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                    placeholder="Write a new note..."
                  />
                  <button
                    onClick={() => {
                      createNote.mutate({ memberId: member.id, text: noteTexts[member.id] || '' });
                      setNoteTexts({ ...noteTexts, [member.id]: '' });
                    }}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg w-full transition"
                    disabled={createNote.isLoading || !(noteTexts[member.id] || '').trim()}
                  >
                    ➕ Add Note
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg italic">
              No notes found.
            </p>
          )}
        </div>
      ) : (
        <p className="text-center text-red-500 text-lg font-semibold">🔒 Please log in to access notes.</p>
      )}
    </main>
  );
}
