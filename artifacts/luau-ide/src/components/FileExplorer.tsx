import React, { useState } from "react";
import { ChevronRight, ChevronDown, FileCode, Plus } from "lucide-react";
import { FileNode } from "../lib/fileSystem";
import { toast } from "sonner";

interface FileExplorerProps {
  nodes: FileNode[];
  onFileSelect: (id: string) => void;
  activeFileId?: string;
}

export function FileExplorer({ nodes, onFileSelect, activeFileId }: FileExplorerProps) {
  return (
    <div className="w-full h-full overflow-y-auto text-sm bg-card flex flex-col border-r border-border relative pb-12">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4 pb-2 shrink-0">
        Explorer
      </div>
      <div className="px-2 flex-1 overflow-y-auto">
        {nodes.map((node) => (
          <FileNodeItem
            key={node.id}
            node={node}
            level={0}
            onFileSelect={onFileSelect}
            activeFileId={activeFileId}
          />
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-card border-t border-border">
        <button 
          onClick={() => toast.info("New file — coming soon!")}
          className="w-full flex items-center justify-center gap-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 rounded transition-colors"
        >
          <Plus size={14} /> New File
        </button>
      </div>
    </div>
  );
}

function FileNodeItem({
  node,
  level,
  onFileSelect,
  activeFileId,
}: {
  node: FileNode;
  level: number;
  onFileSelect: (id: string) => void;
  activeFileId?: string;
}) {
  const [isOpen, setIsOpen] = useState(node.isOpen ?? false);

  const isFolder = node.type === "folder";
  const isActive = node.id === activeFileId;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node.id);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 min-h-[40px] md:min-h-[28px] py-1 px-2 rounded-sm cursor-pointer select-none transition-colors ${
          isActive
            ? "bg-primary/20 text-primary font-medium"
            : "text-foreground hover:bg-white/5"
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {isFolder ? (
          <div className="text-muted-foreground w-4 h-4 flex items-center justify-center shrink-0">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        ) : (
          <div className="w-4 h-4 flex items-center justify-center shrink-0">
            <FileCode size={14} className="text-primary/80" />
          </div>
        )}
        <span className="truncate">{node.name}</span>
      </div>
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              activeFileId={activeFileId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
