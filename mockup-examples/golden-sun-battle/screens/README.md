# Golden Sun Battle Screens

Curated HTML mockups illustrating three major interaction states for the battle UI. Each page is self-contained and references existing sprite assets within the repository.

## Screens

- `command-menu.html` – Standard battle command layout with action buttons and combat log focus.
- `psynergy-menu.html` – Psynergy selection flow for Mia with contextual details, tags, and spell costs.
- `djinn-board.html` – Djinn management board showcasing set, standby, and recovery groupings alongside summon prep.

## Usage

Serve the repository root via a static server (for example: `python -m http.server 8000`) and open the HTML files in a browser to view or capture updated screenshots.

For a playable rendition that mirrors these mockups, run `npm run build` inside `golden-sun-battler/` and launch `../app/index.html` from this directory. The interactive demo wires the command grid, Psynergy catalog, and Djinn board to the live battle engine.
