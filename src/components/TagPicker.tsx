import React, { useState, useEffect } from 'react';
import { Tag as TagIcon, Plus, X } from 'lucide-react';
import { useNoteStore } from '../store/noteStore';

interface Props {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

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

export default function TagPicker({ tags, onTagsChange }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');
  const setSelectedTag = useNoteStore((state) => state.setSelectedTag);
  const selectedTag = useNoteStore((state) => state.selectedTag);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      onTagsChange(updatedTags);
      setNewTag('');
      setIsAdding(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    onTagsChange(updatedTags);
    if (selectedTag === tagToRemove) {
      setSelectedTag(null);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(e as any);
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTag('');
    }
  };

  useEffect(() => {
    if (!isAdding) {
      setNewTag('');
    }
  }, [isAdding]);

  return (
    <div className="flex flex-wrap gap-2 items-center min-h-[32px]">
      {tags.map(tag => (
        <span
          key={tag}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm cursor-pointer transition-colors ${
            selectedTag === tag 
              ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900'
              : ''
          } ${getColorForTag(tag)}`}
          onClick={() => handleTagClick(tag)}
        >
          <TagIcon size={14} />
          {tag}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveTag(tag);
            }}
            className="hover:text-gray-700 dark:hover:text-gray-300 p-0.5 rounded-full"
          >
            <X size={14} />
          </button>
        </span>
      ))}
      
      {isAdding ? (
        <form onSubmit={handleAddTag} className="inline-flex">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add tag..."
            className="px-2 py-1 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            onBlur={() => {
              if (!newTag.trim()) {
                setIsAdding(false);
              }
            }}
          />
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add tag
        </button>
      )}
    </div>
  );
}