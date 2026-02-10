import { wezterm } from "./wezterm.js";

type Args = Record<string, unknown>;

const DIRECTIONS = new Set(["Up", "Down", "Left", "Right", "Next", "Prev"]);
const SPLIT_DIRECTIONS = new Set(["left", "right", "top", "bottom"]);
const ZOOM_MODES = new Set(["zoom", "unzoom", "toggle"]);

function validateEnum(value: unknown, allowed: Set<string>, label: string): string {
  const s = String(value);
  if (!allowed.has(s)) throw new Error(`Invalid ${label}: ${s}`);
  return s;
}

function paneArgs(args: Args): string[] {
  return args.pane_id != null ? ["--pane-id", String(args.pane_id)] : [];
}

function textResult(text: string, trim = true) {
  return { content: [{ type: "text" as const, text: trim ? text.trim() : text }] };
}

export async function handleTool(name: string, args: Args) {
  switch (name) {
    // ── Query ──────────────────────────────────────────
    case "list_panes":
      return textResult(await wezterm("list", "--format", "json"));

    case "list_clients":
      return textResult(await wezterm("list-clients", "--format", "json"));

    case "get_text": {
      const a: string[] = [...paneArgs(args)];
      if (args.start_line != null) a.push("--start-line", String(args.start_line));
      if (args.end_line != null) a.push("--end-line", String(args.end_line));
      if (args.escapes) a.push("--escapes");
      return textResult(await wezterm("get-text", ...a), false);
    }

    case "get_pane_direction": {
      const dir = validateEnum(args.direction, DIRECTIONS, "direction");
      const a = [...paneArgs(args), dir];
      return textResult(await wezterm("get-pane-direction", ...a));
    }

    // ── Pane management ──────────────────────────────────
    case "split_pane": {
      const a: string[] = [...paneArgs(args)];
      if (args.direction != null) {
        const dir = validateEnum(args.direction, SPLIT_DIRECTIONS, "direction");
        a.push(`--${dir}`);
      }
      if (args.top_level) a.push("--top-level");
      if (args.cells != null) a.push("--cells", String(args.cells));
      if (args.percent != null) a.push("--percent", String(args.percent));
      if (args.cwd) a.push("--cwd", String(args.cwd));
      if (args.move_pane_id != null)
        a.push("--move-pane-id", String(args.move_pane_id));
      if (Array.isArray(args.program) && args.program.length)
        a.push("--", ...(args.program as string[]));
      return textResult(await wezterm("split-pane", ...a));
    }

    case "spawn": {
      const a: string[] = [...paneArgs(args)];
      if (args.domain_name) a.push("--domain-name", String(args.domain_name));
      if (args.window_id != null) a.push("--window-id", String(args.window_id));
      if (args.new_window) a.push("--new-window");
      if (args.cwd) a.push("--cwd", String(args.cwd));
      if (args.workspace) a.push("--workspace", String(args.workspace));
      if (Array.isArray(args.program) && args.program.length)
        a.push("--", ...(args.program as string[]));
      return textResult(await wezterm("spawn", ...a));
    }

    case "send_text": {
      const a: string[] = [...paneArgs(args)];
      if (args.no_paste) a.push("--no-paste");
      a.push("--", String(args.text));
      return textResult(await wezterm("send-text", ...a));
    }

    case "activate_pane":
      return textResult(
        await wezterm("activate-pane", ...paneArgs(args))
      );

    case "activate_pane_direction": {
      const dir = validateEnum(args.direction, DIRECTIONS, "direction");
      const a = [...paneArgs(args), dir];
      return textResult(await wezterm("activate-pane-direction", ...a));
    }

    case "kill_pane":
      return textResult(await wezterm("kill-pane", ...paneArgs(args)));

    case "adjust_pane_size": {
      const dir = validateEnum(args.direction, DIRECTIONS, "direction");
      const a: string[] = [...paneArgs(args)];
      if (args.amount != null) a.push("--amount", String(args.amount));
      a.push(dir);
      return textResult(await wezterm("adjust-pane-size", ...a));
    }

    case "zoom_pane": {
      const a: string[] = [...paneArgs(args)];
      const mode = validateEnum(args.mode ?? "toggle", ZOOM_MODES, "mode");
      a.push(`--${mode}`);
      return textResult(await wezterm("zoom-pane", ...a));
    }

    case "move_pane_to_new_tab": {
      const a: string[] = [...paneArgs(args)];
      if (args.window_id != null) a.push("--window-id", String(args.window_id));
      if (args.new_window) a.push("--new-window");
      if (args.workspace) a.push("--workspace", String(args.workspace));
      return textResult(await wezterm("move-pane-to-new-tab", ...a));
    }

    // ── Tab management ───────────────────────────────────
    case "activate_tab": {
      const a: string[] = [...paneArgs(args)];
      if (args.tab_id != null) a.push("--tab-id", String(args.tab_id));
      if (args.tab_index != null) a.push("--tab-index", String(args.tab_index));
      if (args.tab_relative != null)
        a.push("--tab-relative", String(args.tab_relative));
      if (args.no_wrap) a.push("--no-wrap");
      return textResult(await wezterm("activate-tab", ...a));
    }

    case "set_tab_title": {
      const a: string[] = [...paneArgs(args)];
      if (args.tab_id != null) a.push("--tab-id", String(args.tab_id));
      a.push(String(args.title));
      return textResult(await wezterm("set-tab-title", ...a));
    }

    // ── Window / workspace ───────────────────────────────
    case "set_window_title": {
      const a: string[] = [...paneArgs(args)];
      if (args.window_id != null) a.push("--window-id", String(args.window_id));
      a.push(String(args.title));
      return textResult(await wezterm("set-window-title", ...a));
    }

    case "rename_workspace": {
      const a: string[] = [...paneArgs(args)];
      if (args.workspace) a.push("--workspace", String(args.workspace));
      a.push(String(args.new_workspace));
      return textResult(await wezterm("rename-workspace", ...a));
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
