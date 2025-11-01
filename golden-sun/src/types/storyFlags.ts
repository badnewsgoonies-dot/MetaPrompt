/**
 * Story Flag System Types
 * Tracks player progress through boolean and numeric flags
 */

export type FlagValue = boolean | number | string;

export interface FlagHistoryEntry {
  key: string;
  value: FlagValue;
  timestamp: number;
}

export interface FlagSystem {
  flags: Record<string, FlagValue>;
  history: FlagHistoryEntry[];
}

export interface SerializedFlags {
  flags: Record<string, FlagValue>;
  lastSaved: number;
}
