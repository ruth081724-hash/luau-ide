import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ParsedUI } from "../hooks/useLuauParser";

interface PreviewPanelProps {
  parsedUI: ParsedUI;
}

export function PreviewPanel({ parsedUI }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!parsedUI.window && parsedUI.elements.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-card relative overflow-hidden">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />
        <div className="text-center z-10 p-8 max-w-sm glass-panel rounded-xl">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Live UI Preview</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Write <code className="text-primary bg-primary/10 px-1 py-0.5 rounded">CreateWindow</code>, <code className="text-primary bg-primary/10 px-1 py-0.5 rounded">CreateButton</code>, <code className="text-primary bg-primary/10 px-1 py-0.5 rounded">CreateToggle</code> to preview your Rayfield UI.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center h-full w-full bg-black/90 overflow-hidden">
      {/* Blurred background map effect */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')"
        }}
      />
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Simulated Roblox Window */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-[450px] max-h-[80%] flex flex-col glass-panel rounded-xl overflow-hidden border border-white/5 ide-glow shadow-2xl"
      >
        {/* Title Bar */}
        <div className="h-10 bg-black/40 flex items-center px-4 border-b border-white/5 backdrop-blur-md">
          <div className="flex gap-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center text-sm font-medium text-white/90 truncate mr-12">
            {parsedUI.window?.name || "Rayfield UI"}
          </div>
        </div>

        {/* Tabs */}
        {parsedUI.tabs.length > 0 && (
          <div className="flex gap-2 p-3 bg-black/20 overflow-x-auto no-scrollbar">
            {parsedUI.tabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === idx 
                    ? "bg-primary text-white shadow-[0_0_10px_rgba(88,166,255,0.4)]" 
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-black/40">
          <AnimatePresence>
            {parsedUI.elements.map((el, i) => (
              <motion.div
                key={el.id + i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {el.type === "section" && (
                  <div className="flex items-center gap-4 mt-6 mb-2">
                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">
                      {el.name}
                    </div>
                    <div className="h-px w-full bg-white/10" />
                  </div>
                )}
                
                {el.type === "button" && (
                  <button 
                    onClick={() => toast.success(`Button "${el.name}" clicked`)}
                    className="w-full bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all p-3 rounded-lg flex items-center justify-between group border border-white/5 hover:border-primary/50"
                  >
                    <span className="text-sm font-medium text-white/90">{el.name}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/40 group-hover:text-primary transition-colors">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}

                {el.type === "toggle" && (
                  <div className="w-full bg-white/5 p-3 rounded-lg flex items-center justify-between border border-white/5">
                    <span className="text-sm font-medium text-white/90">{el.name}</span>
                    <div className={`w-10 h-5 rounded-full p-1 transition-colors cursor-pointer ${el.props.currentValue ? 'bg-primary' : 'bg-white/20'}`} onClick={() => toast("Toggle changed")}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${el.props.currentValue ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                )}

                {el.type === "slider" && (
                  <div className="w-full bg-white/5 p-3 rounded-lg border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white/90">{el.name}</span>
                      <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{el.props.currentValue}</span>
                    </div>
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden relative">
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-primary ide-glow shadow-primary"
                        style={{ width: `${((el.props.currentValue - el.props.min) / (el.props.max - el.props.min)) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {el.type === "input" && (
                  <div className="w-full bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-sm font-medium text-white/90 block mb-2">{el.name}</span>
                    <input 
                      type="text" 
                      placeholder={el.props.placeholder}
                      className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                      onChange={() => {}}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
