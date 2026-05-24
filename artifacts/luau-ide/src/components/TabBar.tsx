import React from "react";
import { X, FileCode } from "lucide-react";
import { FileNode } from "../lib/fileSystem";

interface TabBarProps {
  openFiles: FileNode[];
  activeFileId?: string;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string, e: React.MouseEvent) => void;
}

export function TabBar({ openFiles, activeFileId, onTabSelect, onTabClose }: TabBarProps) {
  if (openFiles.length === 0) return null;

  return (
    <div className="flex bg-[#0d1117] overflow-x-auto no-scrollbar border-b border-border shrink-0">
      {openFiles.map((file) => {
        const isActive = file.id === activeFileId;
        return (
          <div
            key={file.id}
            onClick={() => onTabSelect(file.id)}
            className={`group flex items-center gap-2 min-w-[120px] max-w-[200px] h-9 px-3 border-r border-border border-b-2 cursor-pointer select-none transition-colors ${
              isActive
                ? "bg-card border-b-primary text-foreground"
                : "bg-[#0d1117] border-b-transparent text-muted-foreground hover:bg-white/5"
            }`}
          >
            <FileCode size={14} className={isActive ? "text-primary" : "text-muted-foreground"} />
            <span className="truncate text-sm flex-1">{file.name}</span>
            <button
              onClick={(e) => onTabClose(file.id, e)}
              className={`p-0.5 rounded-sm hover:bg-white/10 ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              } transition-opacity`}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
