import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Note {
  id: string;
  member: string;
  text: string;
  timestamp?: string;
}

interface Database {
  users: User[];
  members: Member[];
  notes: Note[];
}

export function getDb(): Database {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], members: [], notes: [] }, null, 2));
  }

  const data = fs.readFileSync(dbPath, 'utf-8');
  const db: Database = JSON.parse(data);

  // .Ensure users, members, and notes exist
  db.users = db.users || [];
  db.members = db.members || [];
  db.notes = db.notes || [];

  return db;
}

export function saveDb(db: Database) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
