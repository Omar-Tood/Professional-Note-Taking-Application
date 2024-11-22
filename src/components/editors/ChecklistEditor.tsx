import React from 'react';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

export default function ChecklistEditor({ content, onChange }: Props) {
  return (
    <div className="flex-1 p-4">
      {content.split('\n').map((item, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={item.startsWith('[x]')}
            onChange={(e) => {
              const lines = content.split('\n');
              lines[index] = e.target.checked ? 
                `[x] ${item.replace(/^\[[ x]\] /, '')}` : 
                `[ ] ${item.replace(/^\[[ x]\] /, '')}`;
              onChange(lines.join('\n'));
            }}
            className="h-4 w-4 rounded border-gray-300"
          />
          <input
            type="text"
            value={item.replace(/^\[[ x]\] /, '')}
            onChange={(e) => {
              const lines = content.split('\n');
              lines[index] = `[${item.startsWith('[x]') ? 'x' : ' '}] ${e.target.value}`;
              onChange(lines.join('\n'));
            }}
            className="flex-1 bg-transparent border-none focus:outline-none dark:text-white"
            placeholder="Add a task..."
          />
        </div>
      ))}
      <button
        onClick={() => onChange(content + '\n[ ] ')}
        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        + Add item
      </button>
    </div>
  );
}