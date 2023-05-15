'use client';

import { trpc } from '@/app/_trpc/client';
import { useState, useEffect } from 'react';
import { MemberWithNotes } from '@/types';


interface MemberCardProps{
    member:MemberWithNotes;
    handleUnlock :(member:string)=> void;
    unlockedMembers:  {[memberId:string]:boolean};
    passwordInputs : {[memberId:string]:string};
    setPasswordInputs: (value: { [memberId:string]:string}) => void;


}


const MemberCard: React.FC<MemberCardProps>=({
    member,
    handleUnlock,
    unlockedMembers,
    passwordInputs,
    setPasswordInputs,
}) => {

    const [noteTexts, setNoteTexts] = useState<{ [memberId: string]: string }>({});
    const [editNoteIds, setEditNoteIds] = useState<{ [key: string]: string | null }>({});
    const [editTexts, setEditTexts] = useState<{ [key: string]: string }>({});
   
  const utils = trpc.useContext();
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
  const handleAddNote = (memberId: string, text: string) => {
    if (!text.trim() || !unlockedMembers[memberId]) return;

    createNote.mutate({
      memberId: memberId.trim(),
      text: text.trim(),
    });

    setNoteTexts({ ...noteTexts, [memberId]: '' });
  };

 

  return(
    <div
    key={member.id}
    className="bg-white shadow-xl p-6 rounded-2xl border border-gray-200 hover:shadow-2xl transition-all duration-300"
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-4">
      {member.firstName} {member.lastName}
    </h2>

    {/* Password Unlock Section */}
    {!unlockedMembers[member.id] ? (
      <div className="mt-4">
        <div className="flex items-center gap-3">
          <input
            type="password"
            placeholder="Enter password to unlock"
            value={passwordInputs[member.id] || ''}
            onChange={(e) =>
              setPasswordInputs({ ...passwordInputs, [member.id]: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm transition-all duration-200"
          />
          <button
            onClick={() => handleUnlock(member.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md transition-all duration-200 transform hover:scale-105"
          >
            🔓 Unlock
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-2">Notes are locked until password is verified</p>
      </div>
    ) : (
      // Notes Section
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">📝 Notes:</h3>
        {member.notes.map((note) => {
          const uniqueKey = `${member.id}-${note.id}`;

          return (
            <div
              key={uniqueKey}
              className={`p-4 rounded-xl mt-3 shadow-sm flex justify-between items-center transition-all duration-200 ${
                editNoteIds[uniqueKey] ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-100'
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm resize-none h-24"
                  />
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => {
                        updateNote.mutate({
                          noteId: note.id,
                          text: editTexts[uniqueKey] || note.text,
                        });
                        setEditNoteIds({ ...editNoteIds, [uniqueKey]: null });
                        setEditTexts({ ...editTexts, [uniqueKey]: '' });
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105"
                    >
                      ✅ Save
                    </button>
                    <button
                      onClick={() => {
                        setEditNoteIds({ ...editNoteIds, [uniqueKey]: null });
                        setEditTexts({});
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div className="flex-grow">
                  <p className="text-gray-800 leading-relaxed">{note.text}</p>
                  {note.timestamp ? (
                    <p className="text-sm text-gray-500 mt-2">
                      🕒 {new Date(note.timestamp).toLocaleString()}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm italic mt-2">No timestamp</p>
                  )}
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => {
                        setEditNoteIds({ ...editNoteIds, [uniqueKey]: note.id });
                        setEditTexts({
                          ...editTexts,
                          [uniqueKey]: note.text,
                        });
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-all duration-200 hover:underline"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteNote.mutate({ noteId: note.id })}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-all duration-200 hover:underline"
                    >
                      🗑️ Delete
                    </button>
                    <button
                      onClick={() => {
                        const speech = new SpeechSynthesisUtterance(note.text);
                        window.speechSynthesis.speak(speech);
                      }}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-all duration-200 hover:underline"
                    >
                      🔊 Read
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add New Note Section */}
        <div className="mt-6">
          <textarea
            value={noteTexts[member.id] || ''}
            onChange={(e) => setNoteTexts({
              ...noteTexts,
              [member.id]: e.target.value
            })}
            placeholder="Add a new note..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-sm resize-none h-24 transition-all duration-200"
          />
          <button
            onClick={() => handleAddNote(member.id, noteTexts[member.id] || '')}
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            ➕ Add Note
          </button>
        </div>
      </div>
    )}
  </div>
  );
}

export default MemberCard;