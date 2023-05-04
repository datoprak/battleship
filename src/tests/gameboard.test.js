import { Gameboard } from "../gameboard.js";

describe("gameboard", () => {
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
    gameboard.placeShip(4, [5, 5], [2, 5]);
  });

  test("receive attack to an empty square", () => {
    gameboard.receiveAttack([5, 6]);
    expect(gameboard.board[5][6].hasAttacked).toBeTruthy();
  });

  test("receive attack to a ship", () => {
    gameboard.receiveAttack([5, 5]);
    expect(gameboard.board[5][5].hasAttacked).toBeTruthy();
    expect(gameboard.board[5][5].ship.numberOfHits).toBe(1);
  });

  test("is there a missed attack in square", () => {
    gameboard.receiveAttack([0, 0]);
    expect(gameboard.board[0][0].hasAttacked).toBeTruthy();
    expect(gameboard.board[0][1].hasAttacked).toBeFalsy();
  });

  test("not all ships have been sunk", () => {
    gameboard.receiveAttack([2, 5]);
    expect(gameboard.isGameOver()).toBeFalsy();
  });

  test("all ships have been sunk", () => {
    gameboard.receiveAttack([5, 5]);
    gameboard.receiveAttack([4, 5]);
    gameboard.receiveAttack([3, 5]);
    gameboard.receiveAttack([2, 5]);
    expect(gameboard.isGameOver()).toBeTruthy();
  });
});
