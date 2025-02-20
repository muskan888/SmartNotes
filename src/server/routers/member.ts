import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { getDb, saveDb } from '@/lib/db';

export const memberRouter = router({
  // Returns all members with their notes.
  getAll: publicProcedure.query(() => {
    const db = getDb();
    return db.members.map(member => ({
      ...member,
      notes: db.notes.filter(note => note.member === member.id),
    }));
  }),

  // Creates a new note (requires memberId and text).
  createNote: publicProcedure
    .input(z.object({ memberId: z.string(), text: z.string().min(1) }))
    .mutation(({ input }) => {
      const db = getDb();
      const newNote = {
        id: String(db.notes.length + 1),
        member: input.memberId,
        text: input.text,
        timestamp: new Date().toISOString(),
      };
      db.notes.push(newNote);
      saveDb(db);
      return newNote;
    }),

  // Updates text and timestamp of an existing note (requires noteId and text).
  updateNote: publicProcedure
  .input(z.object({
    noteId: z.string(),
    memberId: z.string(), // pass the member in too
    text: z.string().min(1),
  }))
  .mutation(({ input }) => {
    const db = getDb();
    
    // search for the note by BOTH noteId and member
    const noteIndex = db.notes.findIndex(
      note => note.id === input.noteId && note.member === input.memberId
    );
    if (noteIndex === -1) throw new Error("Note not found");

    db.notes[noteIndex].text = input.text;
    db.notes[noteIndex].timestamp = new Date().toISOString();
    saveDb(db);
    return db.notes[noteIndex];
  }),


  // Deletes a note by its ID.
  deleteNote: publicProcedure
    .input(z.object({ noteId: z.string() }))
    .mutation(({ input }) => {
      const db = getDb();
      const updatedNotes = db.notes.filter(note => note.id !== input.noteId);
      if (updatedNotes.length === db.notes.length) throw new Error("Note not found");
      db.notes = updatedNotes;
      saveDb(db);
      return { success: true };
    }),
});

export type MemberRouter = typeof memberRouter;
