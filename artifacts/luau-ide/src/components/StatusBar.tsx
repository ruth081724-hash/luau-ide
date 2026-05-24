import React from "react";

interface StatusBarProps {
  line: number;
  col: number;
  autosaveStatus?: 'saved' | 'saving' | 'unsaved';
}

export function StatusBar({ line, col, autosaveStatus = 'saved' }: StatusBarProps) {
  return (
    <div className="hidden md:flex h-6 bg-primary text-primary-foreground items-center justify-between px-3 text-[11px] font-mono shrink-0">
      <div className="flex items-center gap-4">
        <span className="font-bold tracking-wider">LUAU IDE</span>
        <span className="opacity-80 flex items-center gap-2">
          {autosaveStatus === 'saving' && <><div className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse" /> Saving...</>}
          {autosaveStatus === 'unsaved' && <><div className="w-2 h-2 rounded-full bg-yellow-400" /> Unsaved</>}
          {autosaveStatus === 'saved' && <><div className="w-2 h-2 rounded-full bg-green-400" /> Autosaved</>}
        </span>
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
