import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  password: string; // Added password field
  email?: string;
}

export interface Note {
  id: string;
  member: string;
  text: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  noteId: string;
  previousText: string;
  updatedText: string;
  timestamp: string;
}

interface Database {
  members: Member[];
  notes: Note[];
  audit_log: AuditLog[];
}

export function getDb(): Database {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify({ members: [], notes: [], audit_log: [] }, null, 2)
    );
  }
  const data = fs.readFileSync(dbPath, 'utf-8');
  const db: Database = JSON.parse(data);

  db.audit_log = db.audit_log || [];
  db.members = db.members.map(member => ({
    ...member,
    email: member.email || '',
    password: member.password || '', // Ensure password field exists
  }));
  db.notes = db.notes || [];

  return db;
}

export function saveDb(db: Database) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}