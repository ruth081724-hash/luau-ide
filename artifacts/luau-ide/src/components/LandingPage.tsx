import React from "react";
import { Code2, Monitor, Share, Zap, Instagram } from "lucide-react";

interface LandingPageProps {
  onEnter: () => void;
  onEnterExecutor: () => void;
}

export function LandingPage({ onEnter, onEnterExecutor }: LandingPageProps) {
  return (
    <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col items-center justify-center animated-gradient particles-bg">
      <div className="absolute top-[20%] left-[15%] w-12 h-12 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
      <div className="absolute top-[60%] left-[10%] w-6 h-6 bg-accent/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[30%] right-[20%] w-10 h-10 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[70%] right-[15%] w-16 h-16 bg-accent/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-[10%] left-[40%] w-8 h-8 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-[10%] left-[50%] w-4 h-4 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }} />
      <div className="absolute top-[50%] left-[5%] w-20 h-20 bg-primary/10 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[15%] right-[5%] w-7 h-7 bg-accent/25 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />

      <div className="z-10 text-center flex flex-col items-center max-w-4xl px-4 w-full">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs text-primary font-medium mb-6">
          <Zap size={12} />
          v1.2.0 — Visual Executor Edition
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-[#58a6ff] to-[#bd93f9] bg-clip-text text-transparent">
          LuauIDE
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl font-light">
          The most powerful Luau scripting environment on the web
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-10">
          <div className="glass-panel rounded-xl p-5 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-3 border border-primary/20 text-primary">
              <Code2 size={22} />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Monaco Editor</h3>
            <p className="text-muted-foreground text-xs">Full VS Code editing experience with IntelliSense</p>
          </div>

          <div className="glass-panel rounded-xl p-5 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center mb-3 border border-accent/20 text-accent">
              <Monitor size={22} />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Live Preview</h3>
            <p className="text-muted-foreground text-xs">Real-time Rayfield UI rendering as you type</p>
          </div>

          <div className="glass-panel rounded-xl p-5 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-3 border border-primary/20 text-primary">
              <Share size={22} />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Export & Share</h3>
            <p className="text-muted-foreground text-xs">Copy, download and share scripts instantly</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 w-full max-w-md">
          <button
            onClick={onEnter}
            className="w-full sm:flex-1 bg-gradient-to-r from-[#58a6ff] to-[#bd93f9] text-white py-3.5 px-8 rounded-xl text-base font-bold hover:scale-105 transition-transform neon-glow-blue active:scale-95 shadow-lg"
          >
            Open IDE
          </button>
          <button
            onClick={onEnterExecutor}
            className="w-full sm:flex-1 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-primary/40 text-foreground py-3.5 px-8 rounded-xl text-base font-bold hover:scale-105 transition-all active:scale-95"
          >
            Visual Executor
          </button>
        </div>

        <p className="text-muted-foreground/50 text-xs mb-6">
          Open IDE = full VS Code experience &nbsp;•&nbsp; Visual Executor = escribe y ve la preview
        </p>
      </div>

      {/* Credits */}
      <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1 z-10">
        <div className="flex items-center gap-2 text-muted-foreground/60 text-xs">
          <span>Created by</span>
          <span className="text-primary font-semibold">michaelarsx</span>
          <span className="text-muted-foreground/30">•</span>
          <Instagram size={12} className="text-muted-foreground/60" />
          <span className="text-accent/80 font-medium">michael_esp</span>
        </div>
      </div>
    </div>
  );
}
