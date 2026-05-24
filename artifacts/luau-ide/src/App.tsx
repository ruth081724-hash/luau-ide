import React, { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { TopBar } from "./components/TopBar";
import { FileExplorer } from "./components/FileExplorer";
import { TabBar } from "./components/TabBar";
import { Editor } from "./components/Editor";
import { PreviewPanel } from "./components/PreviewPanel";
import { Console, LogEntry } from "./components/Console";
import { StatusBar } from "./components/StatusBar";
import { initialFileSystem, findFile, FileNode } from "./lib/fileSystem";
import { useLuauParser } from "./hooks/useLuauParser";
import { Files, Search, GitBranch, Blocks } from "lucide-react";

function App() {
  const [fileSystem, setFileSystem] = useState(initialFileSystem);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | undefined>();
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      text: "LuauIDE v1.0.0 — Ready",
      type: "info",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  // Editor cursor state (mocked since it's hard to extract cleanly from Monaco without complex refs, but we'll default to 1:1)
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // Get active file content
  const activeFile = activeFileId ? openFiles.find((f) => f.id === activeFileId) : undefined;
  const activeContent = activeFile?.content || "";

  // Parse UI
  const parsedUI = useLuauParser(activeContent);

  // File System Handlers
  const handleFileSelect = (id: string) => {
    const file = findFile(fileSystem, id);
    if (!file || file.type === "folder") return;

    if (!openFiles.find((f) => f.id === id)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFileId(id);
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
    
    // Update open files state
    setOpenFiles(openFiles.map(f => f.id === activeFileId ? { ...f, content } : f));
    
    // In a real app we'd also sync to fileSystem tree, but openFiles is our working buffer
  };

  // Run Script Handler
  const handleRun = () => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      { id: Date.now().toString(), text: "Script started", type: "info", timestamp },
      { id: (Date.now() + 1).toString(), text: "Compiling Luau...", type: "info", timestamp },
      { id: (Date.now() + 2).toString(), text: "Success. Execution complete.", type: "info", timestamp }
    ]);
  };

  // Init — force dark mode class + open default file
  useEffect(() => {
    document.documentElement.classList.add("dark");
    handleFileSelect("main-script");
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
      <TopBar onRun={handleRun} />

      <div className="flex-1 flex overflow-hidden">
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

        {/* Main Resizable Layout */}
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Left Panel: File Explorer */}
          <Panel defaultSize={20} minSize={15} maxSize={30}>
            <FileExplorer 
              nodes={fileSystem} 
              onFileSelect={handleFileSelect} 
              activeFileId={activeFileId}
            />
          </Panel>

          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 active:bg-primary transition-colors" />

          {/* Center Panel: Editor + Console */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={75} minSize={50}>
                <div className="h-full flex flex-col bg-[#0d1117]">
                  <TabBar 
                    openFiles={openFiles} 
                    activeFileId={activeFileId} 
                    onTabSelect={setActiveFileId}
                    onTabClose={handleTabClose}
                  />
                  {activeFileId ? (
                    <div className="flex-1">
                      <Editor 
                        content={activeContent} 
                        onChange={handleContentChange}
                        onRun={handleRun}
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

          {/* Right Panel: Preview */}
          <Panel defaultSize={30} minSize={20}>
            <PreviewPanel parsedUI={parsedUI} />
          </Panel>
        </PanelGroup>
      </div>

      <StatusBar line={cursorPos.line} col={cursorPos.col} />
      
      <SonnerToaster theme="dark" position="bottom-right" />
      <Toaster />
    </div>
  );
}

export default App;
