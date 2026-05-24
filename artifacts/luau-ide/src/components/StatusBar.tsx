import React from "react";

interface StatusBarProps {
  line: number;
  col: number;
}

export function StatusBar({ line, col }: StatusBarProps) {
  return (
    <div className="h-6 bg-primary text-primary-foreground flex items-center justify-between px-3 text-[11px] font-mono shrink-0">
      <div className="flex items-center gap-4">
        <span className="font-bold tracking-wider">LUAU IDE</span>
        <span className="opacity-80">Ready</span>
      </div>
      <div className="flex items-center gap-4 opacity-90">
        <span>Ln {line}, Col {col}</span>
        <span>Spaces: 4</span>
        <span>UTF-8</span>
        <span>Luau</span>
      </div>
    </div>
  );
}
