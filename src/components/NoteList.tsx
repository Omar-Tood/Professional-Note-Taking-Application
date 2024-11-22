import React from 'react';
import { Pin, Trash2, TagIcon, Clock } from 'lucide-react';
import { useNoteStore } from '../store/noteStore';
import { formatDistanceToNow } from 'date-fns';
import { Note } from '../types/note';
import { useToast } from '@/components/ui/use-toast';

const TAG_COLORS = [
  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
];

const getColorForTag = (tag: string): string => {
  const hash = tag.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return TAG_COLORS[hash % TAG_COLORS.length];
};

interface Props {
  sortBy?: 'recent';
}

export default function NoteList({ sortBy }: Props) {
  const { 
    notes, 
    activeNote, 
    setActiveNote, 
    deleteNote, 
    updateNote, 
    searchQuery,
    selectedTag,
    setSelectedTag 
  } = useNoteStore();
  const { toast } = useToast();

  const filterNotes = (notes: Note[]) => {
    let filteredNotes = notes;

    // Filter by selected tag first
    if (selectedTag) {
      filteredNotes = filteredNotes.filter(note => 
        note.tags.includes(selectedTag)
      );
    }

    // Then apply search query if exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const isTagSearch = query.startsWith('#');
      
      if (isTagSearch) {
        const tagQuery = query.slice(1);
        filteredNotes = filteredNotes.filter(note => 
          note.tags.some(tag => tag.toLowerCase().includes(tagQuery))
        );
      } else {
        filteredNotes = filteredNotes.filter(note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
    }

    return filteredNotes;
  };

  const sortNotes = (notes: Note[]) => {
    return [...notes].sort((a, b) => {
      if (sortBy === 'recent') {
        const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt);
        const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      }

      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt);
      const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    deleteNote(noteId);
    toast({
      title: "Note Deleted",
      description: `"${noteTitle || 'Untitled'}" has been deleted`,
      variant: "destructive",
    });
  };

  const handleTogglePin = (noteId: string, isPinned: boolean, noteTitle: string) => {
    updateNote(noteId, { isPinned: !isPinned, updatedAt: new Date() });
    toast({
      title: isPinned ? "Note Unpinned" : "Note Pinned",
      description: `"${noteTitle || 'Untitled'}" has been ${isPinned ? 'unpinned' : 'pinned'}`,
      variant: "default",
    });
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const getTimeInfo = (note: Note) => {
    const createdAt = note.createdAt instanceof Date ? note.createdAt : new Date(note.createdAt);
    const updatedAt = note.updatedAt instanceof Date ? note.updatedAt : new Date(note.updatedAt);
    const isEdited = updatedAt.getTime() - createdAt.getTime() > 1000;

    return {
      timeAgo: formatDistanceToNow(updatedAt, { addSuffix: true }),
      isEdited
    };
  };

  const filteredAndSortedNotes = sortNotes(filterNotes(notes));

  if (filteredAndSortedNotes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {selectedTag ? (
          <>
            No notes with tag "#{selectedTag}"
            <button
              onClick={() => setSelectedTag(null)}
              className="block mx-auto mt-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Clear tag filter
            </button>
          </>
        ) : searchQuery ? (
          'No notes match your search'
        ) : (
          'No notes yet'
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {selectedTag && (
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 p-2 mb-2 border-b dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Filtering by tag: #{selectedTag}
            </span>
            <button
              onClick={() => setSelectedTag(null)}
              className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      {filteredAndSortedNotes.map((note) => {
        const { timeAgo, isEdited } = getTimeInfo(note);
        
        return (
          <div
            key={note.id}
            className={`group flex flex-col p-2 rounded-lg cursor-pointer ${
              activeNote === note.id
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setActiveNote(note.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate dark:text-gray-200">
                  {note.title || 'Untitled'}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{timeAgo}</span>
                  {isEdited && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">(edited)</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePin(note.id, note.isPinned, note.title);
                  }}
                  className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    note.isPinned ? 'text-blue-600 dark:text-blue-400' : ''
                  }`}
                >
                  <Pin size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id, note.title);
                  }}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {note.tags.map(tag => (
                  <span
                    key={tag}
                    onClick={(e) => handleTagClick(e, tag)}
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs cursor-pointer transition-colors ${
                      selectedTag === tag 
                        ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900'
                        : ''
                    } ${getColorForTag(tag)}`}
                  >
                    <TagIcon size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}