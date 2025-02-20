import { Member, Note } from '@/lib/db';

export interface MemberWithNotes extends Member {
  notes: Note[];
}
