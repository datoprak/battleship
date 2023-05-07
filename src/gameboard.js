import { Ship } from "./ship";

export class Gameboard {
  constructor() {
    this.board = this.createBoard();
    this.ships = [];
  }

  createBoard() {
    const board = [];
    for (let i = 0; i < 10; i++) {
      board[i] = [];
      for (let j = 0; j < 10; j++) {
        board[i][j] = { coor: [i, j], ship: false, hasAttacked: false };
      }
    }
    return board;
  }

  createShip(shipLength) {
    let ship;
    switch (shipLength) {
      case 5:
        ship = new Ship(5);
        break;
      case 4:
        ship = new Ship(4);
        break;
      case 3:
        ship = new Ship(3);
        break;
      case 2:
        ship = new Ship(2);
        break;
      default:
        break;
    }
    this.ships.push(ship);
    return ship;
  }

  placeShip(shipLength, startPoint, endPoint) {
    const ship = this.createShip(shipLength);
    if (shipLength === 2) {
      this.board[startPoint[0]][startPoint[1]].ship = ship;
      this.board[endPoint[0]][endPoint[1]].ship = ship;
    } else {
      if (startPoint[0] === endPoint[0]) {
        if (startPoint[1] > endPoint[1]) {
          for (let i = 0; i < shipLength; i++) {
            this.board[startPoint[0]][startPoint[1] - i].ship = ship;
          }
        } else {
          for (let i = 0; i < shipLength; i++) {
            this.board[startPoint[0]][startPoint[1] + i].ship = ship;
          }
        }
      } else {
        if (startPoint[0] > endPoint[0]) {
          for (let i = 0; i < shipLength; i++) {
            this.board[startPoint[0] - i][startPoint[1]].ship = ship;
          }
        } else {
          for (let i = 0; i < shipLength; i++) {
            this.board[startPoint[0] + i][startPoint[1]].ship = ship;
          }
        }
      }
    }
  }

  receiveAttack(coor) {
    if (!this.board[coor[0]][coor[1]].hasAttacked) {
      this.board[coor[0]][coor[1]].hasAttacked = true;
      if (this.board[coor[0]][coor[1]].ship) {
        this.board[coor[0]][coor[1]].ship.hit();
      }
    }
  }

  isGameOver() {
    return this.ships.every(ship => ship.isSunk());
  }

  randomPlacement() {
    const checkSquare = (coor, filledCoor) => {
      if (coor.some(c => filledCoor.includes(c))) return true;
      else return false;
    };

    const pickRandomXY = () => {
      return Math.floor(Math.random() * 2) === 0 ? "x" : "y";
    };

    const pickRandomNumber = length => {
      return Math.floor(Math.random() * (10 - length + 1));
    };

    let filledCoor = [];

    const place = (length, filledCoor) => {
      let randomX;
      let randomY;
      let coor;

      do {
        coor = [];
        if (pickRandomXY() === "x") {
          randomX = pickRandomNumber(length);
          randomY = Math.floor(Math.random() * 10);
          for (let i = 0; i < length; i++) {
            coor.push(`${(randomX + i) % 10}, ${randomY}`);
          }
        } else {
          randomX = Math.floor(Math.random() * 10);
          randomY = pickRandomNumber(length);
          for (let i = 0; i < length; i++) {
            coor.push(`${randomX}, ${(randomY + i) % 10}`);
          }
        }
      } while (checkSquare(coor, filledCoor));

      filledCoor = [...filledCoor, ...coor];
      const pop = coor.pop();
      const shift = coor.shift();
      this.placeShip(
        length,
        [pop.charAt(0), pop.charAt(3)],
        [shift.charAt(0), shift.charAt(3)]
      );
      return filledCoor;
    };

    filledCoor = [...place(5, filledCoor)];
    filledCoor = [...place(4, filledCoor)];
    filledCoor = [...place(3, filledCoor)];
    filledCoor = [...place(2, filledCoor)];
    place(2, filledCoor);
  }
}
