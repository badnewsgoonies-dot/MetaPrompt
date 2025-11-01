/**
 * Dialogue Box Component for Golden Sun Vale Village
 * Displays NPC dialogue with portrait, text reveal animation, and choices
 */

import React from 'react';
import { DialogueState } from '../types/dialogue';
import { getCurrentLine } from '../systems/dialogueSystem';
import './DialogueBox.css';

interface DialogueBoxProps {
  dialogue: DialogueState;
  onSelectChoice: (choiceIndex: number) => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialogue,
  onSelectChoice
}) => {
  const lineResult = getCurrentLine(dialogue);
  
  if (!lineResult.ok) return null;
  
  const currentLine = lineResult.value;
  const visibleText = currentLine.text; // Simplified for now

  const hasChoices = currentLine.choices && currentLine.choices.length > 0;
  const showContinueIndicator = !hasChoices;

  return (
    <div className="dialogue-box" role="region" aria-live="polite" aria-atomic="true">
      {/* Text Content */}
      <div className="dialogue-content">
        {/* Speaker Name */}
        <div className="dialogue-speaker">{currentLine.speaker}</div>

        {/* Dialogue Text */}
        <div className="dialogue-text">
          {visibleText}
          {showContinueIndicator && (
            <span className="continue-indicator" aria-hidden="true">▼</span>
          )}
        </div>

        {/* Choices (if present) */}
        {hasChoices && (
          <div className="dialogue-choices" role="menu">
            {currentLine.choices!.map((choice: any, index: number) => (
              <button
                key={index}
                className={`dialogue-choice`}
                onClick={() => onSelectChoice(index)}
                role="menuitem"
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}

        {/* Controls hint */}
        <div className="dialogue-controls" aria-label="Controls">
          {!hasChoices && (
            <span className="control-hint">
              {dialogue.isTextComplete ? 'Press Enter to continue' : 'Press Enter to skip'}
            </span>
          )}
          {hasChoices && dialogue.isTextComplete && (
            <span className="control-hint">
              Arrow keys to select, Enter to confirm
            </span>
          )}
          <span className="control-hint">Press Esc to close</span>
        </div>
      </div>
    </div>
  );
};
