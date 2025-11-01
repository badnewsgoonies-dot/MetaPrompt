import { Game } from "./game.js";

const canvas = document.getElementById("gameCanvas");
const hud = document.getElementById("hud-overlay");
const menu = document.getElementById("menu-overlay");
const menuContent = document.getElementById("menu-content");

const game = new Game(canvas, hud, menu, menuContent);

game.init();

window.harvestMoonGame = game; // expose for debugging
