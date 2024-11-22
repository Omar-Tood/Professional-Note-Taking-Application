import React, { useState } from 'react';
import { Bot, X, Sparkles, Tag, FolderTree, Brain, Send, Loader2, AlertCircle } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useNoteStore } from '../store/noteStore';
import { generateSuggestions, hasApiKey } from '../lib/ai';

interface Suggestion {
  type: 'tag' | 'folder' | 'organization';
  content: string;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { notes, activeNote, updateNote, addFolder } = useNoteStore();
  const currentNote = notes.find(note => note.id === activeNote);

  const handleAnalyze = async () => {
    if (!currentNote?.content) {
      setError('Please add some content to your note before analyzing.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const result = await generateSuggestions(currentNote.content);
      const newSuggestions: Suggestion[] = [];
      
      // Process tag suggestions
      result.tags?.forEach(tag => {
        if (!currentNote.tags.includes(tag)) {
          newSuggestions.push({ type: 'tag', content: tag });
        }
      });
      
      // Process folder suggestions
      result.folders?.forEach(folder => {
        newSuggestions.push({ type: 'folder', content: folder });
      });
      
      // Process organization suggestions
      result.organization?.forEach(org => {
        newSuggestions.push({ type: 'organization', content: org });
      });

      if (newSuggestions.length === 0) {
        setError('No new suggestions available for this note.');
      } else {
        setSuggestions(newSuggestions);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze note';
      setError(errorMessage);
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (suggestion: Suggestion) => {
    if (!currentNote) return;

    try {
      switch (suggestion.type) {
        case 'tag':
          if (!currentNote.tags.includes(suggestion.content)) {
            updateNote(currentNote.id, {
              tags: [...currentNote.tags, suggestion.content],
              updatedAt: new Date()
            });
            setSuggestions(prev => prev.filter(s => 
              !(s.type === 'tag' && s.content === suggestion.content)
            ));
          }
          break;
        case 'folder':
          addFolder(suggestion.content);
          setSuggestions(prev => prev.filter(s => 
            !(s.type === 'folder' && s.content === suggestion.content)
          ));
          break;
      }
    } catch (err) {
      console.error('Failed to apply suggestion:', err);
      setError('Failed to apply suggestion. Please try again.');
    }
  };

  if (!currentNote) return null;

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          className="fixed bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
          aria-label="AI Assistant"
        >
          <Bot size={24} />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-2"
          sideOffset={5}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              </div>
              <Popover.Close className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <X size={18} />
              </Popover.Close>
            </div>

            {!hasApiKey && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-2 text-yellow-600 dark:text-yellow-400">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Please add your Gemini API key to enable AI features.</p>
                </div>
              </div>
            )}

            <div className="mb-4">
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !hasApiKey}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Analyze Note
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <div className="flex items-start gap-2">
                      {suggestion.type === 'tag' && <Tag className="w-4 h-4 text-blue-600 mt-1" />}
                      {suggestion.type === 'folder' && <FolderTree className="w-4 h-4 text-green-600 mt-1" />}
                      {suggestion.type === 'organization' && <Sparkles className="w-4 h-4 text-amber-600 mt-1" />}
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {suggestion.content}
                        </p>
                        {(suggestion.type === 'tag' || suggestion.type === 'folder') && (
                          <button
                            onClick={() => handleSuggestion(suggestion)}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Apply suggestion →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!error && !isLoading && suggestions.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click "Analyze Note" to get AI-powered suggestions for your note.
              </p>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}