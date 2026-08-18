export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

// export type NewNote = Omit<Note, "id" | "createdAt" | "updatedAt">;

export interface NewNote {
  title: string;
  content?: string;
  tag: NoteTag;
}
