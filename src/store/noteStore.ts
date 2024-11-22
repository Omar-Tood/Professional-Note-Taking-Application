import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Note, Folder, NoteType } from '../types/note';

interface NoteStore {
  notes: Note[];
  folders: Folder[];
  activeNote: string | null;
  darkMode: boolean;
  searchQuery: string;
  selectedTag: string | null;
  hasVisitedBefore: boolean;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  toggleDarkMode: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  addFolder: (name: string, parentId?: string | null) => void;
  deleteFolder: (id: string) => void;
  updateFolder: (id: string, name: string) => void;
  setHasVisitedBefore: (value: boolean) => void;
  resetHasVisitedBefore: () => void;
}

const storage = createJSONStorage(() => localStorage, {
  reviver: (key, value) => {
    if (key === 'createdAt' || key === 'updatedAt') {
      return new Date(value);
    }
    return value;
  }
});

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      notes: [],
      folders: [],
      activeNote: null,
      darkMode: false,
      searchQuery: '',
      selectedTag: null,
      hasVisitedBefore: false,

      addNote: (note) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...note,
              id: nanoid(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          activeNote: state.activeNote === id ? null : state.activeNote,
        })),

      setActiveNote: (id) => set({ activeNote: id }),
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      setSearchQuery: (query) => set({ searchQuery: query }),

      setSelectedTag: (tag) => set({ selectedTag: tag }),

      addFolder: (name, parentId = null) =>
        set((state) => ({
          folders: [
            ...state.folders,
            {
              id: nanoid(),
              name,
              parentId,
              createdAt: new Date(),
            },
          ],
        })),

      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          notes: state.notes.map((note) =>
            note.folderId === id ? { ...note, folderId: null } : note
          ),
        })),

      updateFolder: (id, name) =>
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, name } : folder
          ),
        })),

      setHasVisitedBefore: (value) => set({ hasVisitedBefore: value }),
      
      resetHasVisitedBefore: () => set({ hasVisitedBefore: false }),
    }),
    {
      name: 'notes-storage',
      storage,
      partialize: (state) => ({
        notes: state.notes,
        folders: state.folders,
        darkMode: state.darkMode,
        hasVisitedBefore: state.hasVisitedBefore
      }),
    }
  )
);