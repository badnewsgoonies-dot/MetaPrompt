import { initializeGame } from './src/systems/gameEngine';
import { getCurrentRoom } from './src/systems/roomSystem';

const result = initializeGame(12345);

if (result.ok) {
  const state = result.value;
  console.log('=== GAME INITIALIZATION ===');
  console.log('Total rooms:', state.dungeon.rooms.length);
  console.log('Current room ID:', state.currentRoomId);

  const currentRoomResult = getCurrentRoom(state.dungeon, state.currentRoomId);
  if (currentRoomResult.ok) {
    const room = currentRoomResult.value;
    console.log('\n=== START ROOM ===');
    console.log('Type:', room.type);
    console.log('Position:', `(${room.gridX}, ${room.gridY})`);
    console.log('Doors:', room.doors.length);
    room.doors.forEach(door => {
      console.log(`  - ${door.direction} (locked: ${door.locked})`);
    });
  }

  console.log('\n=== PLAYER STATE ===');
  console.log('Position:', state.player.position);
  console.log('Health:', state.player.stats.currentHealth, '/', state.player.stats.maxHealth);
  console.log('Resources:');
  console.log('  Keys:', state.player.resources.keys);
  console.log('  Bombs:', state.player.resources.bombs);
  console.log('  Coins:', state.player.resources.coins);

  console.log('\n=== ROOM CONTENTS ===');
  console.log('Enemies:', state.enemies.length);
  console.log('Items:', state.items.length);
  console.log('Pickups:', state.pickups.length);
  console.log('Obstacles:', state.obstacles.length);

  console.log('\n=== ALL ROOMS ===');
  state.dungeon.rooms.forEach(room => {
    console.log(`${room.id}: ${room.type} at (${room.gridX},${room.gridY}) - ${room.doors.length} doors`);
  });
}
