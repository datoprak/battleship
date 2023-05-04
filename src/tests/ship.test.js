import { Ship } from "../ship.js";

describe("ship", () => {
  let ship;
  beforeEach(() => {
    ship = new Ship(3);
  });

  test("is ship working", () => {
    expect(ship).toEqual({ length: 3, numberOfHits: 0 });
  });

  test("hit", () => {
    ship.hit();
    expect(ship.numberOfHits).toBe(1);
  });

  test("hit more than length", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.numberOfHits).toBe(3);
  });

  test("is sunk true", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
  });

  test("is sunk false", () => {
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeFalsy();
  });
});
