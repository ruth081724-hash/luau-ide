import React, { useState, useEffect, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster, toast } from "sonner";
import { TopBar } from "./components/TopBar";
import { FileExplorer } from "./components/FileExplorer";
import { TabBar } from "./components/TabBar";
import { Editor } from "./components/Editor";
import { PreviewPanel } from "./components/PreviewPanel";
import { Console, LogEntry } from "./components/Console";
import { StatusBar } from "./components/StatusBar";
import { LandingPage } from "./components/LandingPage";
import { BottomNav } from "./components/BottomNav";
import { initialFileSystem, findFile, FileNode } from "./lib/fileSystem";
import { useLuauParser } from "./hooks/useLuauParser";
import { Files, Search, GitBranch, Blocks } from "lucide-react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [theme, setTheme] = useState<'default' | 'purple' | 'green'>('default');
  const isMobile = useIsMobile();
  const [activeMobileTab, setActiveMobileTab] = useState('editor');
  
  const [fileSystem, setFileSystem] = useState(initialFileSystem);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | undefined>();
  const [modifiedFiles, setModifiedFiles] = useState<Set<string>>(new Set());
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      text: "LuauIDE v1.0.0 — Ready",
      type: "info",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const activeFile = activeFileId ? openFiles.find((f) => f.id === activeFileId) : undefined;
  const activeContent = activeFile?.content || "";
  const parsedUI = useLuauParser(activeContent);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    if (!showLanding && openFiles.length === 0) {
      handleFileSelect("main-script");
    }
  }, [showLanding]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'default') {
      root.style.setProperty('--primary', '212 100% 67%'); // #58a6ff
    } else if (theme === 'purple') {
      root.style.setProperty('--primary', '265 89% 78%'); // #bd93f9
    } else if (theme === 'green') {
      root.style.setProperty('--primary', '142 71% 45%'); // #2ea043
    }
  }, [theme]);

  const handleFileSelect = (id: string) => {
    const file = findFile(fileSystem, id);
    if (!file || file.type === "folder") return;

    if (!openFiles.find((f) => f.id === id)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFileId(id);
    if (isMobile) setActiveMobileTab('editor');
  };

  const handleTabClose = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter((f) => f.id !== id);
    setOpenFiles(newOpenFiles);
    
    if (activeFileId === id) {
      setActiveFileId(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1].id : undefined);
    }
  };

  const handleContentChange = (content: string) => {
    if (!activeFileId) return;
    
    setOpenFiles(openFiles.map(f => f.id === activeFileId ? { ...f, content } : f));
    setModifiedFiles(prev => new Set(prev).add(activeFileId));
    setAutosaveStatus('unsaved');
    
    if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
    autosaveTimeoutRef.current = setTimeout(() => {
      setAutosaveStatus('saving');
      setTimeout(() => {
        setModifiedFiles(prev => {
          const next = new Set(prev);
          next.delete(activeFileId);
          return next;
        });
        setAutosaveStatus('saved');
      }, 500);
    }, 2000);
  };

  const handleRun = () => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      { id: Date.now().toString(), text: "Script started", type: "info", timestamp },
      { id: (Date.now() + 1).toString(), text: "Compiling Luau...", type: "info", timestamp },
      { id: (Date.now() + 2).toString(), text: "Success. Execution complete.", type: "info", timestamp }
    ]);
    if (isMobile) setActiveMobileTab('terminal');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    toast.success("Script copied to clipboard!");
  };

  const handleDownload = () => {
    if (!activeFile) return;
    const blob = new Blob([activeContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name.endsWith(".lua") || activeFile.name.endsWith(".luau") ? activeFile.name : activeFile.name + ".lua";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden relative">
      <div 
        className="hidden md:block pointer-events-none fixed z-0 rounded-full"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, hsl(var(--primary)/0.1) 0%, transparent 70%)',
          left: mousePos.x - 200,
          top: mousePos.y - 200,
          transition: 'left 0.1s ease-out, top 0.1s ease-out',
        }}
      />
      
      <TopBar 
        onRun={handleRun} 
        onCopy={handleCopy} 
        onDownload={handleDownload} 
        theme={theme} 
        onThemeChange={setTheme} 
      />

      {isMobile ? (
        <div className="flex-1 flex flex-col overflow-hidden pb-14 relative z-10 bg-background">
          {activeMobileTab === 'explorer' && (
            <FileExplorer 
              nodes={fileSystem} 
              onFileSelect={handleFileSelect} 
              activeFileId={activeFileId}
            />
          )}
          
          {activeMobileTab === 'editor' && (
            <div className="flex-1 flex flex-col">
              <TabBar 
                openFiles={openFiles} 
                activeFileId={activeFileId} 
                onTabSelect={setActiveFileId}
                onTabClose={handleTabClose}
                modifiedFiles={modifiedFiles}
              />
              {activeFileId ? (
                <Editor 
                  content={activeContent} 
                  onChange={handleContentChange}
                  onRun={handleRun}
                  isMobile={true}
                  onCursorChange={(line, col) => setCursorPos({ line, col })}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground p-4 text-center">
                  Select a file from Explorer
                </div>
              )}
            </div>
          )}
          
          {activeMobileTab === 'preview' && (
            <PreviewPanel parsedUI={parsedUI} isMobile={true} />
          )}
          
          {activeMobileTab === 'terminal' && (
            <Console logs={logs} onClear={() => setLogs([])} />
          )}
          
          <BottomNav activeTab={activeMobileTab} onTabChange={setActiveMobileTab} />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden relative z-10 bg-background">
          {/* Activity Bar */}
          <div className="w-12 bg-card border-r border-border flex flex-col items-center py-4 gap-6 shrink-0">
            <div className="p-2 rounded cursor-pointer text-primary bg-primary/10 relative">
              <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary rounded-r" />
              <Files size={24} />
            </div>
            <div className="p-2 rounded cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
              <Search size={24} />
            </div>
            <div className="p-2 rounded cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
              <GitBranch size={24} />
            </div>
            <div className="p-2 rounded cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
              <Blocks size={24} />
            </div>
          </div>

          <PanelGroup direction="horizontal" className="flex-1">
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <FileExplorer 
                nodes={fileSystem} 
                onFileSelect={handleFileSelect} 
                activeFileId={activeFileId}
              />
            </Panel>

            <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 active:bg-primary transition-colors" />

            <Panel defaultSize={50} minSize={30}>
              <PanelGroup direction="vertical">
                <Panel defaultSize={75} minSize={50}>
                  <div className="h-full flex flex-col bg-[#0d1117]">
                    <TabBar 
                      openFiles={openFiles} 
                      activeFileId={activeFileId} 
                      onTabSelect={setActiveFileId}
                      onTabClose={handleTabClose}
                      modifiedFiles={modifiedFiles}
                    />
                    {activeFileId ? (
                      <div className="flex-1">
                        <Editor 
                          content={activeContent} 
                          onChange={handleContentChange}
                          onRun={handleRun}
                          isMobile={false}
                          onCursorChange={(line, col) => setCursorPos({ line, col })}
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 opacity-20">
                            <Files size={64} />
                          </div>
                          <p>Select a file to start editing</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>
                
                <PanelResizeHandle className="h-1 bg-border hover:bg-primary/50 active:bg-primary transition-colors" />
                
                <Panel defaultSize={25} minSize={10}>
                  <Console logs={logs} onClear={() => setLogs([])} />
                </Panel>
              </PanelGroup>
            </Panel>

            <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 active:bg-primary transition-colors" />

            <Panel defaultSize={30} minSize={20}>
              <PreviewPanel parsedUI={parsedUI} isMobile={false} />
            </Panel>
          </PanelGroup>
        </div>
      )}

      <StatusBar line={cursorPos.line} col={cursorPos.col} autosaveStatus={autosaveStatus} />
      
      <SonnerToaster theme="dark" position="bottom-right" />
      <Toaster />
    </div>
  );
}

export default App;
