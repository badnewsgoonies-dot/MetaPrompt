import React, { useEffect, useRef } from 'react';
import { BattleLogEntry } from '../systems/battle-state';

interface BattleLogProps {
  entries: readonly BattleLogEntry[];
}

export const BattleLog: React.FC<BattleLogProps> = ({ entries }) => {
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries added
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [entries]);

  // Show last 10 entries
  const recentEntries = entries.slice(-10);

  return (
    <div
      ref={logRef}
      className="battle-log"
      role="log"
      aria-live="polite"
      aria-atomic="false"
    >
      {recentEntries.map((entry, index) => (
        <div key={`${entry.turn}-${index}`} className="log-entry">
          {entry.message}
        </div>
      ))}
    </div>
  );
};
