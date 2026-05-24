import React from "react";
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
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-t border-border font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-2 text-muted-foreground uppercase text-xs font-bold tracking-wider">
          <Terminal size={14} />
          <span>Output</span>
        </div>
        <button
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          title="Clear Console"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
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
      </div>
    </div>
  );
}
