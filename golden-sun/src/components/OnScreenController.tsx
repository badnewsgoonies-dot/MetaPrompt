/**
 * On-Screen Controller Component
 * Touch-friendly controls for mobile/iPad gameplay
 */

import React, { useCallback } from 'react';
import './OnScreenController.css';

interface OnScreenControllerProps {
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
}

export const OnScreenController: React.FC<OnScreenControllerProps> = ({
  onKeyDown,
  onKeyUp
}) => {
  const handleTouchStart = useCallback((key: string) => (e: React.TouchEvent) => {
    e.preventDefault();
    console.log(`[Touch] Button pressed: ${key}`);
    onKeyDown(key);
  }, [onKeyDown]);

  const handleTouchEnd = useCallback((key: string) => (e: React.TouchEvent) => {
    e.preventDefault();
    console.log(`[Touch] Button released: ${key}`);
    onKeyUp(key);
  }, [onKeyUp]);

  const handleMouseDown = useCallback((key: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`[Mouse] Button pressed: ${key}`);
    onKeyDown(key);
  }, [onKeyDown]);

  const handleMouseUp = useCallback((key: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`[Mouse] Button released: ${key}`);
    onKeyUp(key);
  }, [onKeyUp]);

  return (
    <div className="on-screen-controller">
      {/* D-Pad (Left Side) */}
      <div className="controller-section dpad-section">
        <div className="dpad">
          {/* Up */}
          <button
            className="dpad-button dpad-up"
            onTouchStart={handleTouchStart('ArrowUp')}
            onTouchEnd={handleTouchEnd('ArrowUp')}
            onMouseDown={handleMouseDown('ArrowUp')}
            onMouseUp={handleMouseUp('ArrowUp')}
            onMouseLeave={handleMouseUp('ArrowUp')}
            aria-label="Up"
          >
            <span className="arrow">▲</span>
          </button>
          
          {/* Down */}
          <button
            className="dpad-button dpad-down"
            onTouchStart={handleTouchStart('ArrowDown')}
            onTouchEnd={handleTouchEnd('ArrowDown')}
            onMouseDown={handleMouseDown('ArrowDown')}
            onMouseUp={handleMouseUp('ArrowDown')}
            onMouseLeave={handleMouseUp('ArrowDown')}
            aria-label="Down"
          >
            <span className="arrow">▼</span>
          </button>
          
          {/* Left */}
          <button
            className="dpad-button dpad-left"
            onTouchStart={handleTouchStart('ArrowLeft')}
            onTouchEnd={handleTouchEnd('ArrowLeft')}
            onMouseDown={handleMouseDown('ArrowLeft')}
            onMouseUp={handleMouseUp('ArrowLeft')}
            onMouseLeave={handleMouseUp('ArrowLeft')}
            aria-label="Left"
          >
            <span className="arrow">◀</span>
          </button>
          
          {/* Right */}
          <button
            className="dpad-button dpad-right"
            onTouchStart={handleTouchStart('ArrowRight')}
            onTouchEnd={handleTouchEnd('ArrowRight')}
            onMouseDown={handleMouseDown('ArrowRight')}
            onMouseUp={handleMouseUp('ArrowRight')}
            onMouseLeave={handleMouseUp('ArrowRight')}
            aria-label="Right"
          >
            <span className="arrow">▶</span>
          </button>
          
          {/* Center */}
          <div className="dpad-center" />
        </div>
        <div className="controller-label">D-PAD</div>
      </div>

      {/* Action Buttons (Right Side) */}
      <div className="controller-section buttons-section">
        <div className="action-buttons">
          {/* Y Button (Top) */}
          <button
            className="action-button button-y"
            onTouchStart={handleTouchStart('y')}
            onTouchEnd={handleTouchEnd('y')}
            onMouseDown={handleMouseDown('y')}
            onMouseUp={handleMouseUp('y')}
            onMouseLeave={handleMouseUp('y')}
            aria-label="Y Button"
          >
            <span className="button-label">Y</span>
          </button>
          
          {/* X Button (Left) */}
          <button
            className="action-button button-x"
            onTouchStart={handleTouchStart('x')}
            onTouchEnd={handleTouchEnd('x')}
            onMouseDown={handleMouseDown('x')}
            onMouseUp={handleMouseUp('x')}
            onMouseLeave={handleMouseUp('x')}
            aria-label="X Button"
          >
            <span className="button-label">X</span>
          </button>
          
          {/* B Button (Right) - Cancel/Back */}
          <button
            className="action-button button-b"
            onTouchStart={handleTouchStart('Escape')}
            onTouchEnd={handleTouchEnd('Escape')}
            onMouseDown={handleMouseDown('Escape')}
            onMouseUp={handleMouseUp('Escape')}
            onMouseLeave={handleMouseUp('Escape')}
            aria-label="B Button (Cancel/Back)"
          >
            <span className="button-label">B</span>
          </button>
          
          {/* A Button (Bottom) - Primary action */}
          <button
            className="action-button button-a"
            onTouchStart={handleTouchStart('a')}
            onTouchEnd={handleTouchEnd('a')}
            onMouseDown={handleMouseDown('a')}
            onMouseUp={handleMouseUp('a')}
            onMouseLeave={handleMouseUp('a')}
            aria-label="A Button (Talk/Interact)"
          >
            <span className="button-label">A</span>
          </button>
        </div>
        <div className="controller-label">ACTIONS</div>
      </div>

      {/* Center Buttons (Start/Select) */}
      <div className="controller-section center-section">
        <div className="center-buttons">
          <button
            className="center-button select-button"
            onTouchStart={handleTouchStart('Shift')}
            onTouchEnd={handleTouchEnd('Shift')}
            onMouseDown={handleMouseDown('Shift')}
            onMouseUp={handleMouseUp('Shift')}
            onMouseLeave={handleMouseUp('Shift')}
            aria-label="Select"
          >
            <span className="button-label">SELECT</span>
          </button>
          
          <button
            className="center-button start-button"
            onTouchStart={handleTouchStart('Enter')}
            onTouchEnd={handleTouchEnd('Enter')}
            onMouseDown={handleMouseDown('Enter')}
            onMouseUp={handleMouseUp('Enter')}
            onMouseLeave={handleMouseUp('Enter')}
            aria-label="Start"
          >
            <span className="button-label">START</span>
          </button>
        </div>
      </div>
    </div>
  );
};
