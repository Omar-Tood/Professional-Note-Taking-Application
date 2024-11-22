import React, { useState } from 'react';
import { X, FileText, Type, Code, FileCheck, FileCode } from 'lucide-react';
import { useNoteStore } from '../store/noteStore';
import { NoteType } from '../types/note';
import { useToast } from '@/components/ui/use-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const noteTypes = [
  { id: 'text' as NoteType, label: 'Plain Text', icon: FileText, description: 'Simple text notes' },
  { id: 'rich-text' as NoteType, label: 'Rich Text', icon: Type, description: 'Formatted text with styling' },
  { id: 'markdown' as NoteType, label: 'Markdown', icon: FileCode, description: 'Write in Markdown syntax' },
  { id: 'code' as NoteType, label: 'Code', icon: Code, description: 'Code snippets with syntax highlighting' },
  { id: 'checklist' as NoteType, label: 'Checklist', icon: FileCheck, description: 'Task list with checkboxes' },
];

export default function CreateNoteModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<NoteType>('text');
  const addNote = useNoteStore((state) => state.addNote);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const initialContent = type === 'checklist' ? '[ ] New item' : '';
    addNote({
      title,
      content: initialContent,
      type,
      tags: [],
      folderId: null,
      isPinned: false,
    });
    
    toast({
      title: "Note Created",
      description: `${title || 'Untitled'} has been created`,
      variant: "success",
    });
    
    onClose();
    setTitle('');
    setType('text');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Create New Note</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Note title"
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Type
            </label>
            <div className="grid grid-cols-1 gap-2">
              {noteTypes.map((noteType) => (
                <button
                  key={noteType.id}
                  type="button"
                  onClick={() => setType(noteType.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    type === noteType.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <noteType.icon className={`${
                    type === noteType.id ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className={`font-medium ${
                      type === noteType.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-200'
                    }`}>
                      {noteType.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {noteType.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}