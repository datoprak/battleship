import { Player } from "../player";

describe("player", () => {
  let player;
  let ai;
  beforeEach(() => {
    player = new Player("player");
    ai = new Player("ai");
    player.gameboard.placeShip(2, [0, 0], [0, 1]);
    player.gameboard.placeShip(5, [3, 5], [7, 5]);
    ai.gameboard.placeShip(2, [9, 9], [9, 8]);
    ai.gameboard.placeShip(5, [1, 7], [1, 3]);
  });

  test("player attacks", () => {
    player.makeMove(ai, [9, 9]);
    expect(ai.gameboard.board[9][9].hasAttacked).toBeTruthy();
    expect(ai.gameboard.board[9][9].ship.numberOfHits).toBe(1);
    expect(ai.gameboard.board[9][9].ship.isSunk()).toBeFalsy();
    expect(ai.gameboard.board[0][2].hasAttacked).toBeFalsy();
    expect(player.isTurn).toBeFalsy();
    expect(ai.isTurn).toBeTruthy();
  });

  test("player attacks and sinks a ship", () => {
    player.makeMove(ai, [9, 9]);
    ai.makeMove(player);
    player.makeMove(ai, [9, 8]);
    expect(ai.gameboard.board[9][9].hasAttacked).toBeTruthy();
    expect(ai.gameboard.board[9][8].hasAttacked).toBeTruthy();
    expect(ai.gameboard.board[9][9].ship.numberOfHits).toBe(2);
    expect(ai.gameboard.board[9][9].ship.isSunk()).toBeTruthy();
    expect(ai.gameboard.board[0][2].hasAttacked).toBeFalsy();
    expect(player.isTurn).toBeFalsy();
    expect(ai.isTurn).toBeTruthy();
    expect(ai.gameboard.isGameOver()).toBeFalsy();
  });

  test("player ends the game", () => {
    ai.makeMove(player);
    player.makeMove(ai, [9, 9]);
    ai.makeMove(player);
    player.makeMove(ai, [9, 8]);
    ai.makeMove(player);
    player.makeMove(ai, [1, 7]);
    ai.makeMove(player);
    player.makeMove(ai, [1, 6]);
    ai.makeMove(player);
    player.makeMove(ai, [1, 5]);
    ai.makeMove(player);
    player.makeMove(ai, [1, 4]);
    ai.makeMove(player);
    player.makeMove(ai, [1, 3]);

    expect(ai.gameboard.isGameOver()).toBeTruthy();
  });
});
