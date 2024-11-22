export type NoteType = 'text' | 'rich-text' | 'markdown' | 'code' | 'checklist';

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  tags: string[];
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
}