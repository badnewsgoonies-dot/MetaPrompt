/**
 * Dialogue Box Component for Golden Sun Vale Village
 * Displays NPC dialogue with portrait, text reveal animation, and choices
 */

import React from 'react';
import { ActiveDialogue } from '../types/dialogue';
import { getVisibleText, getCurrentLine } from '../systems/dialogueSystem';
import './DialogueBox.css';

interface DialogueBoxProps {
  dialogue: ActiveDialogue;
  onSelectChoice: (choiceIndex: number) => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialogue,
  onSelectChoice
}) => {
  const currentLine = getCurrentLine(dialogue);
  const visibleText = getVisibleText(dialogue);

  if (!currentLine) return null;

  const hasChoices = currentLine.choices && currentLine.choices.length > 0;
  const showContinueIndicator = dialogue.isTextComplete && !hasChoices;

  return (
    <div className="dialogue-box" role="region" aria-live="polite" aria-atomic="true">
      {/* Portrait */}
      {currentLine.speaker.portrait && (
        <div className="dialogue-portrait">
          <img 
            src={currentLine.speaker.portrait} 
            alt={`${currentLine.speaker.name} portrait`}
            className="portrait-image"
          />
        </div>
      )}

      {/* Text Content */}
      <div className="dialogue-content">
        {/* Speaker Name */}
        <div className="dialogue-speaker">{currentLine.speaker.name}</div>

        {/* Dialogue Text */}
        <div className="dialogue-text">
          {visibleText}
          {showContinueIndicator && (
            <span className="continue-indicator" aria-hidden="true">▼</span>
          )}
        </div>

        {/* Choices (if present) */}
        {hasChoices && dialogue.isTextComplete && (
          <div className="dialogue-choices" role="menu">
            {currentLine.choices!.map((choice, index) => (
              <button
                key={choice.id}
                className={`dialogue-choice ${index === dialogue.selectedChoice ? 'selected' : ''}`}
                onClick={() => onSelectChoice(index)}
                role="menuitem"
                aria-selected={index === dialogue.selectedChoice}
              >
                {index === dialogue.selectedChoice && '▶ '}
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
