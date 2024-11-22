import React, { useState } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { Play, Trash2 } from 'lucide-react';
import SplitPane from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

interface ConsoleOutput {
  type: 'log' | 'error';
  content: string;
  timestamp: Date;
}

export default function CodeEditor({ content, onChange }: Props) {
  const [consoleOutput, setConsoleOutput] = useState<ConsoleOutput[]>([]);
  const [sizes, setSizes] = useState<(number | string)[]>(['70%', '30%']);

  const executeCode = () => {
    // Clear previous output
    setConsoleOutput([]);

    // Create a custom console.log
    const customLog = (...args: any[]) => {
      setConsoleOutput(prev => [...prev, {
        type: 'log',
        content: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '),
        timestamp: new Date()
      }]);
    };

    try {
      // Create a function from the code string
      const wrappedCode = `
        return (function() {
          const console = { log: customLog };
          ${content}
        })();
      `;
      
      // Execute the code
      new Function('customLog', wrappedCode)(customLog);
    } catch (error) {
      setConsoleOutput(prev => [...prev, {
        type: 'error',
        content: error instanceof Error ? error.message : String(error),
        timestamp: new Date()
      }]);
    }
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  return (
    <div className="h-full">
      <SplitPane
        split="horizontal"
        sizes={sizes}
        onChange={setSizes}
      >
        <div className="h-full">
          <MonacoEditor
            height="100%"
            defaultLanguage="javascript"
            value={content}
            onChange={(value) => onChange(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              padding: { top: 16 }
            }}
          />
        </div>
        <div className="bg-gray-900 text-white p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Console Output</h3>
              <button
                onClick={executeCode}
                className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-1"
              >
                <Play size={12} />
                Run
              </button>
            </div>
            <button
              onClick={clearConsole}
              className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center gap-1"
            >
              <Trash2 size={12} />
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-auto font-mono text-sm">
            {consoleOutput.map((output, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  output.type === 'error' ? 'text-red-400' : 'text-green-400'
                }`}
              >
                <span className="text-gray-500 text-xs">
                  [{output.timestamp.toLocaleTimeString()}]
                </span>{' '}
                <span className="whitespace-pre-wrap">{output.content}</span>
              </div>
            ))}
            {consoleOutput.length === 0 && (
              <div className="text-gray-500 text-sm italic">
                No output yet. Click "Run" to execute your code.
              </div>
            )}
          </div>
        </div>
      </SplitPane>
    </div>
  );
}