import { createBoards, playerAttack } from "./interface";
import { Player } from "./player";

export const game = () => {
  const player = new Player("player");
  const ai = new Player("ai");

  // change placement later
  player.gameboard.placeShip(2, [9, 8], [8, 8]);
  player.gameboard.placeShip(3, [1, 8], [3, 8]);
  player.gameboard.placeShip(3, [6, 1], [6, 3]);
  player.gameboard.placeShip(4, [1, 1], [1, 4]);
  player.gameboard.placeShip(5, [4, 6], [8, 6]);
  ai.gameboard.placeShip(2, [7, 7], [7, 8]);
  ai.gameboard.placeShip(3, [2, 1], [2, 3]);
  ai.gameboard.placeShip(3, [4, 4], [6, 4]);
  ai.gameboard.placeShip(4, [1, 7], [4, 7]);
  ai.gameboard.placeShip(5, [8, 1], [8, 5]);

  createBoards(player.gameboard.board, ai.gameboard.board);

  // !TODO create handleModal func in interface.js
  const modal = document.querySelector(".modal");
  modal.style.display = "none";
  playRound(player, ai);
};

export const playRound = (player, ai) => {
  if (player.gameboard.isGameOver()) endGame(ai);
  if (ai.gameboard.isGameOver()) endGame(player);
  if (player.isTurn) {
    const aiBoard = document.querySelector(".ai-board");
    aiBoard.param = { player, ai };
    aiBoard.addEventListener("click", playerAttack);
  } else {
    ai.makeMove(player);
  }
};

const endGame = winner => {
  // !TODO create handleModal func in interface.js
  const modal = document.querySelector(".modal");
  modal.style.display = "block";
  const guide = document.querySelector(".guide");
  guide.textContent = `${winner.name} won!`;
};
