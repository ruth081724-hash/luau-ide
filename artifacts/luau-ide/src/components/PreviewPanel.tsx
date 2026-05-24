import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ParsedUI } from "../hooks/useLuauParser";

interface PreviewPanelProps {
  parsedUI: ParsedUI;
  isMobile?: boolean;
}

export function PreviewPanel({ parsedUI, isMobile }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});
  
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || isMobile) return;
      setPos({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

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
      {/* Background map effect */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222), repeating-linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222)",
          backgroundPosition: "0 0, 10px 10px",
          backgroundSize: "20px 20px"
        }}
      />
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Simulated Roblox Window */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={!isMobile ? { transform: `translate(${pos.x}px, ${pos.y}px)` } : {}}
        className={`relative z-10 max-h-[80%] flex flex-col glass-panel rounded-xl overflow-hidden border border-white/5 ide-glow shadow-2xl ${isMobile ? 'w-full px-4' : 'w-[450px]'}`}
      >
        {/* Title Bar */}
        <div 
          className={`h-10 bg-black/40 flex items-center px-4 border-b border-white/5 backdrop-blur-md ${!isMobile ? 'cursor-move' : ''}`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex gap-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center text-sm font-medium text-white/90 truncate mr-12 select-none">
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
                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest whitespace-nowrap select-none">
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

                {el.type === "toggle" && (() => {
                  const isOn = toggleStates[el.id] ?? el.props.currentValue;
                  return (
                    <div className="w-full bg-white/5 p-3 rounded-lg flex items-center justify-between border border-white/5">
                      <span className="text-sm font-medium text-white/90">{el.name}</span>
                      <div 
                        className={`w-10 h-5 rounded-full p-1 transition-colors cursor-pointer ${isOn ? 'bg-primary' : 'bg-white/20'}`} 
                        onClick={() => {
                          setToggleStates(prev => ({ ...prev, [el.id]: !isOn }));
                          toast("Toggle changed");
                        }}
                      >
                        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  );
                })()}

                {el.type === "slider" && (
                  <div className="w-full bg-white/5 p-3 rounded-lg border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white/90">{el.name}</span>
                      <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{el.props.currentValue}</span>
                    </div>
                    <input 
                      type="range" 
                      min={el.props.min || 0} 
                      max={el.props.max || 100} 
                      defaultValue={el.props.currentValue || 0}
                      className="w-full"
                      style={{ accentColor: 'hsl(var(--primary))' }}
                    />
                  </div>
                )}

                {el.type === "input" && (
                  <div className="w-full bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-sm font-medium text-white/90 block mb-2">{el.name}</span>
                    <input 
                      type="text" 
                      placeholder={el.props.placeholder}
                      className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
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
