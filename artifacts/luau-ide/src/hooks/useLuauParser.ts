import { useState, useEffect } from "react";

export type UIComponentType =
  | "window"
  | "tab"
  | "section"
  | "button"
  | "toggle"
  | "slider"
  | "input"
  | "label"
  | "dropdown";

export interface UIComponent {
  id: string;
  type: UIComponentType;
  name: string;
  props: Record<string, any>;
}

export interface ParsedUI {
  window: UIComponent | null;
  tabs: UIComponent[];
  elements: UIComponent[]; // All other elements
}

export function useLuauParser(code: string) {
  const [parsed, setParsed] = useState<ParsedUI>({
    window: null,
    tabs: [],
    elements: [],
  });

  useEffect(() => {
    // Simple debounce to avoid thrashing on every keystroke
    const timer = setTimeout(() => {
      const result: ParsedUI = {
        window: null,
        tabs: [],
        elements: [],
      };

      try {
        // Parse Window
        const windowMatch = code.match(/CreateWindow\(\s*\{([^}]+)\}\)/);
        if (windowMatch) {
          const nameMatch = windowMatch[1].match(/Name\s*=\s*"([^"]+)"/);
          result.window = {
            id: "window_1",
            type: "window",
            name: nameMatch ? nameMatch[1] : "Window",
            props: {},
          };
        }

        // Parse Tabs
        const tabMatches = [...code.matchAll(/CreateTab\("([^"]+)"/g)];
        tabMatches.forEach((m, i) => {
          result.tabs.push({
            id: `tab_${i}`,
            type: "tab",
            name: m[1],
            props: {},
          });
        });

        // Parse Sections
        const sectionMatches = [...code.matchAll(/CreateSection\("([^"]+)"/g)];
        sectionMatches.forEach((m, i) => {
          result.elements.push({
            id: `sec_${i}`,
            type: "section",
            name: m[1],
            props: {},
          });
        });

        // Parse Buttons
        const buttonMatches = [...code.matchAll(/CreateButton\(\s*\{([^}]+)\}/g)];
        buttonMatches.forEach((m, i) => {
          const nameMatch = m[1].match(/Name\s*=\s*"([^"]+)"/);
          if (nameMatch) {
            result.elements.push({
              id: `btn_${i}`,
              type: "button",
              name: nameMatch[1],
              props: {},
            });
          }
        });

        // Parse Toggles
        const toggleMatches = [...code.matchAll(/CreateToggle\(\s*\{([^}]+)\}/g)];
        toggleMatches.forEach((m, i) => {
          const nameMatch = m[1].match(/Name\s*=\s*"([^"]+)"/);
          const valMatch = m[1].match(/CurrentValue\s*=\s*(true|false)/);
          if (nameMatch) {
            result.elements.push({
              id: `tgl_${i}`,
              type: "toggle",
              name: nameMatch[1],
              props: {
                currentValue: valMatch ? valMatch[1] === "true" : false,
              },
            });
          }
        });

        // Parse Sliders
        const sliderMatches = [...code.matchAll(/CreateSlider\(\s*\{([^}]+)\}/g)];
        sliderMatches.forEach((m, i) => {
          const nameMatch = m[1].match(/Name\s*=\s*"([^"]+)"/);
          const valMatch = m[1].match(/CurrentValue\s*=\s*(\d+)/);
          const rangeMatch = m[1].match(/Range\s*=\s*\{\s*(\d+)\s*,\s*(\d+)\s*\}/);
          if (nameMatch) {
            result.elements.push({
              id: `sld_${i}`,
              type: "slider",
              name: nameMatch[1],
              props: {
                currentValue: valMatch ? parseInt(valMatch[1]) : 0,
                min: rangeMatch ? parseInt(rangeMatch[1]) : 0,
                max: rangeMatch ? parseInt(rangeMatch[2]) : 100,
              },
            });
          }
        });

        // Parse Inputs
        const inputMatches = [...code.matchAll(/CreateInput\(\s*\{([^}]+)\}/g)];
        inputMatches.forEach((m, i) => {
          const nameMatch = m[1].match(/Name\s*=\s*"([^"]+)"/);
          const placeMatch = m[1].match(/PlaceholderText\s*=\s*"([^"]+)"/);
          if (nameMatch) {
            result.elements.push({
              id: `inp_${i}`,
              type: "input",
              name: nameMatch[1],
              props: {
                placeholder: placeMatch ? placeMatch[1] : "",
              },
            });
          }
        });

        // Re-order elements by their index in the code string so they display in order
        // This is a naive sort based on finding the first occurrence of the name
        result.elements.sort((a, b) => {
          return code.indexOf(a.name) - code.indexOf(b.name);
        });

      } catch (e) {
        console.error("Failed to parse code", e);
      }

      setParsed(result);
    }, 300);

    return () => clearTimeout(timer);
  }, [code]);

  return parsed;
}
