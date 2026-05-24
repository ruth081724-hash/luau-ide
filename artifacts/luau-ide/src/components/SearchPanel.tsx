import { useState, useMemo } from "react";
import { Search, FileCode, ChevronRight } from "lucide-react";
import { FileNode } from "../lib/fileSystem";

interface SearchResult {
  fileId: string;
  fileName: string;
  lineNumber: number;
  lineText: string;
  matchStart: number;
  matchEnd: number;
}

interface SearchPanelProps {
  fileSystem: FileNode[];
  onFileSelect: (id: string) => void;
}

function getAllFiles(nodes: FileNode[]): FileNode[] {
  const files: FileNode[] = [];
  for (const node of nodes) {
    if (node.type === "file") files.push(node);
    if (node.children) files.push(...getAllFiles(node.children));
  }
  return files;
}

export function SearchPanel({ fileSystem, onFileSelect }: SearchPanelProps) {
  const [query, setQuery] = useState("");

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    const allFiles = getAllFiles(fileSystem);
    const found: SearchResult[] = [];

    for (const file of allFiles) {
      if (!file.content) continue;
      const lines = file.content.split("\n");
      lines.forEach((line, i) => {
        const idx = line.toLowerCase().indexOf(q);
        if (idx !== -1) {
          found.push({
            fileId: file.id,
            fileName: file.name,
            lineNumber: i + 1,
            lineText: line.trim(),
            matchStart: idx,
            matchEnd: idx + q.length,
          });
        }
      });
    }
    return found.slice(0, 50);
  }, [query, fileSystem]);

  const grouped = useMemo(() => {
    const map = new Map<string, { fileName: string; results: SearchResult[] }>();
    for (const r of results) {
      if (!map.has(r.fileId)) map.set(r.fileId, { fileName: r.fileName, results: [] });
      map.get(r.fileId)!.results.push(r);
    }
    return map;
  }, [results]);

  return (
    <div className="w-full h-full flex flex-col bg-card border-r border-border overflow-hidden">
      <div className="p-3 border-b border-border shrink-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Search</p>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in files..."
            className="w-full bg-background border border-border rounded-md pl-8 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto text-xs">
        {query.trim().length < 2 && (
          <p className="text-muted-foreground/50 text-center mt-8 px-4">Type at least 2 characters to search</p>
        )}
        {query.trim().length >= 2 && results.length === 0 && (
          <p className="text-muted-foreground/50 text-center mt-8 px-4">No results for "{query}"</p>
        )}
        {Array.from(grouped.entries()).map(([fileId, { fileName, results: fileResults }]) => (
          <div key={fileId} className="mb-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-muted-foreground bg-background/30 border-b border-border/50 sticky top-0">
              <FileCode size={12} className="text-primary/70 shrink-0" />
              <span className="font-medium text-foreground/80 truncate">{fileName}</span>
              <span className="ml-auto text-muted-foreground/50 shrink-0">{fileResults.length}</span>
            </div>
            {fileResults.map((r, i) => (
              <button
                key={i}
                onClick={() => onFileSelect(r.fileId)}
                className="w-full text-left flex items-start gap-2 px-3 py-1.5 hover:bg-primary/10 transition-colors group"
              >
                <span className="text-muted-foreground/40 shrink-0 w-7 text-right">{r.lineNumber}</span>
                <ChevronRight size={10} className="mt-0.5 text-muted-foreground/30 shrink-0 group-hover:text-primary/50" />
                <span className="truncate text-foreground/70">
                  {r.lineText.substring(0, r.matchStart)}
                  <mark className="bg-primary/30 text-primary rounded-sm px-0.5">{r.lineText.substring(r.matchStart, r.matchEnd)}</mark>
                  {r.lineText.substring(r.matchEnd)}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
