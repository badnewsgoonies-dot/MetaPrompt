import React from 'react';
import { Move } from '../types/pokemon';

interface MoveButtonProps {
  move: Move;
  currentPP: number;
  onClick: () => void;
  disabled: boolean;
}

export const MoveButton: React.FC<MoveButtonProps> = ({
  move,
  currentPP,
  onClick,
  disabled,
}) => {
  const typeClass = `type-${move.type.toLowerCase()}`;

  return (
    <button
      className="move-button"
      onClick={onClick}
      disabled={disabled || currentPP === 0}
      aria-label={`${move.name}, ${move.type} type, Power ${move.power}, PP ${currentPP}/${move.maxPP}`}
    >
      <div className="move-name">{move.name}</div>
      <div className="move-info">
        <span className={`move-type ${typeClass}`}>{move.type}</span>
        <span className={`move-pp ${currentPP === 0 ? 'move-pp-zero' : ''}`}>
          PP: {currentPP}/{move.maxPP}
        </span>
      </div>
    </button>
  );
};
