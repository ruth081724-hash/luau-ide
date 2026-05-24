import React, { useRef } from "react";
import { Editor as MonacoEditor, useMonaco } from "@monaco-editor/react";
import { luauLanguageDef, luauTheme } from "../lib/luauSyntax";

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  isMobile?: boolean;
  onCursorChange?: (line: number, col: number) => void;
}

export function Editor({ content, onChange, onRun, isMobile, onCursorChange }: EditorProps) {
  const monaco = useMonaco();
  const completionProviderRef = useRef<any>(null);

  React.useEffect(() => {
    if (monaco) {
      // Register Language
      monaco.languages.register({ id: "luau" });
      monaco.languages.setMonarchTokensProvider("luau", luauLanguageDef as any);

      // Register Theme
      monaco.editor.defineTheme("luau-dark", luauTheme as any);
      monaco.editor.setTheme("luau-dark");

      if (!completionProviderRef.current) {
        completionProviderRef.current = monaco.languages.registerCompletionItemProvider("luau", {
          provideCompletionItems: (model, position) => {
            const word = model.getWordUntilPosition(position);
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            };

            const keywords = ["local", "function", "end", "if", "then", "else", "return", "for", "while", "do", "repeat", "until", "break", "continue", "not", "and", "or", "in"];
            const globals = ["game", "workspace", "script", "Players", "ReplicatedStorage"];
            const rayfield = ["CreateWindow", "CreateTab", "CreateSection", "CreateButton", "CreateToggle", "CreateSlider", "CreateInput"];

            const suggestions = [
              ...keywords.map(k => ({
                label: k,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: k,
                range,
              })),
              ...globals.map(g => ({
                label: g,
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: g,
                range,
              })),
              ...rayfield.map(r => ({
                label: r,
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: r,
                range,
              })),
            ];

            return { suggestions };
          }
        });
      }
    }
  }, [monaco]);

  const handleEditorDidMount = (editor: any) => {
    if (onRun && monaco) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onRun();
      });
    }

    editor.onDidChangeCursorPosition((e: any) => {
      onCursorChange?.(e.position.lineNumber, e.position.column);
    });
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
          minimap: { enabled: !isMobile, scale: 1 },
          wordWrap: isMobile ? 'on' : 'off',
          fontSize: isMobile ? 12 : 14,
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
