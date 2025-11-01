import { Game } from "./game.js";

const canvas = document.getElementById("gameCanvas");
const hud = document.getElementById("hud-overlay");
const menu = document.getElementById("menu-overlay");
const menuContent = document.getElementById("menu-content");
const menuDetail = document.getElementById("menu-detail");
const debugOverlay = document.getElementById("debug-overlay");

const game = new Game(canvas, hud, menu, menuContent, menuDetail, debugOverlay);

game.init();

window.harvestMoonGame = game; // expose for debugging
