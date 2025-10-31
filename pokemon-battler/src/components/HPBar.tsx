import React from 'react';

interface HPBarProps {
  currentHP: number;
  maxHP: number;
  percentage: number;
}

export const HPBar: React.FC<HPBarProps> = ({ currentHP, maxHP, percentage }) => {
  // Determine HP bar color based on percentage
  const getHPColorClass = (): string => {
    if (percentage > 50) return 'hp-bar-green';
    if (percentage > 25) return 'hp-bar-yellow';
    return 'hp-bar-red';
  };

  return (
    <div className="hp-bar-container" role="progressbar" aria-valuenow={currentHP} aria-valuemin={0} aria-valuemax={maxHP}>
      <div
        className={`hp-bar ${getHPColorClass()}`}
        style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        aria-hidden="true"
      />
    </div>
  );
};
