import { normalizeProfileName } from "./profile-utils.js";
import { replaceCliName, resolveCliName } from "./cli-name.js";
import { theme } from "../terminal/theme.js";

const CLI_PREFIX_RE = /^(?:pnpm|npm|bunx|npx)\s+openclaw\b|^openclaw\b/;
const PROFILE_FLAG_RE = /(?:^|\s)--profile(?:\s|=|$)/;
const DEV_FLAG_RE = /(?:^|\s)--dev(?:\s|$)/;

export function formatCliCommand(
  command: string,
  env: Record<string, string | undefined> = process.env as Record<string, string | undefined>,
): string {
  const cliName = resolveCliName();
  const normalizedCommand = replaceCliName(command, cliName);
  const profile = normalizeProfileName(env.OPENCLAW_PROFILE);

  let result = normalizedCommand;
  if (
    profile &&
    CLI_PREFIX_RE.test(normalizedCommand) &&
    !PROFILE_FLAG_RE.test(normalizedCommand) &&
    !DEV_FLAG_RE.test(normalizedCommand)
  ) {
    result = normalizedCommand.replace(CLI_PREFIX_RE, (match) => `${match} --profile ${profile}`);
  }

  return theme.command(result);
}
