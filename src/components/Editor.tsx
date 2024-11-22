import React from 'react';
import { useNoteStore } from '../store/noteStore';
import { Save } from 'lucide-react';
import MarkdownEditor from './editors/MarkdownEditor';
import RichTextEditor from './editors/RichTextEditor';
import CodeEditor from './editors/CodeEditor';
import ChecklistEditor from './editors/ChecklistEditor';
import PlainTextEditor from './editors/PlainTextEditor';
import TagPicker from './TagPicker';
import AiAssistant from './AiAssistant';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function Editor() {
  const activeNote = useNoteStore((state) => 
    state.notes.find((note) => note.id === state.activeNote)
  );
  const updateNote = useNoteStore((state) => state.updateNote);
  const { toast } = useToast();

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Select or create a note to start editing</p>
      </div>
    );
  }

  const handleSave = () => {
    updateNote(activeNote.id, {
      title: activeNote.title,
      content: activeNote.content,
      updatedAt: new Date()
    });

    toast({
      title: "Note Saved",
      description: `${activeNote.title || 'Untitled'} has been saved`,
      variant: "success",
    });
  };

  const handleTagsChange = (newTags: string[]) => {
    updateNote(activeNote.id, { 
      tags: newTags,
      updatedAt: new Date()
    });

    toast({
      title: "Tags Updated",
      description: "Note tags have been updated",
      variant: "default",
    });
  };

  const renderEditor = () => {
    const props = {
      content: activeNote.content,
      onChange: (content: string) => updateNote(activeNote.id, { 
        content,
        updatedAt: new Date()
      })
    };

    switch (activeNote.type) {
      case 'markdown':
        return <MarkdownEditor {...props} />;
      case 'rich-text':
        return <RichTextEditor {...props} />;
      case 'code':
        return <CodeEditor {...props} />;
      case 'checklist':
        return <ChecklistEditor {...props} />;
      default:
        return <PlainTextEditor {...props} />;
    }
  };

  const createdAt = activeNote.createdAt instanceof Date ? activeNote.createdAt : new Date(activeNote.createdAt);
  const updatedAt = activeNote.updatedAt instanceof Date ? activeNote.updatedAt : new Date(activeNote.updatedAt);
  const isEdited = updatedAt.getTime() - createdAt.getTime() > 1000;

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 relative">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => updateNote(activeNote.id, { 
                title: e.target.value,
                updatedAt: new Date()
              })}
              placeholder="Note title"
              className="text-xl font-semibold bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 dark:text-white w-full"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Created {formatDistanceToNow(createdAt, { addSuffix: true })}
              {isEdited && (
                <span className="ml-2">
                  • Last edited {formatDistanceToNow(updatedAt, { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Save size={18} />
            Save
          </button>
        </div>
        <TagPicker 
          tags={activeNote.tags} 
          onTagsChange={handleTagsChange} 
        />
      </div>
      
      <div className="flex-1 overflow-hidden">
        {renderEditor()}
      </div>

      <AiAssistant />
    </div>
  );
}