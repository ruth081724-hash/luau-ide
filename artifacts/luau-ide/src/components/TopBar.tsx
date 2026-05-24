import React from "react";
import { Play, Settings, Box, Zap } from "lucide-react";

interface TopBarProps {
  onRun: () => void;
}

export function TopBar({ onRun }: TopBarProps) {
  return (
    <div className="h-12 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center border border-primary/50 ide-glow-accent">
            <Box size={14} className="text-primary" />
          </div>
          <span className="font-bold text-sm tracking-wide text-foreground">
            LuauIDE
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {["File", "Edit", "View", "Run", "Help"].map((item) => (
            <button
              key={item}
              className="px-3 py-1 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRun}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded text-sm font-medium transition-all shadow-[0_0_15px_-3px_rgba(88,166,255,0.4)] active:scale-95"
        >
          <Play size={14} fill="currentColor" />
          <span>Run Script</span>
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-white/5">
          <Zap size={16} />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-white/5">
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
