import React, { useState, useRef, useEffect } from "react";
import { Terminal, Trash2 } from "lucide-react";

export interface LogEntry {
  id: string;
  text: string;
  type: "info" | "warn" | "error";
  timestamp: string;
}

interface ConsoleProps {
  logs: LogEntry[];
  onClear: () => void;
}

export function Console({ logs, onClear }: ConsoleProps) {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'output' | 'terminal'>('output');
  const [terminalLines, setTerminalLines] = useState<string[]>(["LuauIDE Terminal v1.0.0"]);
  const [terminalInput, setTerminalInput] = useState("");
  
  const endRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeConsoleTab === 'output') {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, terminalLines, activeConsoleTab]);

  const handleTerminalSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = terminalInput.trim();
      if (!cmd) return;
      
      let output = "";
      const newLines = [...terminalLines, `user@luauide:~$ ${cmd}`];
      
      const args = cmd.split(" ");
      const mainCmd = args[0].toLowerCase();
      
      if (mainCmd === "help") {
        output = "Available commands: help, clear, ls, echo <text>, luau run MainScript.luau";
      } else if (mainCmd === "clear") {
        setTerminalLines([]);
        setTerminalInput("");
        return;
      } else if (mainCmd === "ls") {
        output = "MainScript.luau  UIManager.luau";
      } else if (mainCmd === "echo") {
        output = args.slice(1).join(" ");
      } else if (mainCmd === "luau" && args[1] === "run") {
        output = "Executing " + (args[2] || "script") + "...\\nSuccess.";
      } else {
        output = "Command not found: " + mainCmd;
      }
      
      setTerminalLines([...newLines, output]);
      setTerminalInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-t border-border font-mono text-sm">
      <div className="flex bg-card border-b border-border items-center justify-between px-2 pt-1 shrink-0">
        <div className="flex">
          <button 
            onClick={() => setActiveConsoleTab('output')}
            className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors flex items-center gap-2 ${activeConsoleTab === 'output' ? 'border-primary text-foreground bg-white/5' : 'border-transparent text-muted-foreground hover:bg-white/5'}`}
          >
            <Terminal size={14} /> Output
          </button>
          <button 
            onClick={() => setActiveConsoleTab('terminal')}
            className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-colors flex items-center gap-2 ${activeConsoleTab === 'terminal' ? 'border-primary text-foreground bg-white/5' : 'border-transparent text-muted-foreground hover:bg-white/5'}`}
          >
            <Terminal size={14} /> Terminal
          </button>
        </div>
        
        {activeConsoleTab === 'output' && (
          <button
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 mr-2"
            title="Clear Console"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {activeConsoleTab === 'output' ? (
          <>
            {logs.map((log) => (
              <div
                key={log.id}
                className={`flex gap-3 leading-relaxed ${
                  log.type === "error"
                    ? "text-destructive"
                    : log.type === "warn"
                    ? "text-yellow-400"
                    : "text-foreground/80"
                }`}
              >
                <span className="text-muted-foreground opacity-50 shrink-0">
                  [{log.timestamp}]
                </span>
                <span className="whitespace-pre-wrap break-all">{log.text}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-muted-foreground/50 italic flex items-center justify-center h-full">
                No output
              </div>
            )}
            <div ref={endRef} />
          </>
        ) : (
          <div className="flex flex-col h-full text-green-400">
            {terminalLines.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap break-all">{line}</div>
            ))}
            <div className="flex mt-1 items-center">
              <span className="shrink-0">user@luauide:~$ </span>
              <input 
                type="text" 
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleTerminalSubmit}
                className="flex-1 bg-transparent border-none outline-none text-green-400 ml-2 focus:ring-0"
                autoFocus
                spellCheck={false}
              />
              <span className="w-2 h-4 bg-green-400 ml-1 animate-[blink_1s_ease_infinite]"></span>
            </div>
            <div ref={terminalEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
