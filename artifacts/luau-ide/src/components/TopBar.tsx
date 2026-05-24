import React, { useState } from "react";
import { Play, Settings, Box, Zap, Copy, Download, Palette, History, X } from "lucide-react";

interface TopBarProps {
  onRun?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  theme?: 'default' | 'purple' | 'green';
  onThemeChange?: (theme: 'default' | 'purple' | 'green') => void;
}

export function TopBar({ onRun, onCopy, onDownload, theme = 'default', onThemeChange }: TopBarProps) {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  return (
    <>
      <div className="h-12 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 relative z-20">
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

        <div className="flex items-center gap-2">
          {onRun && (
            <button
              onClick={onRun}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded text-sm font-medium transition-all shadow-[0_0_15px_-3px_rgba(88,166,255,0.4)] active:scale-95 mr-2"
            >
              <Play size={14} fill="currentColor" />
              <span className="hidden md:inline">Run Script</span>
            </button>
          )}
          
          <div className="w-px h-6 bg-border mx-1" />
          
          {onCopy && (
            <button onClick={onCopy} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-white/5" title="Copy code">
              <Copy size={16} />
            </button>
          )}
          
          {onDownload && (
            <button onClick={onDownload} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-white/5" title="Download .lua">
              <Download size={16} />
            </button>
          )}

          <div className="relative">
            <button 
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-white/5"
              title="Theme"
            >
              <Palette size={16} />
            </button>
            
            {showThemePicker && onThemeChange && (
              <div className="absolute top-full right-0 mt-2 glass-panel rounded-lg p-2 z-50 flex flex-col gap-1 w-32 shadow-xl border border-border">
                {(['default', 'purple', 'green'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => { onThemeChange(t); setShowThemePicker(false); }}
                    className={`px-3 py-1.5 text-sm rounded text-left capitalize ${theme === t ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowChangelog(true)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-white/5"
            title="Changelog"
          >
            <History size={16} />
          </button>
        </div>
      </div>

      {showChangelog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-xl p-6 relative">
            <button 
              onClick={() => setShowChangelog(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-6 text-foreground">Changelog</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-primary font-semibold flex items-center gap-2 mb-2">
                  v1.1.0 <span className="text-xs bg-primary/20 px-2 py-0.5 rounded text-primary">New</span>
                </h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  <li>IntelliSense & Autocomplete</li>
                  <li>Minimap support</li>
                  <li>Draggable Preview window</li>
                  <li>Mobile Support layout</li>
                  <li>Terminal interface</li>
                  <li>Themes</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-foreground/80 font-semibold mb-2">v1.0.0</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  <li>Initial release</li>
                  <li>Monaco Editor integration</li>
                  <li>Rayfield Preview engine</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
