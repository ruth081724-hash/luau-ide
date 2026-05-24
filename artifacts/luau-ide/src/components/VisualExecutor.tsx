import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Play, Copy, Download, ArrowLeft, Zap } from "lucide-react";
import { Editor } from "./Editor";
import { PreviewPanel } from "./PreviewPanel";
import { useLuauParser } from "../hooks/useLuauParser";

const STARTER_CODE = `-- Visual Executor — Escribe tu script de Rayfield aqui
-- La preview se actualiza en tiempo real a la derecha

local Rayfield = require(game:GetService("ReplicatedStorage"):WaitForChild("Rayfield"))

local Window = Rayfield:CreateWindow({
    Name = "Mi Script",
    LoadingTitle = "Cargando...",
    LoadingSubtitle = "by michaelarsx",
    Theme = "Default",
})

local Tab = Window:CreateTab("Principal")

local Section = Tab:CreateSection("Controles")

local Button = Tab:CreateButton({
    Name = "Ejecutar Accion",
    Callback = function()
        print("Accion ejecutada!")
    end,
})

local Toggle = Tab:CreateToggle({
    Name = "Activar Modo",
    CurrentValue = false,
    Callback = function(Value)
        print("Toggle:", Value)
    end,
})

local Slider = Tab:CreateSlider({
    Name = "Velocidad",
    Range = {0, 100},
    Increment = 1,
    CurrentValue = 50,
    Callback = function(Value)
        print("Velocidad:", Value)
    end,
})

local Input = Tab:CreateInput({
    Name = "Nombre del Jugador",
    PlaceholderText = "Escribe aqui...",
    Callback = function(Text)
        print("Input:", Text)
    end,
})
`;

interface VisualExecutorProps {
  onBack: () => void;
  isMobile: boolean;
}

export function VisualExecutor({ onBack, isMobile }: VisualExecutorProps) {
  const [code, setCode] = useState(STARTER_CODE);
  const [showPreview, setShowPreview] = useState(true);
  const parsedUI = useLuauParser(code);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    toast.success("Script copiado al portapapeles!");
  }, [code]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "script.lua";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Script descargado!");
  }, [code]);

  const handleRun = useCallback(() => {
    toast.success("Script ejecutado — revisa la preview", { duration: 2000 });
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
      {/* Executor TopBar */}
      <div className="h-11 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-3 md:px-4 shrink-0 z-20">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm px-2 py-1 rounded hover:bg-white/5"
          >
            <ArrowLeft size={14} />
            <span className="hidden md:inline">Volver</span>
          </button>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#58a6ff] to-[#bd93f9] flex items-center justify-center">
              <Zap size={11} className="text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-[#58a6ff] to-[#bd93f9] bg-clip-text text-transparent">
              Visual Executor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          {isMobile && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors border ${showPreview ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              {showPreview ? "Editor" : "Preview"}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-white/5"
            title="Copiar script"
          >
            <Copy size={15} />
          </button>
          <button
            onClick={handleDownload}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-white/5"
            title="Descargar .lua"
          >
            <Download size={15} />
          </button>
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#58a6ff] to-[#bd93f9] text-white px-3 py-1.5 rounded text-xs font-bold hover:opacity-90 transition-opacity active:scale-95 neon-glow-blue"
          >
            <Play size={12} fill="currentColor" />
            <span className="hidden md:inline">Ejecutar</span>
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {isMobile ? (
          /* Mobile: switch between editor and preview */
          <div className="flex-1 overflow-hidden">
            {!showPreview ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full"
              >
                <Editor
                  content={code}
                  onChange={setCode}
                  onRun={handleRun}
                  isMobile={true}
                />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full"
              >
                <PreviewPanel parsedUI={parsedUI} isMobile={true} />
              </motion.div>
            )}
          </div>
        ) : (
          /* Desktop: editor left, preview right */
          <>
            <div className="flex-1 flex flex-col border-r border-border overflow-hidden">
              {/* Hint bar */}
              <div className="bg-[#0d1117]/80 border-b border-border px-4 py-1.5 text-xs text-muted-foreground/60 flex items-center gap-2 shrink-0">
                <Zap size={10} className="text-primary/60" />
                Escribe código Luau — la preview se actualiza automáticamente
                <span className="ml-auto text-muted-foreground/40">Ctrl+Enter para ejecutar</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <Editor
                  content={code}
                  onChange={setCode}
                  onRun={handleRun}
                  isMobile={false}
                />
              </div>
            </div>
            <div className="w-[45%] min-w-[300px] max-w-[600px] overflow-hidden">
              <PreviewPanel parsedUI={parsedUI} isMobile={false} />
            </div>
          </>
        )}
      </div>

      {/* Credits bar */}
      <div className="h-5 hidden md:flex bg-accent/80 text-white items-center justify-between px-3 text-[10px] font-mono shrink-0">
        <span className="font-bold tracking-wider">VISUAL EXECUTOR</span>
        <span className="opacity-80">by michaelarsx · ig: michael_esp</span>
      </div>
    </div>
  );
}
