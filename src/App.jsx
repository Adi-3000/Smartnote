import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Book,
  Send,
  ChevronLeft,
  Search,
  Sparkles,
  Check,
  Upload,
  Folder,
  Hash,
  X,
  Clock,
  Sun,
  Moon,
  Settings,
  Database,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  GripVertical,
  Share2,
  MoveHorizontal,
  ListChecks,
  Archive,
  DownloadCloud,
  CheckSquare,
  RefreshCw,
  Cloud,
  Download,
  Copy,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List as ListIcon,
  ListOrdered,
  Image as ImageIcon,
  Quote
} from 'lucide-react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const EditorBlock = ({ content, onChange }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && content !== contentRef.current.innerHTML) {
      contentRef.current.innerHTML = content || '';
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      contentEditable
      onInput={e => {
        if (onChange) onChange(e.currentTarget.innerHTML);
      }}
      className="w-full h-full outline-none text-lg lg:text-xl leading-relaxed pt-4 pb-40 custom-editor"
      style={{ minHeight: '60vh' }}
    />
  );
};

export default function App() {
  // --- State Management ---
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('smart-notes-v6');
      return saved ? JSON.parse(saved) : [
        { id: '1', title: 'Welcome', content: 'This is your AI-powered workspace.', folderId: 'default', timestamp: Date.now() }
      ];
    } catch (e) {
      return [{ id: '1', title: 'Welcome', content: 'This is your AI-powered workspace.', folderId: 'default', timestamp: Date.now() }];
    }
  });

  const [folders, setFolders] = useState(() => {
    try {
      const saved = localStorage.getItem('smart-folders-v6');
      return saved ? JSON.parse(saved) : [{ id: 'default', name: 'General', color: '#6366f1' }];
    } catch (e) {
      return [{ id: 'default', name: 'General', color: '#6366f1' }];
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('smart-theme-v6');
      return stored !== null ? stored === 'dark' : true;
    } catch (e) {
      return true;
    }
  });

  const [viewMode, setViewMode] = useState('grid');
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [activeFolderId, setActiveFolderId] = useState('all');

  const [selectedNoteIds, setSelectedNoteIds] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [copyStatus, setCopyStatus] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const activeNote = notes.find(n => n.id === activeNoteId);

  useEffect(() => {
    localStorage.setItem('smart-notes-v6', JSON.stringify(notes));
    localStorage.setItem('smart-folders-v6', JSON.stringify(folders));
    localStorage.setItem('smart-theme-v6', darkMode ? 'dark' : 'light');
  }, [notes, folders, darkMode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Drag and Drop Logic ---
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    // Required for some browsers
    e.dataTransfer.setData("text/html", e.target.parentNode);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const remainingNotes = [...notes];
    const draggedItem = remainingNotes[draggedIdx];

    remainingNotes.splice(draggedIdx, 1);
    remainingNotes.splice(index, 0, draggedItem);

    setDraggedIdx(index);
    setNotes(remainingNotes);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const addNote = () => {
    const newNote = { id: Date.now().toString(), title: '', content: '', folderId: activeFolderId === 'all' ? 'default' : activeFolderId, timestamp: Date.now() };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setViewMode('editor');
    setIsSelectMode(false);
    setSelectedNoteIds([]);
  };

  const moveSelectedNotes = (targetFolderId) => {
    setNotes(prev => prev.map(n => selectedNoteIds.includes(n.id) ? { ...n, folderId: targetFolderId } : n));
    setActiveDropdown(null);
    setSelectedNoteIds([]);
    setIsSelectMode(false);
    const folderName = folders.find(f => f.id === targetFolderId)?.name;
    setCopyStatus(`Moved to ${folderName}`);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const deleteNotes = (ids) => {
    setNotes(prev => prev.filter(n => !ids.includes(n.id)));
    setSelectedNoteIds([]);
    if (ids.includes(activeNoteId)) {
      setActiveNoteId(null);
      setViewMode('grid');
    }
  };

  const getFilteredNotes = () => {
    return notes.filter(n => {
      const matchesFolder = activeFolderId === 'all' || n.folderId === activeFolderId;
      const matchesSearch = (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.content || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFolder && matchesSearch;
    });
  };

  const selectAllVisible = () => {
    const visibleIds = getFilteredNotes().map(n => n.id);
    setSelectedNoteIds(visibleIds);
  };

  const toggleSelectNote = (id) => {
    setSelectedNoteIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopyStatus('Copied to clipboard!');
    } catch (err) {
      setCopyStatus('Failed to copy');
    }
    document.body.removeChild(textArea);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const downloadFile = (content, fileName, contentType) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const shareSelectedNotes = (format) => {
    const targetNotes = notes.filter(n => selectedNoteIds.includes(n.id));
    if (targetNotes.length === 0) return;

    if (format === 'json') {
      copyToClipboard(JSON.stringify(targetNotes, null, 2));
    } else if (format === 'txt') {
      const shareContent = targetNotes.map(n => `TITLE: ${n.title || 'Untitled'}\n${n.content}\n`).join('\n---\n');
      copyToClipboard(shareContent);
    } else if (format === 'download') {
      const exportData = { notes: targetNotes, folders, exportDate: new Date().toISOString() };
      downloadFile(JSON.stringify(exportData, null, 2), `SmartNotes_Export_${Date.now()}.json`, 'application/json');
    } else if (format === 'system') {
      const text = targetNotes.map(n => `${n.title || 'Untitled'}\n${n.content}`).join('\n\n');
      if (navigator.share) {
        navigator.share({ title: 'My Smart Notes', text }).catch(() => copyToClipboard(text));
      } else {
        copyToClipboard(text);
      }
    }
    setActiveDropdown(null);
  };

  const handleBackup = (format = 'json') => {
    if (format === 'json') {
      const fullData = { notes, folders, version: 'v6', timestamp: Date.now() };
      downloadFile(JSON.stringify(fullData, null, 2), `SmartNotes_Full_Backup_${new Date().toLocaleDateString()}.json`, 'application/json');
      setCopyStatus('JSON Backup downloaded!');
    } else {
      const textData = notes.map(n => `NOTE: ${n.title || 'Untitled'}\nDATE: ${new Date(n.timestamp).toLocaleString()}\nFOLDER: ${folders.find(f => f.id === n.folderId)?.name || 'None'}\n\n${n.content}\n\n====================\n`).join('\n');
      downloadFile(textData, `SmartNotes_Text_Archive_${new Date().toLocaleDateString()}.txt`, 'text/plain');
      setCopyStatus('Text Archive downloaded!');
    }
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.notes && Array.isArray(data.notes)) {
          setNotes(prev => {
            const existingIds = new Set(prev.map(n => n.id));
            const newNotes = data.notes.filter(n => !existingIds.has(n.id));
            return [...newNotes, ...prev];
          });
          setCopyStatus('Data imported successfully!');
        }
      } catch (err) {
        setCopyStatus('Invalid backup file');
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    const context = notes.slice(0, 5).map(n => `Title: ${n.title}\nContent: ${n.content}`).join('\n---\n');
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMsg }] }],
          systemInstruction: { parts: [{ text: `Assistant context: ${context}` }] }
        })
      });

      if (!response.ok) {
        let errorMessage = "Error reaching AI.";
        if (response.status === 429) {
          errorMessage = "Rate limit exceeded. Please wait a moment before trying again.";
        } else if (response.status === 403) {
          errorMessage = "Access forbidden. Please check if your API key is valid and your region is supported.";
        } else {
          try {
            const errorData = await response.json();
            errorMessage = `API Error: ${errorData.error?.message || response.status}`;
          } catch {
            errorMessage = `HTTP Error ${response.status}`;
          }
        }
        setChatHistory(prev => [...prev, { role: 'assistant', text: errorMessage }]);
        return;
      }

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini connection lost.";
      setChatHistory(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch {
      setChatHistory(prev => [...prev, { role: 'assistant', text: "Network error reaching AI." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className={`flex w-full h-[100dvh] font-sans overflow-hidden transition-colors duration-500 ${darkMode ? 'dark bg-[#0a0a0a] text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".json" />

      {copyStatus && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-2xl z-[10000] animate-toast">
          {copyStatus}
        </div>
      )}

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-[90] sm:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed sm:relative left-0 top-0 bottom-0 h-full flex flex-col border-r transition-all duration-300 ease-in-out shrink-0 overflow-hidden z-[100] ${isSidebarOpen ? 'w-[85vw] max-w-[320px] sm:w-72 opacity-100 shadow-2xl sm:shadow-none translate-x-0' : 'w-0 opacity-0 -translate-x-full sm:translate-x-0'} ${darkMode ? 'bg-[#111111] border-zinc-800' : 'bg-white border-slate-200'}`}>
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-zinc-800/50 h-20 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setViewMode('grid'); setActiveFolderId('all'); }}>
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform"><Book className="w-4 h-4 text-white" /></div>
            <h1 className="font-bold text-lg whitespace-nowrap tracking-tight">SmartNotes AI</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className={`p-1.5 rounded-md transition-colors ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-slate-100'}`}>
            <PanelLeftClose className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
          <div className="space-y-1">
            <button onClick={() => { setActiveFolderId('all'); setViewMode('grid'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap group ${activeFolderId === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-1' : (darkMode ? 'hover:bg-zinc-800/50' : 'hover:bg-slate-100')}`}><Hash className="w-4 h-4 shrink-0" /> All Library</button>
            <div className="pt-6 pb-2 px-2 flex items-center justify-between opacity-50 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Folders<Plus className="w-3 h-3 cursor-pointer hover:text-indigo-500 transition-colors" onClick={() => setShowFolderModal(true)} /></div>
            {folders.map(f => (
              <div key={f.id} onClick={() => { setActiveFolderId(f.id); setViewMode('grid'); }} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm cursor-pointer transition-all whitespace-nowrap group ${activeFolderId === f.id ? 'bg-zinc-800 text-white translate-x-1' : (darkMode ? 'hover:bg-zinc-800/50 text-zinc-400' : 'hover:bg-slate-100 text-slate-500')}`}>
                <Folder className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" style={{ color: f.color }} /><span className="truncate flex-1">{f.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-zinc-800/20 shrink-0">
          <button onClick={() => setShowSettingsModal(true)} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-slate-100'}`}><Settings className="w-4 h-4 shrink-0" /> Settings</button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative min-w-0 h-full overflow-hidden">
        <header className={`h-20 border-b flex items-center px-6 gap-4 justify-between shrink-0 z-[60] ${darkMode ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className={`p-2 border rounded-lg transition-all hover:scale-105 active:scale-95 ${darkMode ? 'border-zinc-800 hover:bg-zinc-800' : 'border-slate-200 hover:bg-slate-50'}`}><PanelLeftOpen className="w-4 h-4" /></button>}
            <div className="flex-1 min-w-0">
              {viewMode === 'grid' ? (
                <div className="relative flex-1 max-w-md hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={`w-full bg-transparent border rounded-xl py-2 pl-10 pr-4 text-sm outline-none transition-all ${darkMode ? 'border-zinc-800 focus:border-indigo-500' : 'border-slate-200 focus:border-indigo-400'}`} />
                </div>
              ) : (
                <div className="flex items-center gap-3 overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-slate-100'}`}><ChevronLeft className="w-5 h-5" /></button>
                  <input value={activeNote?.title || ''} onChange={e => setNotes(notes.map(n => n.id === activeNoteId ? { ...n, title: e.target.value } : n))} className="bg-transparent font-bold text-lg outline-none truncate w-full border-b border-transparent focus:border-indigo-500 transition-colors" placeholder="Untitled Note..." />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {viewMode === 'grid' && (
              <div className="flex items-center gap-2 relative">
                <div className={`flex items-center gap-1.5 transition-all duration-300 ${isSelectMode ? 'w-auto opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                  <button onClick={selectAllVisible} className={`px-3 py-2 rounded-xl text-xs font-bold border ${darkMode ? 'border-zinc-800 hover:bg-zinc-800' : 'border-slate-200 hover:bg-slate-100'}`}>Select All</button>

                  {selectedNoteIds.length > 0 && (
                    <div className="flex items-center gap-1.5" ref={dropdownRef}>
                      <div className="relative">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveDropdown(activeDropdown === 'move' ? null : 'move'); }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-white`}
                        >
                          <MoveHorizontal className="w-3.5 h-3.5" /> <span className="hidden lg:inline">Move</span>
                        </button>
                        {activeDropdown === 'move' && (
                          <div className={`absolute top-full right-0 mt-2 w-48 rounded-2xl border shadow-2xl py-2 z-[9999] animate-dropdown ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                            {folders.map(f => (
                              <button key={f.id} onClick={(e) => { e.stopPropagation(); moveSelectedNotes(f.id); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-left transition-colors ${darkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                                <Folder className="w-3.5 h-3.5" style={{ color: f.color }} /> {f.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveDropdown(activeDropdown === 'share' ? null : 'share'); }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all bg-indigo-600 text-white shadow-lg shadow-indigo-600/20`}
                        >
                          <Share2 className="w-3.5 h-3.5" /> <span className="hidden lg:inline">Share</span>
                        </button>
                        {activeDropdown === 'share' && (
                          <div className={`absolute top-full right-0 mt-2 w-56 rounded-2xl border shadow-2xl py-2 z-[9999] animate-dropdown ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                            <button onClick={(e) => { e.stopPropagation(); shareSelectedNotes('txt'); }} className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold ${darkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                              <Copy className="w-3.5 h-3.5 text-indigo-500" /> Copy Text
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); shareSelectedNotes('json'); }} className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold ${darkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                              <Database className="w-3.5 h-3.5 text-emerald-500" /> Copy JSON
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); shareSelectedNotes('download'); }} className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold ${darkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                              <Download className="w-3.5 h-3.5 text-amber-500" /> Download .JSON
                            </button>
                          </div>
                        )}
                      </div>

                      <button onClick={() => deleteNotes(selectedNoteIds)} className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => { setIsSelectMode(!isSelectMode); setSelectedNoteIds([]); setActiveDropdown(null); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${isSelectMode ? 'bg-zinc-700 text-white border-zinc-600' : (darkMode ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-400' : 'border-slate-200 hover:bg-slate-100 text-slate-500')}`}
                >
                  {isSelectMode ? <X className="w-3.5 h-3.5" /> : <ListChecks className="w-3.5 h-3.5" />}
                  {isSelectMode ? 'Cancel' : 'Manage'}
                </button>
              </div>
            )}

            <button onClick={addNote} className="bg-indigo-600 text-white p-2.5 sm:px-4 sm:py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 active:scale-95 transition-all ml-1 sm:ml-2 shrink-0">
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">New Note</span>
            </button>
            <button onClick={() => setIsAiOpen(!isAiOpen)} className={`p-2.5 rounded-xl transition-all shrink-0 ${isAiOpen ? 'bg-indigo-600 text-white' : (darkMode ? 'bg-zinc-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600')}`}>
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex relative">
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar scroll-smooth">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {getFilteredNotes().map((note, index) => (
                  <div
                    key={note.id}
                    draggable={!isSelectMode}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onClick={() => isSelectMode ? toggleSelectNote(note.id) : (setActiveNoteId(note.id), setViewMode('editor'))}
                    className={`group relative p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col h-60
                      ${isSelectMode && selectedNoteIds.includes(note.id) ? 'border-indigo-500 ring-4 ring-indigo-500/10 scale-[1.03] bg-indigo-500/5' : 'hover:scale-[1.02]'}
                      ${draggedIdx === index ? 'opacity-40 scale-95 border-dashed border-indigo-400' : ''}
                      ${darkMode ? 'bg-[#141414] border-zinc-800 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}
                    `}
                  >
                    <div className="flex items-center justify-between mb-4">
                      {isSelectMode ? (
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedNoteIds.includes(note.id) ? 'bg-indigo-600 border-indigo-600' : (darkMode ? 'border-zinc-700' : 'border-slate-300')}`}>
                          {selectedNoteIds.includes(note.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: folders.find(f => f.id === note.folderId)?.color }} />
                          <GripVertical className="w-3.5 h-3.5 opacity-0 group-hover:opacity-20 transition-opacity" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-indigo-500">{note.title || 'Untitled'}</h3>
                    <p className={`text-sm opacity-50 flex-1 overflow-hidden line-clamp-3 leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>{note.content ? note.content.replace(/<[^>]*>?/gm, '').substring(0, 150) : 'No content yet...'}</p>
                    <div className="mt-4 pt-4 border-t border-zinc-800/10 flex items-center justify-between opacity-30 text-[10px] font-bold uppercase tracking-widest">
                      <span>{new Date(note.timestamp).toLocaleDateString()}</span>
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto w-full h-full flex flex-col animate-in-fade relative">
                <div className={`flex flex-wrap items-center gap-1 sm:gap-2 p-1 sm:p-2 mb-4 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'} sticky top-0 z-10 shadow-sm max-w-full sm:max-w-fit mt-2`}>
                  {[
                    { icon: Bold, cmd: 'bold' },
                    { icon: Italic, cmd: 'italic' },
                    { icon: Underline, cmd: 'underline' },
                    { icon: Heading1, cmd: 'formatBlock', arg: 'H1' },
                    { icon: Heading2, cmd: 'formatBlock', arg: 'H2' },
                    { icon: ListIcon, cmd: 'insertUnorderedList' },
                    { icon: ListOrdered, cmd: 'insertOrderedList' },
                    { icon: Quote, cmd: 'formatBlock', arg: 'BLOCKQUOTE' }
                  ].map(({ icon: Icon, cmd, arg }, i) => (
                    <button key={i} onMouseDown={(e) => { e.preventDefault(); document.execCommand(cmd, false, arg); }} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-slate-100 text-slate-700'}`}>
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                  <div className={`w-px h-6 mx-1 ${darkMode ? 'bg-zinc-800' : 'bg-slate-200'}`} />
                  <label className={`p-2 rounded-lg transition-colors cursor-pointer ${darkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-slate-100 text-slate-700'}`}>
                    <ImageIcon className="w-4 h-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => document.execCommand('insertImage', false, ev.target.result);
                        reader.readAsDataURL(file);
                      }
                      e.target.value = null;
                    }} />
                  </label>
                </div>
                <EditorBlock content={activeNote?.content || ''} onChange={content => setNotes(notes.map(n => n.id === activeNoteId ? { ...n, content } : n))} />
              </div>
            )}
          </div>

          {/* AI Sidebar Overlay */}
          {isAiOpen && (
            <div className="fixed inset-0 bg-black/50 z-[105] sm:hidden" onClick={() => setIsAiOpen(false)} />
          )}

          {/* AI Sidebar */}
          <aside className={`fixed sm:relative right-0 top-0 bottom-0 transition-all duration-300 w-[85vw] max-w-[380px] sm:w-96 ${isAiOpen ? 'translate-x-0 border-l shadow-2xl sm:shadow-none' : 'translate-x-full sm:w-0 sm:border-l-0 opacity-0 sm:opacity-100'} ${darkMode ? 'border-zinc-800/20 bg-zinc-900/95 sm:bg-zinc-900/30' : 'border-slate-200/50 bg-white sm:bg-white/90'} overflow-hidden flex flex-col backdrop-blur-md shrink-0 z-[110]`}>
            <div className={`p-4 sm:p-6 border-b flex items-center justify-between h-20 shrink-0 ${darkMode ? 'border-zinc-800/20' : 'border-slate-200/50'}`}>
              <div className={`flex items-center gap-2 font-bold text-xs tracking-widest uppercase ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}><Sparkles className="w-4 h-4 animate-pulse" /> AI Assistant</div>
              <button className={`transition-colors ${darkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`} onClick={() => setIsAiOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex flex-col animate-in-slide-up ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white' : (darkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-white border border-slate-200 text-slate-800 shadow-sm')}`}>{msg.text}</div>
                </div>
              ))}
              {isTyping && <div className={`text-[10px] font-bold animate-pulse-subtle ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Thinking...</div>}
            </div>
            <form onSubmit={handleAskAI} className={`p-6 border-t ${darkMode ? 'border-zinc-800/20' : 'border-slate-200/50'}`}>
              <div className="relative">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className={`w-full rounded-xl py-3 pl-4 pr-10 text-xs outline-none border transition-all ${darkMode ? 'bg-zinc-800/50 border-zinc-700 focus:border-indigo-500' : 'bg-slate-100 border-slate-200 focus:border-indigo-400'}`} />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400"><Send className="w-3.5 h-3.5" /></button>
              </div>
            </form>
          </aside>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-modal-in">
          <div className={`border rounded-3xl p-8 w-full max-w-lg shadow-2xl transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex justify-between items-start mb-8"><h2 className="text-2xl font-bold">Workspace Settings</h2><button onClick={() => setShowSettingsModal(false)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-800/50">
                <span className="text-sm font-bold">Dark Theme</span>
                <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${darkMode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button onClick={() => handleBackup('json')} className="p-4 border border-zinc-800 rounded-2xl text-xs font-bold hover:bg-zinc-800">Export JSON</button>
                <button onClick={() => fileInputRef.current.click()} className="p-4 border border-zinc-800 rounded-2xl text-xs font-bold hover:bg-zinc-800">Import JSON</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-modal-in">
          <div className={`border rounded-3xl p-8 w-full max-w-sm shadow-2xl ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h2 className="text-xl font-bold mb-6">New Folder</h2>
            <input autoFocus value={newFolderName} onChange={e => setNewFolderName(e.target.value)} className="w-full border rounded-xl py-3 px-4 outline-none mb-6 bg-transparent focus:border-indigo-500 transition-colors" placeholder="Category Name..." />
            <div className="flex gap-2">
              <button onClick={() => { if (newFolderName.trim()) { setFolders([...folders, { id: Date.now().toString(), name: newFolderName, color: `hsl(${Math.random() * 360}, 70%, 60%)` }]); setShowFolderModal(false); setNewFolderName(''); } }} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors">Create</button>
              <button onClick={() => setShowFolderModal(false)} className="px-6 opacity-50 font-bold text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}; border-radius: 10px; border: 2px solid transparent; background-clip: padding-box; }
        ::-webkit-scrollbar-thumb:hover { background: ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}; border: 2px solid transparent; background-clip: padding-box; }
        @keyframes toast-in-out { 0% { transform: translate(-50%, 20px); opacity: 0; } 15%, 85% { transform: translate(-50%, 0); opacity: 1; } 100% { transform: translate(-50%, 20px); opacity: 0; } }
        .animate-toast { animation: toast-in-out 2000ms ease-in-out forwards; }
        @keyframes dropdown-in { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-dropdown { animation: dropdown-in 150ms cubic-bezier(0, 0, 0.2, 1) forwards; }
        @keyframes modal-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-modal-in { animation: modal-in 200ms cubic-bezier(0, 0, 0.2, 1) forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-in-fade { animation: fade-in 300ms ease-out both; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in-slide-up { animation: slide-up 200ms ease-out both; }
        @keyframes pulse-subtle { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .custom-editor[contenteditable]:empty::before { content: "Start writing something brilliant..."; opacity: 0.3; }
        .custom-editor img { max-width: 100%; border-radius: 0.75rem; margin: 1.5rem 0; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .custom-editor h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; margin-top: 2rem; line-height: 1.2; }
        .custom-editor h2 { font-size: 1.875rem; font-weight: 700; margin-bottom: 0.75rem; margin-top: 1.5rem; }
        .custom-editor ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .custom-editor ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .custom-editor a { color: #4f46e5; text-decoration: underline; }
        .custom-editor blockquote { border-left: 4px solid #4f46e5; padding-left: 1.25rem; font-style: italic; opacity: 0.9; margin: 1.5rem 0; background: ${darkMode ? 'rgba(79, 70, 229, 0.1)' : 'rgba(79, 70, 229, 0.05)'}; padding: 1rem 1rem 1rem 1.25rem; border-radius: 0 0.5rem 0.5rem 0; }
        .custom-editor div, .custom-editor p { min-height: 1.5rem; }
      `}</style>
    </div>
  );
}