export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
  parentId?: string;
  isOpen?: boolean;
}

export const initialFileSystem: FileNode[] = [
  {
    id: "root",
    name: "Workspace",
    type: "folder",
    isOpen: true,
    children: [
      {
        id: "starter-player",
        name: "StarterPlayerScripts",
        type: "folder",
        parentId: "root",
        isOpen: true,
        children: [
          {
            id: "main-script",
            name: "MainScript.luau",
            type: "file",
            parentId: "starter-player",
            content: `-- MainScript.luau
-- Rayfield UI Example

local Rayfield = require(game:GetService("ReplicatedStorage"):WaitForChild("Rayfield"))

local Window = Rayfield:CreateWindow({
    Name = "My Roblox Script",
    LoadingTitle = "Loading...",
    LoadingSubtitle = "by Developer",
    Theme = "Default",
})

local Tab = Window:CreateTab("Main", 4483362458)

local Section = Tab:CreateSection("Controls")

local Button = Tab:CreateButton({
    Name = "Click Me",
    Callback = function()
        print("Button clicked!")
        game.Players.LocalPlayer.Character.HumanoidRootPart.CFrame = CFrame.new(0, 100, 0)
    end,
})

local Toggle = Tab:CreateToggle({
    Name = "Enable Feature",
    CurrentValue = false,
    Flag = "FeatureToggle",
    Callback = function(Value)
        print("Toggle:", Value)
    end,
})

local Slider = Tab:CreateSlider({
    Name = "Walk Speed",
    Range = {0, 100},
    Increment = 1,
    CurrentValue = 16,
    Flag = "WalkSpeed",
    Callback = function(Value)
        game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = Value
    end,
})

local Input = Tab:CreateInput({
    Name = "Player Name",
    PlaceholderText = "Enter name...",
    RemoveTextAfterFocusLost = false,
    Callback = function(Text)
        print("Input:", Text)
    end,
})
`,
          },
          {
            id: "ui-manager",
            name: "UIManager.luau",
            type: "file",
            parentId: "starter-player",
            content: `-- UIManager.luau\nprint("UI Manager initialized")\n`,
          },
        ],
      },
      {
        id: "server-script",
        name: "ServerScriptService",
        type: "folder",
        parentId: "root",
        isOpen: false,
        children: [
          {
            id: "game-manager",
            name: "GameManager.luau",
            type: "file",
            parentId: "server-script",
            content: `-- GameManager.luau\nprint("Game Manager initialized")\n`,
          },
          {
            id: "data-store",
            name: "DataStore.luau",
            type: "file",
            parentId: "server-script",
            content: `-- DataStore.luau\nlocal DataStoreService = game:GetService("DataStoreService")\n`,
          },
        ],
      },
      {
        id: "replicated-storage",
        name: "ReplicatedStorage",
        type: "folder",
        parentId: "root",
        isOpen: false,
        children: [
          {
            id: "shared-lib",
            name: "SharedLib.luau",
            type: "file",
            parentId: "replicated-storage",
            content: `-- SharedLib.luau\nlocal module = {}\n\nfunction module.doSomething()\n  print("Did something!")\nend\n\nreturn module\n`,
          },
        ],
      },
    ],
  },
];

export function findFile(
  nodes: FileNode[],
  id: string,
): FileNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findFile(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}
