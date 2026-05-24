import React from "react";
import { Editor as MonacoEditor, useMonaco } from "@monaco-editor/react";
import { luauLanguageDef, luauTheme } from "../lib/luauSyntax";

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  onRun?: () => void;
}

export function Editor({ content, onChange, onRun }: EditorProps) {
  const monaco = useMonaco();

  React.useEffect(() => {
    if (monaco) {
      // Register Language
      monaco.languages.register({ id: "luau" });
      monaco.languages.setMonarchTokensProvider("luau", luauLanguageDef as any);

      // Register Theme
      monaco.editor.defineTheme("luau-dark", luauTheme as any);
      monaco.editor.setTheme("luau-dark");
    }
  }, [monaco]);

  const handleEditorDidMount = (editor: any) => {
    if (onRun) {
      editor.addCommand(monaco?.KeyMod.CtrlCmd | monaco?.KeyCode.Enter, () => {
        onRun();
      });
    }
  };

  return (
    <div className="w-full h-full bg-[#0d1117]">
      <MonacoEditor
        height="100%"
        language="luau"
        theme="luau-dark"
        value={content}
        onChange={(val) => onChange(val || "")}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Menlo', monospace",
          lineHeight: 22,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
          renderLineHighlight: "all",
        }}
      />
    </div>
  );
}
