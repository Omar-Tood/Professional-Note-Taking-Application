import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Columns, Maximize2, Minimize2 } from 'lucide-react';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

export default function MarkdownEditor({ content, onChange }: Props) {
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');

  const getNextViewMode = () => {
    switch (viewMode) {
      case 'split': return 'edit';
      case 'edit': return 'preview';
      case 'preview': return 'split';
    }
  };

  const getViewIcon = () => {
    switch (viewMode) {
      case 'split': return Maximize2;
      case 'edit': return Minimize2;
      case 'preview': return Columns;
    }
  };

  const ViewIcon = getViewIcon();

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end p-2 border-b dark:border-gray-800">
        <button
          onClick={() => setViewMode(getNextViewMode())}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300"
          title="Change view mode"
        >
          <ViewIcon size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        {viewMode === 'split' ? (
          <div className="grid grid-cols-2 h-full divide-x dark:divide-gray-800">
            <div className="overflow-auto">
              <MDEditor
                value={content}
                onChange={(value) => onChange(value || '')}
                preview="edit"
                hideToolbar={false}
                className="w-full h-full border-0"
                height="100%"
              />
            </div>
            <div className="overflow-auto bg-white dark:bg-gray-900 p-4">
              <MDEditor.Markdown 
                source={content} 
                className="prose dark:prose-invert max-w-none"
              />
            </div>
          </div>
        ) : (
          viewMode === 'edit' ? (
            <MDEditor
              value={content}
              onChange={(value) => onChange(value || '')}
              preview="edit"
              hideToolbar={false}
              className="w-full h-full border-0"
              height="100%"
            />
          ) : (
            <div className="overflow-auto bg-white dark:bg-gray-900 p-4">
              <MDEditor.Markdown 
                source={content} 
                className="prose dark:prose-invert max-w-none"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}