import type { Tool } from "@modelcontextprotocol/sdk/types.js";

const PaneId = {
  pane_id: {
    type: "number",
    description:
      "Target pane ID. Defaults to the current pane (WEZTERM_PANE).",
  },
} as const;

const Direction = {
  direction: {
    type: "string",
    enum: ["Up", "Down", "Left", "Right", "Next", "Prev"],
    description: "Direction.",
  },
} as const;

export const tools: Tool[] = [
  // ── Query ──────────────────────────────────────────────
  {
    name: "list_panes",
    description: "List all WezTerm windows, tabs and panes (JSON).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_clients",
    description: "List connected WezTerm clients (JSON).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_text",
    description:
      "Retrieve textual content of a pane's terminal screen/scrollback.",
    inputSchema: {
      type: "object",
      properties: {
        ...PaneId,
        start_line: {
          type: "number",
          description:
            "Starting line. 0 = first screen line, negative = scrollback.",
        },
        end_line: {
          type: "number",
          description:
            "Ending line. 0 = first screen line, negative = scrollback.",
        },
        escapes: {
          type: "boolean",
          description: "Include color/style escape sequences.",
        },
      },
    },
  },
  {
    name: "get_pane_direction",
    description:
      "Get the pane ID of the adjacent pane in the given direction.",
    inputSchema: {
      type: "object",
      properties: { ...PaneId, ...Direction },
      required: ["direction"],
    },
  },

  // ── Pane management ────────────────────────────────────
  {
    name: "split_pane",
    description:
      "Split a pane. Returns the new pane ID.",
    inputSchema: {
      type: "object",
      properties: {
        ...PaneId,
        direction: {
          type: "string",
          enum: ["left", "right", "top", "bottom"],
          description:
            "Where to place the new pane relative to the target. Default: bottom.",
        },
        top_level: {
          type: "boolean",
          description: "Split the entire window instead of the active pane.",
        },
        cells: {
          type: "number",
          description: "Number of cells for the new split.",
        },
        percent: {
          type: "number",
          description: "Percentage of available space for the new split.",
        },
        cwd: {
          type: "string",
          description: "Working directory for the spawned program.",
        },
        move_pane_id: {
          type: "number",
          description:
            "Instead of spawning a new command, move this pane into the split.",
        },
        program: {
          type: "array",
          items: { type: "string" },
          description: "Command and args to run instead of the default shell.",
        },
      },
    },
  },
  {
    name: "spawn",
    description:
      "Spawn a command in a new window or tab. Returns the new pane ID.",
    inputSchema: {
      type: "object",
      properties: {
        ...PaneId,
        domain_name: { type: "string", description: "Domain name." },
        window_id: {
          type: "number",
          description: "Window to spawn into. Omit for current window.",
        },
        new_window: {
          type: "boolean",
          description: "Spawn into a new window instead of a new tab.",
        },
        cwd: {
          type: "string",
          description: "Working directory for the spawned program.",
        },
        workspace: {
          type: "string",
          description:
            'Workspace name for the new window. Requires new_window. Default: "default".',
        },
        program: {
          type: "array",
          items: { type: "string" },
          description: "Command and args to run instead of the default shell.",
        },
      },
    },
  },
  {
    name: "send_text",
    description:
      "Send text to a pane as though it were pasted (bracketed paste).",
    inputSchema: {
      type: "object",
      properties: {
        ...PaneId,
        text: { type: "string", description: "Text to send." },
        no_paste: {
          type: "boolean",
          description: "Send directly instead of bracketed paste.",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "activate_pane",
    description: "Activate (focus) a specific pane.",
    inputSchema: {
      type: "object",
      properties: { ...PaneId },
      required: ["pane_id"],
    },
  },
  {
    name: "activate_pane_direction",
    description: "Activate the adjacent pane in the given direction.",
    inputSchema: {
      type: "object",
      properties: { ...PaneId, ...Direction },
      required: ["direction"],
    },
  },
  {
    name: "kill_pane",
    description: "Kill a pane.",
    inputSchema: {
      type: "object",
      properties: { ...PaneId },
      required: ["pane_id"],
    },
  },
  {
    name: "adjust_pane_size",
    description: "Resize a pane in the given direction.",
    inputSchema: {
      type: "object",
      properties: {
        ...PaneId,
        ...Direction,
        amount: {
          type: "number",
          description: "Number of cells to resize by. Default: 1.",
        },
      },
      required: ["direction"],
    },
  },
  {
    name: "zoom_pane",
    description: "Zoom, unzoom, or toggle zoom on a pane.",
    inputSchema: {
      type: "object",
      properties: {
        ...PaneId,
        mode: {
          type: "string",
          enum: ["zoom", "unzoom", "toggle"],
          description: 'Zoom mode. Default: "toggle".',
        },
      },
    },
  },
  {
    name: "move_pane_to_new_tab",
    description: "Move a pane into a new tab.",
    inputSchema: {
      type: "object",
      properties: {
        ...PaneId,
        window_id: {
          type: "number",
          description: "Target window. Omit for current window.",
        },
        new_window: {
          type: "boolean",
          description: "Create the tab in a new window.",
        },
        workspace: {
          type: "string",
          description: "Workspace name if creating a new window.",
        },
      },
    },
  },

  // ── Tab management ─────────────────────────────────────
  {
    name: "activate_tab",
    description: "Activate a tab by id, index, or relative offset.",
    inputSchema: {
      type: "object",
      properties: {
        ...PaneId,
        tab_id: { type: "number", description: "Target tab ID." },
        tab_index: {
          type: "number",
          description:
            "Tab index (0-based). Negative values count from the right (-1 = last).",
        },
        tab_relative: {
          type: "number",
          description: "Relative offset. -1 = left, 1 = right, etc.",
        },
        no_wrap: {
          type: "boolean",
          description: "Prevent wrapping when using tab_relative.",
        },
      },
    },
  },
  {
    name: "set_tab_title",
    description: "Change the title of a tab.",
    inputSchema: {
      type: "object",
      properties: {
        ...PaneId,
        tab_id: { type: "number", description: "Target tab ID." },
        title: { type: "string", description: "New title." },
      },
      required: ["title"],
    },
  },

  // ── Window / workspace ─────────────────────────────────
  {
    name: "set_window_title",
    description: "Change the title of a window.",
    inputSchema: {
      type: "object",
      properties: {
        ...PaneId,
        window_id: { type: "number", description: "Target window ID." },
        title: { type: "string", description: "New title." },
      },
      required: ["title"],
    },
  },
  {
    name: "rename_workspace",
    description: "Rename a workspace.",
    inputSchema: {
      type: "object",
      properties: {
        ...PaneId,
        workspace: {
          type: "string",
          description: "Current workspace name to rename.",
        },
        new_workspace: {
          type: "string",
          description: "The new name for the workspace.",
        },
      },
      required: ["new_workspace"],
    },
  },
];
