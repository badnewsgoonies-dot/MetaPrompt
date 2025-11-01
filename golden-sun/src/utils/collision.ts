/**
 * Collision detection utilities
 */

import { Position, Rectangle } from '../types/common';

/**
 * Check if two circles collide (for entities with collision radius)
 */
export function circleCollision(
  pos1: Position,
  radius1: number,
  pos2: Position,
  radius2: number
): boolean {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < radius1 + radius2;
}

/**
 * Check if a circle is inside a rectangle
 */
export function circleInRectangle(
  pos: Position,
  radius: number,
  rect: Rectangle
): boolean {
  return (
    pos.x - radius >= rect.x &&
    pos.x + radius <= rect.x + rect.width &&
    pos.y - radius >= rect.y &&
    pos.y + radius <= rect.y + rect.height
  );
}

/**
 * Clamp a position to stay within a rectangle
 */
export function clampToRectangle(
  pos: Position,
  radius: number,
  rect: Rectangle
): Position {
  const x = Math.max(
    rect.x + radius,
    Math.min(pos.x, rect.x + rect.width - radius)
  );
  const y = Math.max(
    rect.y + radius,
    Math.min(pos.y, rect.y + rect.height - radius)
  );
  return { x, y };
}
