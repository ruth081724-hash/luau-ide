import React, { useState } from "react";
import { ChevronRight, ChevronDown, FileCode, Folder, FolderOpen } from "lucide-react";
import { FileNode } from "../lib/fileSystem";

interface FileExplorerProps {
  nodes: FileNode[];
  onFileSelect: (id: string) => void;
  activeFileId?: string;
}

export function FileExplorer({ nodes, onFileSelect, activeFileId }: FileExplorerProps) {
  return (
    <div className="w-full h-full overflow-y-auto text-sm bg-card flex flex-col border-r border-border">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4 pb-2">
        Explorer
      </div>
      <div className="px-2">
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
        className={`flex items-center gap-1.5 py-1 px-2 rounded-sm cursor-pointer select-none transition-colors ${
          isActive
            ? "bg-primary/20 text-primary font-medium"
            : "text-foreground hover:bg-white/5"
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {isFolder ? (
          <div className="text-muted-foreground w-4 h-4 flex items-center justify-center">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        ) : (
          <div className="w-4 h-4 flex items-center justify-center">
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
