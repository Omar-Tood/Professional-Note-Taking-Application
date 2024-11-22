import React, { useState } from 'react';
import { 
  PlusCircle, 
  FolderPlus, 
  Search, 
  Moon, 
  Sun,
  BookMarked,
  Tag,
  Clock,
  Hash,
  X,
  Home,
  ChevronRight,
  ChevronDown,
  Folder,
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';
import { useNoteStore } from '../store/noteStore';
import NoteList from './NoteList';
import CreateNoteModal from './CreateNoteModal';
import CreateFolderDialog from './dialogs/CreateFolderDialog';
import DeleteFolderDialog from './dialogs/DeleteFolderDialog';

export default function Sidebar() {
  const { darkMode, toggleDarkMode, notes, folders, addFolder, deleteFolder, updateFolder, setSearchQuery } = useNoteStore();
  const [searchQuery, setLocalSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'tags' | 'recent'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [deletingFolder, setDeletingFolder] = useState<{ id: string; name: string } | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showFolderMenu, setShowFolderMenu] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<{ id: string; name: string } | null>(null);

  const uniqueTags = [...new Set(notes.flatMap(note => note.tags))];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    setSearchQuery(value);
  };

  const handleCreateFolder = (name: string) => {
    addFolder(name.trim());
  };

  const handleDeleteFolder = (folderId: string) => {
    deleteFolder(folderId);
    setShowFolderMenu(null);
  };

  const handleEditFolder = (id: string, name: string) => {
    setEditingFolder({ id, name });
    setShowFolderMenu(null);
  };

  const toggleFolderExpansion = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const renderFolders = (parentId: string | null = null, level = 0) => {
    const folderList = folders.filter(f => f.parentId === parentId);
    
    return folderList.map(folder => (
      <div key={folder.id} style={{ marginLeft: `${level * 12}px` }}>
        <div className="group flex items-center gap-1 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative">
          <button
            onClick={() => toggleFolderExpansion(folder.id)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {expandedFolders.has(folder.id) ? (
              <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight size={16} className="text-gray-500 dark:text-gray-400" />
            )}
          </button>
          <Folder size={16} className="text-gray-500 dark:text-gray-400" />
          <span className="flex-1 text-sm text-gray-700 dark:text-gray-200 font-medium">
            {folder.name}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFolderMenu(showFolderMenu === folder.id ? null : folder.id);
            }}
            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
          >
            <MoreVertical size={16} className="text-gray-500 dark:text-gray-400" />
          </button>
          
          {showFolderMenu === folder.id && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 z-10">
              <button
                onClick={() => handleEditFolder(folder.id, folder.name)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit2 size={14} />
                Rename
              </button>
              <button
                onClick={() => {
                  setDeletingFolder({ id: folder.id, name: folder.name });
                  setShowFolderMenu(null);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
        
        {expandedFolders.has(folder.id) && (
          <div className="mt-1">
            {renderFolders(folder.id, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
      <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Notes</h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              <PlusCircle size={18} />
              New Note
            </button>
            <button 
              onClick={() => setIsCreateFolderOpen(true)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <FolderPlus size={18} />
              New Folder
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-hidden flex flex-col">
          <div className="px-4 mb-2">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {[
                { id: 'all', icon: BookMarked, label: 'All' },
                { id: 'tags', icon: Tag, label: 'Tags' },
                { id: 'recent', icon: Clock, label: 'Recent' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            {activeTab === 'all' && (
              <>
                <div className="mb-4 space-y-1">
                  {renderFolders()}
                </div>
                <NoteList />
              </>
            )}
            {activeTab === 'tags' && (
              <div className="space-y-1">
                {uniqueTags.map((tag) => (
                  <button
                    key={tag}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <Hash size={16} />
                    {tag}
                  </button>
                ))}
              </div>
            )}
            {activeTab === 'recent' && (
              <NoteList sortBy="recent" />
            )}
          </div>
        </nav>
      </div>

      <CreateNoteModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <CreateFolderDialog
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onConfirm={handleCreateFolder}
      />

      <DeleteFolderDialog
        isOpen={!!deletingFolder}
        onClose={() => setDeletingFolder(null)}
        onConfirm={() => {
          if (deletingFolder) {
            handleDeleteFolder(deletingFolder.id);
          }
          setDeletingFolder(null);
        }}
        folderName={deletingFolder?.name || ''}
      />
    </>
  );
}