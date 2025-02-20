import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { getDb, saveDb } from '@/lib/db';



export const memberRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    if (!ctx.token) {
      throw new Error("Unauthorized: Missing token");
    }

    const db = getDb();
    return db.members.map(member => ({
      ...member,
      notes: db.notes.filter(note => note.member === member.id),
    }));
  }),

  // Creates a new note with a timestamp.
  createNote: publicProcedure
    .input(z.object({ memberId: z.string(), text: z.string().min(1) }))
    .mutation(({ input }) => {
      const db = getDb();
      // Generate a unique note ID (using Date.now() for simplicity)
      const newNote = {
        id: String(Date.now()),
        member: input.memberId,
        text: input.text,
        timestamp: new Date().toISOString(),
      };
      db.notes.push(newNote);
      saveDb(db);
      return newNote;
    }),

  // Updates an existing note and logs the change in the audit log.
  updateNote: publicProcedure
    .input(z.object({ noteId: z.string(), text: z.string().min(1) }))
    .mutation(({ input }) => {
      const db = getDb();
      const noteIndex = db.notes.findIndex(note => note.id === input.noteId);
      if (noteIndex === -1) {
        throw new Error("Note not found");
      }

      // Store the previous text before updating
      const previousText = db.notes[noteIndex].text;
      const newText = input.text;
      
      // Update the note's text and refresh the timestamp
      db.notes[noteIndex].text = newText;
      db.notes[noteIndex].timestamp = new Date().toISOString();

      // Create an audit log entry for this update
      const newAuditLog = {
        id: String(Date.now()), // Unique audit log ID
        noteId: input.noteId,
        previousText: previousText,
        updatedText: newText,
        timestamp: new Date().toISOString(),
      };

      // Ensure that the audit_log property exists in the db
      if (!db.audit_log) {
        db.audit_log = [];
      }
      db.audit_log.push(newAuditLog);

      saveDb(db);
      return db.notes[noteIndex];
    }),

  // Deletes a note by its ID.
  deleteNote: publicProcedure
    .input(z.object({ noteId: z.string() }))
    .mutation(({ input }) => {
      const db = getDb();
      const updatedNotes = db.notes.filter(note => note.id !== input.noteId);
      if (updatedNotes.length === db.notes.length) {
        throw new Error("Note not found");
      }
      db.notes = updatedNotes;
      saveDb(db);
      return { success: true };
    }),
});

export type MemberRouter = typeof memberRouter;
