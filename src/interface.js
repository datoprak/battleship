import { playRound } from "./game";

export const createBoards = (playerBoardArr, aiBoardArr) => {
  const playerBoard = document.querySelector(".player-board");
  const aiBoard = document.querySelector(".ai-board");

  playerBoardArr.forEach(col => {
    col.forEach(sq => {
      const square = document.createElement("div");
      square.classList.add("square");
      square.dataset.coor = sq.coor;
      if (sq.ship) square.classList.add("ship");
      square.textContent = sq.coor;
      playerBoard.appendChild(square);
    });
  });

  aiBoardArr.forEach(col => {
    col.forEach(sq => {
      const square = document.createElement("div");
      square.classList.add("ai-square");
      square.dataset.coor = sq.coor;
      if (sq.ship) square.classList.add("ai-ship");
      square.textContent = sq.coor;
      aiBoard.appendChild(square);
    });
  });
};

export const playerAttack = e => {
  const attackedSquare = e.target;
  if (attackedSquare.classList.contains("attacked")) return;
  attackedSquare.classList.add("attacked");
  const player = e.currentTarget.param.player;
  const ai = e.currentTarget.param.ai;
  const coor = attackedSquare.dataset.coor;
  const coorArr = [+coor[0], +coor[2]];
  player.makeMove(ai, coorArr);
  playRound(player, ai);
};

export const aiAttack = coor => {
  const stringCoor = coor.join(",");
  const squares = document.querySelectorAll(".square");
  squares.forEach(sq => {
    if (sq.dataset.coor === stringCoor) sq.classList.add("attacked");
  });
};
