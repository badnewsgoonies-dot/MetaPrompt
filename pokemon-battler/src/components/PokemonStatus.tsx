import React from 'react';
import { PokemonInstance } from '../types/pokemon';
import { HPBar } from './HPBar';

interface PokemonStatusProps {
  pokemon: PokemonInstance;
  position: 'player' | 'opponent';
  label: string;
}

export const PokemonStatus: React.FC<PokemonStatusProps> = ({
  pokemon,
  position,
  label,
}) => {
  const hpPercentage = (pokemon.currentHP / pokemon.species.baseHP) * 100;

  return (
    <div className={`pokemon-status ${position}-status`}>
      {position === 'player' && (
        <div className="pokemon-sprite-container">
          <div
            className="pokemon-sprite player-sprite"
            aria-label={`${label}: ${pokemon.species.name}`}
          >
            <div className="sprite-placeholder">{getSpriteEmoji(pokemon.species.id, 'back')}</div>
          </div>
        </div>
      )}

      <div className="status-panel">
        <div className="pokemon-name-level">
          {pokemon.species.name.toUpperCase()} Lv.50
        </div>
        <HPBar
          currentHP={pokemon.currentHP}
          maxHP={pokemon.species.baseHP}
          percentage={hpPercentage}
        />
        <div className="hp-text">
          {pokemon.currentHP}/{pokemon.species.baseHP}
        </div>
      </div>

      {position === 'opponent' && (
        <div className="pokemon-sprite-container">
          <div
            className="pokemon-sprite opponent-sprite"
            aria-label={`${label}: ${pokemon.species.name}`}
          >
            <div className="sprite-placeholder">{getSpriteEmoji(pokemon.species.id, 'front')}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get emoji sprites (placeholder until real sprites added)
function getSpriteEmoji(pokemonId: string, view: 'front' | 'back'): string {
  const sprites: Record<string, { front: string; back: string }> = {
    charizard: { front: '🔥', back: '🔥' },
    blastoise: { front: '🐢', back: '🐢' },
    venusaur: { front: '🌿', back: '🌿' },
    pikachu: { front: '⚡', back: '⚡' },
  };

  return sprites[pokemonId]?.[view] || '❓';
}
