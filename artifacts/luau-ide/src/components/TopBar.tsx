import { useState } from "react";
import { Play, Box, Copy, Download, Palette, History, X, HelpCircle } from "lucide-react";
import { HelpModal } from "./HelpModal";

interface TopBarProps {
  onRun?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  theme?: 'default' | 'purple' | 'green';
  onThemeChange?: (theme: 'default' | 'purple' | 'green') => void;
  onMenuClick?: (item: string) => void;
}

export function TopBar({ onRun, onCopy, onDownload, theme = 'default', onThemeChange, onMenuClick }: TopBarProps) {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menuItems = ["File", "Edit", "View", "Run", "Help"];

  const handleMenuClick = (item: string) => {
    setShowMobileMenu(false);
    if (item === "Help") {
      setShowHelp(true);
      return;
    }
    onMenuClick?.(item);
  };

  return (
    <>
      <div className="h-11 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-3 md:px-4 shrink-0 relative z-20">
        {/* Left: logo + menu */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center border border-primary/50 ide-glow-accent">
              <Box size={13} className="text-primary" />
            </div>
            <span className="font-bold text-sm tracking-wide text-foreground">LuauIDE</span>
          </div>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center gap-0.5 text-sm">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => handleMenuClick(item)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  item === "Help"
                    ? "text-primary/80 hover:text-primary hover:bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <div className="relative md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-muted-foreground hover:text-foreground text-xl leading-none px-1 py-0.5"
            >
              ☰
            </button>
            {showMobileMenu && (
              <div className="absolute top-full left-0 mt-1 glass-panel rounded-lg p-1.5 z-50 flex flex-col gap-0.5 w-32 shadow-xl border border-border">
                {menuItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleMenuClick(item)}
                    className={`px-3 py-2 text-sm rounded text-left transition-colors ${
                      item === "Help"
                        ? "text-primary hover:bg-primary/10"
                        : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 md:gap-1.5">
          {onRun && (
            <button
              onClick={onRun}
              className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded text-xs font-bold transition-all shadow-[0_0_15px_-3px_rgba(88,166,255,0.4)] active:scale-95 mr-1"
              data-testid="button-run"
            >
              <Play size={12} fill="currentColor" />
              <span className="hidden md:inline">Run Script</span>
            </button>
          )}

          <div className="w-px h-5 bg-border mx-0.5" />

          {onCopy && (
            <button onClick={onCopy} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-white/5" title="Copiar script">
              <Copy size={15} />
            </button>
          )}

          {onDownload && (
            <button onClick={onDownload} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-white/5" title="Descargar .lua">
              <Download size={15} />
            </button>
          )}

          {/* Theme picker */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-white/5"
              title="Tema"
            >
              <Palette size={15} />
            </button>
            {showThemePicker && onThemeChange && (
              <div className="absolute top-full right-0 mt-2 glass-panel rounded-lg p-2 z-50 flex flex-col gap-1 w-32 shadow-xl border border-border">
                {([['default', 'Azul'], ['purple', 'Morado'], ['green', 'Verde']] as const).map(([t, label]) => (
                  <button
                    key={t}
                    onClick={() => { onThemeChange(t); setShowThemePicker(false); }}
                    className={`px-3 py-1.5 text-sm rounded text-left flex items-center gap-2 transition-colors ${theme === t ? 'bg-primary/20 text-primary' : 'hover:bg-white/10 text-muted-foreground hover:text-foreground'}`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${t === 'default' ? 'bg-[#58a6ff]' : t === 'purple' ? 'bg-[#bd93f9]' : 'bg-[#2ea043]'}`} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Changelog */}
          <button
            onClick={() => setShowChangelog(true)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-white/5"
            title="Changelog"
          >
            <History size={15} />
          </button>

          {/* Help */}
          <button
            onClick={() => setShowHelp(true)}
            className="text-primary/70 hover:text-primary transition-colors p-1.5 rounded hover:bg-primary/10"
            title="Ayuda"
          >
            <HelpCircle size={15} />
          </button>
        </div>
      </div>

      {/* Changelog modal */}
      {showChangelog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowChangelog(false)}>
          <div className="glass-panel w-full max-w-md rounded-xl p-6 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowChangelog(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded hover:bg-white/10 transition-colors">
              <X size={18} />
            </button>
            <h2 className="text-lg font-bold mb-5 text-foreground">Changelog</h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-primary font-semibold flex items-center gap-2 mb-2 text-sm">
                  v1.2.0 <span className="text-[10px] bg-primary/20 px-2 py-0.5 rounded text-primary">Nuevo</span>
                </h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  <li>Visual Executor — solo editor + preview</li>
                  <li>Search funcional en archivos</li>
                  <li>Help con shortcuts completo</li>
                  <li>Créditos michaelarsx</li>
                </ul>
              </div>
              <div>
                <h3 className="text-foreground/70 font-semibold mb-2 text-sm">v1.1.0</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  <li>IntelliSense & Autocomplete</li>
                  <li>Minimap, Terminal, Themes</li>
                  <li>Preview arrastrable, móvil responsive</li>
                </ul>
              </div>
              <div>
                <h3 className="text-foreground/50 font-semibold mb-2 text-sm">v1.0.0</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                  <li>Monaco Editor, Rayfield Preview</li>
                </ul>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-muted-foreground/50">
              by michaelarsx · ig: michael_esp
            </div>
          </div>
        </div>
      )}

      {/* Help modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
