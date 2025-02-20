import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { getDb, saveDb } from '@/lib/db';

export const memberRouter = router({
  // Get all members and their notes
  getAll: publicProcedure.query(() => {
    const db = getDb();
    return db.members.map(member => ({
      ...member,
      notes: db.notes.filter(note => note.member === member.id),
    }));
  }),

  // Create a new member (New User Registration)
  createMember: publicProcedure
    .input(z.object({ firstName: z.string().min(1), lastName: z.string().min(1), password: z.string().min(1) }))
    .mutation(({ input }) => {
      const db = getDb();

      // Check if the user already exists
      const existingUser = db.members.find(
        (m) =>
          m.firstName.toLowerCase() === input.firstName.toLowerCase() &&
          m.lastName.toLowerCase() === input.lastName.toLowerCase()
      );

      if (existingUser) {
        return existingUser; // Return existing user
      }

      // Create new user with password
      const newMember = {
        id: String(Date.now()), // Unique ID
        firstName: input.firstName,
        lastName: input.lastName,
        password: input.password, // In production, hash this!
        email: '',
      };

      db.members.push(newMember);
      saveDb(db);
      return newMember;
    }),

  // Create a new note for a specific member
  createNote: publicProcedure
    .input(z.object({ memberId: z.string(), text: z.string().min(1) }))
    .mutation(({ input }) => {
      const db = getDb();
      const member = db.members.find(m => m.id === input.memberId);
      
      if (!member) {
        throw new Error("Error: Invalid member. Please select a valid user.");
      }

      const newNote = {
        id: String(Date.now()),
        member: member.id,
        text: input.text,
        timestamp: new Date().toISOString(),
      };

      db.notes.push(newNote);
      saveDb(db);
      return newNote;
    }),

  // Update an existing note and log changes in the audit log
  updateNote: publicProcedure
    .input(z.object({ noteId: z.string(), text: z.string().min(1) }))
    .mutation(({ input }) => {
      const db = getDb();
      const noteIndex = db.notes.findIndex(note => note.id === input.noteId);
      if (noteIndex === -1) {
        throw new Error("Note not found");
      }

      const previousText = db.notes[noteIndex].text;
      const newText = input.text;
      
      db.notes[noteIndex].text = newText;
      db.notes[noteIndex].timestamp = new Date().toISOString();

      const newAuditLog = {
        id: String(Date.now()),
        noteId: input.noteId,
        previousText: previousText,
        updatedText: newText,
        timestamp: new Date().toISOString(),
      };

      if (!db.audit_log) {
        db.audit_log = [];
      }
      db.audit_log.push(newAuditLog);

      saveDb(db);
      return db.notes[noteIndex];
    }),

  // Delete a note by ID
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

  // Verify member password
  verifyPassword: publicProcedure
    .input(z.object({ memberId: z.string(), password: z.string() }))
    .mutation(({ input }) => {
      const db = getDb();
      const member = db.members.find(m => m.id === input.memberId);
      if (!member) {
        throw new Error("Member not found");
      }
      // In production, use bcrypt.compare() here
      return { isValid: member.password === input.password };
    }),
});

export type MemberRouter = typeof memberRouter;