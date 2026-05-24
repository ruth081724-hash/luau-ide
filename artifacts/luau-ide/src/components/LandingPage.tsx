import React from "react";
import { Code2, Monitor, Download, Share } from "lucide-react";

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col items-center justify-center animated-gradient particles-bg">
      {/* Decorative particles */}
      <div className="absolute top-[20%] left-[15%] w-12 h-12 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
      <div className="absolute top-[60%] left-[10%] w-6 h-6 bg-accent/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[30%] right-[20%] w-10 h-10 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[70%] right-[15%] w-16 h-16 bg-accent/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-[10%] left-[40%] w-8 h-8 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-[10%] left-[50%] w-4 h-4 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }} />
      
      <div className="z-10 text-center flex flex-col items-center max-w-4xl px-4">
        <h1 className="text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-[#58a6ff] to-[#bd93f9] bg-clip-text text-transparent">
          LuauIDE
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl font-light">
          The most powerful Luau scripting environment on the web
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          <div className="glass-panel rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 text-primary">
              <Code2 size={24} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Monaco Editor</h3>
            <p className="text-muted-foreground text-sm">Full VS Code editing experience</p>
          </div>
          
          <div className="glass-panel rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 border border-accent/20 text-accent">
              <Monitor size={24} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Live Preview</h3>
            <p className="text-muted-foreground text-sm">Real-time Rayfield UI rendering</p>
          </div>
          
          <div className="glass-panel rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 text-primary">
              <Share size={24} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Export & Share</h3>
            <p className="text-muted-foreground text-sm">Copy, download and share scripts</p>
          </div>
        </div>

        <button
          onClick={onEnter}
          className="bg-gradient-to-r from-[#58a6ff] to-[#bd93f9] text-white py-4 px-10 rounded-xl text-lg font-bold hover:scale-105 transition-transform neon-glow-blue active:scale-95 mb-4 shadow-lg"
        >
          Open IDE
        </button>
        
        <div className="inline-flex items-center justify-center bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-muted-foreground mb-8">
          v1.0.0
        </div>
        
        <p className="text-muted-foreground/60 text-sm">
          Made for Roblox Developers
        </p>
      </div>
    </div>
  );
}
