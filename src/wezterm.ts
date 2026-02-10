import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function wezterm(...args: string[]): Promise<string> {
  const { stdout } = await execFileAsync("wezterm", ["cli", ...args]);
  return stdout;
}
