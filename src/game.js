import { createBoards, handleModal, playerAttack } from "./interface";
import { Player } from "./player";

export const game = () => {
  const player = new Player("player");
  const ai = new Player("ai");

  // !TODO let player choose their own placement
  player.gameboard.randomPlacement();
  ai.gameboard.randomPlacement();

  createBoards(player.gameboard.board, ai.gameboard.board);
  handleModal();
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

export const endGame = winner => {
  handleModal();
  // !TODO think more appropriate win message for dom.
  const guide = document.querySelector(".guide");
  guide.textContent = `${winner.name} won!`;
};
