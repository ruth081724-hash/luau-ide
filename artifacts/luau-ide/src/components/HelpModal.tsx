import { X, Keyboard, Info, ExternalLink } from "lucide-react";

interface HelpModalProps {
  onClose: () => void;
}

const shortcuts = [
  { keys: ["Ctrl", "Enter"], desc: "Run script" },
  { keys: ["Ctrl", "S"], desc: "Save / Autosave" },
  { keys: ["Ctrl", "Z"], desc: "Undo" },
  { keys: ["Ctrl", "Shift", "Z"], desc: "Redo" },
  { keys: ["Ctrl", "/"], desc: "Toggle comment" },
  { keys: ["Ctrl", "D"], desc: "Duplicate line" },
  { keys: ["Alt", "↑/↓"], desc: "Move line up/down" },
  { keys: ["Ctrl", "Space"], desc: "IntelliSense / Autocomplete" },
  { keys: ["F1"], desc: "Command palette" },
  { keys: ["Ctrl", "G"], desc: "Go to line" },
];

const uiComponents = [
  { name: "CreateWindow({Name = \"...\"})", desc: "Creates the main window" },
  { name: "CreateTab(\"...\")", desc: "Adds a navigation tab" },
  { name: "CreateSection(\"...\")", desc: "Adds a section header" },
  { name: "CreateButton({Name = \"...\"})", desc: "Clickable button" },
  { name: "CreateToggle({Name = \"...\", CurrentValue = false})", desc: "Toggle switch" },
  { name: "CreateSlider({Name = \"...\", Range = {0,100}, CurrentValue = 50})", desc: "Slider control" },
  { name: "CreateInput({Name = \"...\", PlaceholderText = \"...\"})", desc: "Text input field" },
];

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="glass-panel w-full max-w-xl rounded-xl overflow-hidden shadow-2xl neon-glow-blue max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Info size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground">Help & Documentation</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-7">
          {/* Keyboard Shortcuts */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Keyboard size={15} className="text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Keyboard Shortcuts</h3>
            </div>
            <div className="space-y-1.5">
              {shortcuts.map((s) => (
                <div key={s.desc} className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-sm text-muted-foreground">{s.desc}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k) => (
                      <kbd key={k} className="bg-white/10 border border-white/15 text-foreground/80 text-xs px-1.5 py-0.5 rounded font-mono">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* UI Components Reference */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink size={15} className="text-accent" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Rayfield UI Components</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">These components are detected from your Luau code and rendered in the preview panel in real time.</p>
            <div className="space-y-2">
              {uiComponents.map((c) => (
                <div key={c.name} className="py-2 px-3 rounded-lg bg-white/3 border border-white/5">
                  <code className="text-xs text-primary font-mono block mb-1 break-all">{c.name}</code>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* About */}
          <section className="border-t border-white/10 pt-5">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              LuauIDE v1.2.0 — Visual Executor Edition<br />
              Created by <span className="text-primary font-semibold">michaelarsx</span>
              {" · "}Instagram: <span className="text-accent font-medium">michael_esp</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
