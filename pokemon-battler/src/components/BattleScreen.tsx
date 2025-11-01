import React, { useState } from 'react';
import { createBattle, executeMove, nextTurn, BattleState } from '../systems/battle-state';
import { getPokemonSpecies } from '../data/pokemon-data';
import { PokemonStatus } from './PokemonStatus';
import { MoveButton } from './MoveButton';
import { BattleLog } from './BattleLog';
import './BattleScreen.css';

export const BattleScreen: React.FC = () => {
  const [battle, setBattle] = useState<BattleState>(() => {
    const charizard = getPokemonSpecies('charizard');
    const blastoise = getPokemonSpecies('blastoise');
    if (!charizard || !blastoise) {
      throw new Error('Pokemon species not found');
    }
    return createBattle(charizard, blastoise, Date.now());
  });

  const [message, setMessage] = useState<string>('');

  const handleMoveClick = (moveIndex: number) => {
    if (battle.winner) return;

    // Player move
    const playerResult = executeMove(battle, 'player', moveIndex);
    if (!playerResult.ok) {
      setMessage(playerResult.error);
      return;
    }

    let newBattle = playerResult.value;

    // Check if battle ended
    if (newBattle.winner) {
      setBattle(newBattle);
      return;
    }

    // Opponent move (random)
    setTimeout(() => {
      const availableMoves = newBattle.opponent.moves
        .map((slot, i) => ({ index: i, pp: slot.currentPP }))
        .filter(m => m.pp > 0);

      if (availableMoves.length === 0) {
        setMessage('Opponent has no moves left!');
        return;
      }

      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      const opponentResult = executeMove(newBattle, 'opponent', randomMove.index);

      if (opponentResult.ok) {
        newBattle = nextTurn(opponentResult.value);
        setBattle(newBattle);
      }
    }, 1000);

    setBattle(newBattle);
    setMessage('');
  };

  const handleReset = () => {
    const charizard = getPokemonSpecies('charizard');
    const blastoise = getPokemonSpecies('blastoise');
    if (!charizard || !blastoise) {
      throw new Error('Pokemon species not found');
    }
    setBattle(createBattle(charizard, blastoise, Date.now()));
    setMessage('');
  };

  return (
    <div className="battle-container">
      {/* Opponent Pokemon Status */}
      <PokemonStatus
        pokemon={battle.opponent}
        position="opponent"
        label="Opponent"
      />

      {/* Battle Arena */}
      <div className="battle-arena">
        <div className="arena-ground"></div>
      </div>

      {/* Player Pokemon Status */}
      <PokemonStatus
        pokemon={battle.player}
        position="player"
        label="Player"
      />

      {/* Battle Log */}
      <BattleLog entries={battle.log} />

      {/* Error Message */}
      {message && (
        <div className="error-message" role="alert">
          {message}
        </div>
      )}

      {/* Move Selection or Winner Display */}
      {battle.winner ? (
        <div className="winner-display">
          <h2>{battle.winner === 'player' ? 'You Win!' : 'You Lose!'}</h2>
          <button onClick={handleReset} className="reset-button">
            New Battle
          </button>
        </div>
      ) : (
        <div className="move-selection-panel" role="group" aria-label="Move selection">
          {battle.player.moves.map((moveSlot, index) => (
            <MoveButton
              key={index}
              move={moveSlot.move}
              currentPP={moveSlot.currentPP}
              onClick={() => handleMoveClick(index)}
              disabled={moveSlot.currentPP === 0 || battle.winner !== null}
            />
          ))}
        </div>
      )}

      {/* Turn Counter */}
      <div className="turn-counter" aria-live="polite">
        Turn: {battle.turn}
      </div>
    </div>
  );
};
