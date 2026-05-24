import React, { useState, useEffect, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
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
import { SearchPanel } from "./components/SearchPanel";
import { VisualExecutor } from "./components/VisualExecutor";
import { initialFileSystem, findFile, FileNode } from "./lib/fileSystem";
import { useLuauParser } from "./hooks/useLuauParser";
import { Files, Search, GitBranch, Blocks } from "lucide-react";

type AppMode = "landing" | "ide" | "executor";
type ActivityTab = "explorer" | "search";

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
  const [mode, setMode] = useState<AppMode>("landing");
  const [theme, setTheme] = useState<'default' | 'purple' | 'green'>('default');
  const isMobile = useIsMobile();
  const [activeMobileTab, setActiveMobileTab] = useState('editor');
  const [activityTab, setActivityTab] = useState<ActivityTab>("explorer");

  const [fileSystem] = useState(initialFileSystem);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | undefined>();
  const [modifiedFiles, setModifiedFiles] = useState<Set<string>>(new Set());
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", text: "LuauIDE v1.2.0 — Ready", type: "info", timestamp: new Date().toLocaleTimeString() },
  ]);

  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const activeFile = activeFileId ? openFiles.find((f) => f.id === activeFileId) : undefined;
  const activeContent = activeFile?.content || "";
  const parsedUI = useLuauParser(activeContent);

  // Mouse glow (desktop only)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Dark class + theme
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    if (mode === "ide" && openFiles.length === 0) handleFileSelect("main-script");
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'default') root.style.setProperty('--primary', '212 100% 67%');
    else if (theme === 'purple') root.style.setProperty('--primary', '265 89% 78%');
    else if (theme === 'green') root.style.setProperty('--primary', '142 71% 45%');
  }, [theme]);

  const handleFileSelect = (id: string) => {
    const file = findFile(fileSystem, id);
    if (!file || file.type === "folder") return;
    if (!openFiles.find((f) => f.id === id)) setOpenFiles((prev) => [...prev, file]);
    setActiveFileId(id);
    if (isMobile) setActiveMobileTab('editor');
  };

  const handleTabClose = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOpen = openFiles.filter((f) => f.id !== id);
    setOpenFiles(newOpen);
    if (activeFileId === id) setActiveFileId(newOpen.length > 0 ? newOpen[newOpen.length - 1].id : undefined);
  };

  const handleContentChange = (content: string) => {
    if (!activeFileId) return;
    setOpenFiles((prev) => prev.map((f) => f.id === activeFileId ? { ...f, content } : f));
    setModifiedFiles((prev) => new Set(prev).add(activeFileId));
    setAutosaveStatus('unsaved');
    if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
    autosaveTimeoutRef.current = setTimeout(() => {
      setAutosaveStatus('saving');
      setTimeout(() => {
        setModifiedFiles((prev) => { const n = new Set(prev); n.delete(activeFileId!); return n; });
        setAutosaveStatus('saved');
      }, 500);
    }, 2000);
  };

  const handleRun = () => {
    const ts = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      { id: Date.now().toString(), text: "Script iniciado...", type: "info", timestamp: ts },
      { id: (Date.now() + 1).toString(), text: "Compilando Luau...", type: "info", timestamp: ts },
      { id: (Date.now() + 2).toString(), text: "Exito. Ejecucion completada.", type: "info", timestamp: ts },
    ]);
    if (isMobile) setActiveMobileTab('terminal');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    toast.success("Script copiado al portapapeles!");
  };

  const handleDownload = () => {
    if (!activeFile) return;
    const blob = new Blob([activeContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name.endsWith(".lua") || activeFile.name.endsWith(".luau") ? activeFile.name : activeFile.name + ".lua";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMenuClick = (item: string) => {
    if (item === "Run") handleRun();
  };

  // Activity bar icon click
  const handleActivityIcon = (tab: ActivityTab) => {
    setActivityTab(tab);
  };

  // ── LANDING ──────────────────────────────────────────────────────────────
  if (mode === "landing") {
    return (
      <>
        <LandingPage
          onEnter={() => setMode("ide")}
          onEnterExecutor={() => setMode("executor")}
        />
        <SonnerToaster theme="dark" position="bottom-right" />
      </>
    );
  }

  // ── VISUAL EXECUTOR ──────────────────────────────────────────────────────
  if (mode === "executor") {
    return (
      <>
        <VisualExecutor onBack={() => setMode("landing")} isMobile={isMobile} />
        <SonnerToaster theme="dark" position="bottom-right" />
      </>
    );
  }

  // ── FULL IDE ─────────────────────────────────────────────────────────────
  const leftSidebarContent = activityTab === "search"
    ? <SearchPanel fileSystem={fileSystem} onFileSelect={handleFileSelect} />
    : <FileExplorer nodes={fileSystem} onFileSelect={handleFileSelect} activeFileId={activeFileId} />;

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden relative">
      {/* Mouse glow */}
      <div
        className="hidden md:block pointer-events-none fixed z-0 rounded-full"
        style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, hsl(var(--primary)/0.08) 0%, transparent 70%)',
          left: mousePos.x - 200, top: mousePos.y - 200,
          transition: 'left 0.1s ease-out, top 0.1s ease-out',
        }}
      />

      <TopBar
        onRun={handleRun}
        onCopy={handleCopy}
        onDownload={handleDownload}
        theme={theme}
        onThemeChange={setTheme}
        onMenuClick={handleMenuClick}
      />

      {/* ── MOBILE LAYOUT ─────────────────────────────────────── */}
      {isMobile ? (
        <div className="flex-1 flex flex-col overflow-hidden pb-14 relative z-10">
          {activeMobileTab === 'explorer' && leftSidebarContent}
          {activeMobileTab === 'editor' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <TabBar openFiles={openFiles} activeFileId={activeFileId} onTabSelect={setActiveFileId} onTabClose={handleTabClose} modifiedFiles={modifiedFiles} />
              {activeFileId ? (
                <Editor content={activeContent} onChange={handleContentChange} onRun={handleRun} isMobile={true} onCursorChange={(l, c) => setCursorPos({ line: l, col: c })} />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground/50 text-sm p-4 text-center">
                  Selecciona un archivo en Explorer
                </div>
              )}
            </div>
          )}
          {activeMobileTab === 'preview' && <PreviewPanel parsedUI={parsedUI} isMobile={true} />}
          {activeMobileTab === 'terminal' && <Console logs={logs} onClear={() => setLogs([])} />}
          <BottomNav activeTab={activeMobileTab} onTabChange={setActiveMobileTab} />
        </div>
      ) : (
        /* ── DESKTOP LAYOUT ───────────────────────────────────── */
        <div className="flex-1 flex overflow-hidden relative z-10">
          {/* Activity Bar */}
          <div className="w-11 bg-card border-r border-border flex flex-col items-center py-3 gap-4 shrink-0">
            {[
              { id: "explorer" as ActivityTab, icon: <Files size={20} />, label: "Explorer" },
              { id: "search" as ActivityTab, icon: <Search size={20} />, label: "Search" },
              { id: "git" as ActivityTab, icon: <GitBranch size={20} />, label: "Git" },
              { id: "ext" as ActivityTab, icon: <Blocks size={20} />, label: "Extensions" },
            ].map(({ id, icon, label }) => (
              <button
                key={id}
                title={label}
                onClick={() => (id === "explorer" || id === "search") ? handleActivityIcon(id) : undefined}
                className={`p-2 rounded transition-colors relative ${
                  activityTab === id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {activityTab === id && <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-primary rounded-r" />}
                {icon}
              </button>
            ))}
          </div>

          <PanelGroup direction="horizontal" className="flex-1">
            {/* Left Panel: Explorer or Search */}
            <Panel defaultSize={20} minSize={14} maxSize={32}>
              {leftSidebarContent}
            </Panel>

            <PanelResizeHandle className="w-0.5 bg-border hover:bg-primary/50 active:bg-primary transition-colors cursor-col-resize" />

            {/* Center: Editor + Console */}
            <Panel defaultSize={50} minSize={30}>
              <PanelGroup direction="vertical">
                <Panel defaultSize={75} minSize={50}>
                  <div className="h-full flex flex-col bg-[#0d1117]">
                    <TabBar openFiles={openFiles} activeFileId={activeFileId} onTabSelect={setActiveFileId} onTabClose={handleTabClose} modifiedFiles={modifiedFiles} />
                    {activeFileId ? (
                      <div className="flex-1 overflow-hidden">
                        <Editor content={activeContent} onChange={handleContentChange} onRun={handleRun} isMobile={false} onCursorChange={(l, c) => setCursorPos({ line: l, col: c })} />
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-muted-foreground/50 flex-col gap-3">
                        <Files size={40} className="opacity-20" />
                        <p className="text-sm">Selecciona un archivo para empezar</p>
                      </div>
                    )}
                  </div>
                </Panel>
                <PanelResizeHandle className="h-0.5 bg-border hover:bg-primary/50 active:bg-primary transition-colors cursor-row-resize" />
                <Panel defaultSize={25} minSize={10}>
                  <Console logs={logs} onClear={() => setLogs([])} />
                </Panel>
              </PanelGroup>
            </Panel>

            <PanelResizeHandle className="w-0.5 bg-border hover:bg-primary/50 active:bg-primary transition-colors cursor-col-resize" />

            {/* Right: Preview */}
            <Panel defaultSize={30} minSize={20}>
              <PreviewPanel parsedUI={parsedUI} isMobile={false} />
            </Panel>
          </PanelGroup>
        </div>
      )}

      <StatusBar line={cursorPos.line} col={cursorPos.col} autosaveStatus={autosaveStatus} />
      <SonnerToaster theme="dark" position="bottom-right" />
    </div>
  );
}

export default App;
