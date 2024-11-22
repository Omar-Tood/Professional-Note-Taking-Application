import React from 'react';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

export default function PlainTextEditor({ content, onChange }: Props) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Start writing..."
      className="w-full h-full resize-none bg-transparent focus:outline-none dark:text-white p-4"
    />
  );
}