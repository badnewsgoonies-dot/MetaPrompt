import { describe, it, expect } from 'vitest';
import { circleCollision, circleInRectangle, clampToRectangle } from '../src/utils/collision';

describe('Collision Utilities', () => {
  it('should detect circle collision', () => {
    const pos1 = { x: 100, y: 100 };
    const pos2 = { x: 110, y: 100 };

    expect(circleCollision(pos1, 10, pos2, 10)).toBe(true);
    expect(circleCollision(pos1, 5, pos2, 5)).toBe(false);
  });

  it('should check if circle is in rectangle', () => {
    const pos = { x: 100, y: 100 };
    const rect = { x: 50, y: 50, width: 100, height: 100 };

    expect(circleInRectangle(pos, 10, rect)).toBe(true);

    const outsidePos = { x: 200, y: 100 };
    expect(circleInRectangle(outsidePos, 10, rect)).toBe(false);
  });

  it('should clamp position to rectangle', () => {
    const rect = { x: 0, y: 0, width: 100, height: 100 };

    const outsidePos = { x: 150, y: 150 };
    const clamped = clampToRectangle(outsidePos, 10, rect);

    expect(clamped.x).toBeLessThanOrEqual(90);
    expect(clamped.y).toBeLessThanOrEqual(90);
  });
});
