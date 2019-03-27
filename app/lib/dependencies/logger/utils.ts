import { TLogLevels } from "./ILogger";

export const isLevelAllowed = (loglevel: TLogLevels) => {
  if (!process.env.NF_LOG_LEVEL) {
    return true;
  }

  const priority: TLogLevels[] = ["fatal", "error", "warn", "debug", "verbose", "info"];

  const allowedLogLevel = process.env.NF_LOG_LEVEL as TLogLevels;

  const allowedLogLevelIndex = priority.indexOf(allowedLogLevel);
  const currentLogLevelIndex = priority.indexOf(loglevel);

  return currentLogLevelIndex <= allowedLogLevelIndex;
};
