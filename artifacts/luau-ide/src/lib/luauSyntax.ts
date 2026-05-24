export const luauLanguageDef = {
  defaultToken: "",
  tokenPostfix: ".luau",

  keywords: [
    "and",
    "break",
    "do",
    "else",
    "elseif",
    "end",
    "false",
    "for",
    "function",
    "if",
    "in",
    "local",
    "nil",
    "not",
    "or",
    "repeat",
    "return",
    "then",
    "true",
    "until",
    "while",
    "continue",
    "export",
    "type",
  ],

  globals: [
    "game",
    "workspace",
    "script",
    "math",
    "string",
    "table",
    "coroutine",
    "task",
    "debug",
    "utf8",
    "bit32",
    "plugin",
    "shared",
    "_G",
    "os",
  ],

  services: [
    "Players",
    "ReplicatedStorage",
    "ServerScriptService",
    "ServerStorage",
    "StarterGui",
    "StarterPack",
    "StarterPlayer",
    "Lighting",
    "MaterialService",
    "NetworkClient",
    "NetworkServer",
    "SoundService",
    "Teams",
    "TestService",
    "VRService",
  ],

  functions: [
    "print",
    "warn",
    "error",
    "assert",
    "collectgarbage",
    "require",
    "getmetatable",
    "setmetatable",
    "ipairs",
    "pairs",
    "next",
    "pcall",
    "xpcall",
    "rawequal",
    "rawget",
    "rawlen",
    "rawset",
    "select",
    "tonumber",
    "tostring",
    "type",
    "unpack",
    "wait",
    "delay",
    "spawn",
    "tick",
    "time",
    "typeof",
    "UserSettings",
  ],

  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  tokenizer: {
    root: [
      // Identifiers and keywords
      [
        /[a-zA-Z_]\w*/,
        {
          cases: {
            "@keywords": "keyword",
            "@globals": "global",
            "@services": "service",
            "@functions": "function",
            "@default": "identifier",
          },
        },
      ],

      // Whitespace
      { include: "@whitespace" },

      // Delimiters and operators
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [
        /@symbols/,
        {
          cases: {
            "@default": "",
          },
        },
      ],

      // Numbers
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],

      // Strings
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      [/\[\[/, "string", "@string_block"],
    ],

    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/--\[\[/, "comment", "@comment"],
      [/--.*$/, "comment"],
    ],

    comment: [
      [/[^\]]+/, "comment"],
      [/\]\]/, "comment", "@pop"],
      [/[\]]/, "comment"],
    ],

    string_double: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"],
    ],

    string_single: [
      [/[^\\']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, "string", "@pop"],
    ],

    string_block: [
      [/[^\]]+/, "string"],
      [/\]\]/, "string", "@pop"],
      [/[\]]/, "string"],
    ],
  },
};

export const luauTheme = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "keyword", foreground: "ff7b72", fontStyle: "bold" },
    { token: "global", foreground: "79c0ff", fontStyle: "bold" },
    { token: "service", foreground: "d2a8ff", fontStyle: "italic" },
    { token: "function", foreground: "d2a8ff" },
    { token: "identifier", foreground: "c9d1d9" },
    { token: "number", foreground: "79c0ff" },
    { token: "string", foreground: "a5d6ff" },
    { token: "comment", foreground: "8b949e", fontStyle: "italic" },
    { token: "delimiter", foreground: "c9d1d9" },
  ],
  colors: {
    "editor.background": "#0d1117",
    "editor.foreground": "#c9d1d9",
    "editor.lineHighlightBackground": "#161b22",
    "editorCursor.foreground": "#58a6ff",
    "editorWhitespace.foreground": "#30363d",
    "editorIndentGuide.background": "#30363d",
    "editorIndentGuide.activeBackground": "#484f58",
    "editorLineNumber.foreground": "#6e7681",
    "editorLineNumber.activeForeground": "#c9d1d9",
  },
};
