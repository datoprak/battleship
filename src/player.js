import { endGame } from "./game";
import { Gameboard } from "./gameboard";
import { aiAttack } from "./interface";

export class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new Gameboard();
    this.isTurn = name === "ai" ? false : true;
  }

  makeMove(opponent, coor = null) {
    if (coor) opponent.gameboard.receiveAttack(coor);
    else this.aiMove(opponent);
    this.isTurn = !this.isTurn;
    opponent.isTurn = !opponent.isTurn;
  }

  aiMove(opponent) {
    let randomX = Math.floor(Math.random() * 10);
    let randomY = Math.floor(Math.random() * 10);
    while (opponent.gameboard.board[randomX][randomY].hasAttacked) {
      randomX = Math.floor(Math.random() * 10);
      randomY = Math.floor(Math.random() * 10);
    }
    opponent.gameboard.receiveAttack([randomX, randomY]);
    aiAttack([randomX, randomY]);
    if (opponent.gameboard.isGameOver()) endGame(this);
  }
}
