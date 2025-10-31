import React from 'react';
import ReactDOM from 'react-dom/client';
import { BattleScreen } from './components/BattleScreen';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BattleScreen />
  </React.StrictMode>
);
