/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "endGame": () => (/* binding */ endGame),
/* harmony export */   "game": () => (/* binding */ game),
/* harmony export */   "playRound": () => (/* binding */ playRound)
/* harmony export */ });
/* harmony import */ var _interface__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interface */ "./src/interface.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");


const game = () => {
  const player = new _player__WEBPACK_IMPORTED_MODULE_1__.Player("player");
  const ai = new _player__WEBPACK_IMPORTED_MODULE_1__.Player("ai");

  // !TODO let player choose their own placement
  player.gameboard.randomPlacement();
  ai.gameboard.randomPlacement();
  (0,_interface__WEBPACK_IMPORTED_MODULE_0__.createBoards)(player.gameboard.board, ai.gameboard.board);
  (0,_interface__WEBPACK_IMPORTED_MODULE_0__.handleModal)();
  playRound(player, ai);
};
const playRound = (player, ai) => {
  if (player.gameboard.isGameOver()) endGame(ai);
  if (ai.gameboard.isGameOver()) endGame(player);
  if (player.isTurn) {
    const aiBoard = document.querySelector(".ai-board");
    aiBoard.param = {
      player,
      ai
    };
    aiBoard.addEventListener("click", _interface__WEBPACK_IMPORTED_MODULE_0__.playerAttack);
  } else {
    ai.makeMove(player);
  }
};
const endGame = winner => {
  (0,_interface__WEBPACK_IMPORTED_MODULE_0__.handleModal)();
  // !TODO think more appropriate win message for dom.
  const guide = document.querySelector(".guide");
  guide.textContent = `${winner.name} won!`;
};

/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Gameboard": () => (/* binding */ Gameboard)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");

class Gameboard {
  constructor() {
    this.board = this.createBoard();
    this.ships = [];
  }
  createBoard() {
    const board = [];
    for (let i = 0; i < 10; i++) {
      board[i] = [];
      for (let j = 0; j < 10; j++) {
        board[i][j] = {
          coor: [i, j],
          ship: false,
          hasAttacked: false
        };
      }
    }
    return board;
  }
  createShip(shipLength) {
    let ship;
    switch (shipLength) {
      case 5:
        ship = new _ship__WEBPACK_IMPORTED_MODULE_0__.Ship(5);
        break;
      case 4:
        ship = new _ship__WEBPACK_IMPORTED_MODULE_0__.Ship(4);
        break;
      case 3:
        ship = new _ship__WEBPACK_IMPORTED_MODULE_0__.Ship(3);
        break;
      case 2:
        ship = new _ship__WEBPACK_IMPORTED_MODULE_0__.Ship(2);
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
      if (coor.some(c => filledCoor.includes(c))) return true;else return false;
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
      this.placeShip(length, [pop.charAt(0), pop.charAt(3)], [shift.charAt(0), shift.charAt(3)]);
      return filledCoor;
    };
    filledCoor = [...place(5, filledCoor)];
    filledCoor = [...place(4, filledCoor)];
    filledCoor = [...place(3, filledCoor)];
    filledCoor = [...place(2, filledCoor)];
    place(2, filledCoor);
  }
}

/***/ }),

/***/ "./src/interface.js":
/*!**************************!*\
  !*** ./src/interface.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "aiAttack": () => (/* binding */ aiAttack),
/* harmony export */   "createBoards": () => (/* binding */ createBoards),
/* harmony export */   "handleModal": () => (/* binding */ handleModal),
/* harmony export */   "playerAttack": () => (/* binding */ playerAttack)
/* harmony export */ });
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");

const createBoards = (playerBoardArr, aiBoardArr) => {
  const playerBoard = document.querySelector(".player-board");
  const aiBoard = document.querySelector(".ai-board");
  const playerSquares = [];
  const aiSquares = [];
  playerBoardArr.forEach(col => {
    col.forEach(sq => {
      const square = document.createElement("div");
      square.classList.add("square");
      square.dataset.coor = sq.coor;
      if (sq.ship) square.classList.add("ship");
      square.textContent = sq.coor;
      playerSquares.push(square);
    });
  });
  aiBoardArr.forEach(col => {
    col.forEach(sq => {
      const square = document.createElement("div");
      square.classList.add("ai-square");
      square.dataset.coor = sq.coor;
      if (sq.ship) square.classList.add("ai-ship");
      square.textContent = sq.coor;
      aiSquares.push(square);
    });
  });
  playerBoard.replaceChildren(...playerSquares);
  aiBoard.replaceChildren(...aiSquares);
};
const playerAttack = e => {
  const attackedSquare = e.target;
  if (attackedSquare.classList.contains("attacked")) return;
  attackedSquare.classList.add("attacked");
  const player = e.currentTarget.param.player;
  const ai = e.currentTarget.param.ai;
  const coor = attackedSquare.dataset.coor;
  const coorArr = [+coor[0], +coor[2]];
  player.makeMove(ai, coorArr);
  (0,_game__WEBPACK_IMPORTED_MODULE_0__.playRound)(player, ai);
};
const aiAttack = coor => {
  const stringCoor = coor.join(",");
  const squares = document.querySelectorAll(".square");
  squares.forEach(sq => {
    if (sq.dataset.coor === stringCoor) sq.classList.add("attacked");
  });
};
const handleModal = () => {
  const modal = document.querySelector(".modal");
  modal.style.display = modal.style.display === "none" ? "block" : "none";
};

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Player": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _interface__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interface */ "./src/interface.js");



class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__.Gameboard();
    this.isTurn = name === "ai" ? false : true;
  }
  makeMove(opponent) {
    let coor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (coor) opponent.gameboard.receiveAttack(coor);else this.aiMove(opponent);
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
    (0,_interface__WEBPACK_IMPORTED_MODULE_2__.aiAttack)([randomX, randomY]);
    if (opponent.gameboard.isGameOver()) (0,_game__WEBPACK_IMPORTED_MODULE_0__.endGame)(this);
  }
}

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ship": () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
  constructor(length) {
    this.length = length;
    this.numberOfHits = 0;
  }
  hit() {
    if (!this.isSunk()) this.numberOfHits++;
  }
  isSunk() {
    return this.length === this.numberOfHits;
  }
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\r\n  padding: 0;\r\n  margin: 0;\r\n  box-sizing: border-box;\r\n  font-size: 16px;\r\n}\r\n\r\n.content {\r\n  height: 100vh;\r\n  display: grid;\r\n  grid-template-rows: 1fr 3fr;\r\n  grid-template-columns: 1fr 1fr;\r\n  padding: 64px;\r\n  gap: 16px;\r\n}\r\n\r\n.header {\r\n  grid-row: 1/2;\r\n  grid-column: 1/3;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  font-size: 3rem;\r\n}\r\n\r\n.player-board,\r\n.ai-board {\r\n  grid-row: 2/3;\r\n  border: 1px solid black;\r\n  width: 70%;\r\n  aspect-ratio: 1/1;\r\n  justify-self: center;\r\n  display: grid;\r\n  grid-template-columns: repeat(10, 1fr);\r\n  grid-template-rows: repeat(10, 1fr);\r\n}\r\n\r\n.player-board {\r\n  grid-column: 1/2;\r\n}\r\n\r\n.ai-board {\r\n  grid-column: 2/3;\r\n}\r\n\r\n.square,\r\n.ai-square {\r\n  border: 1px solid black;\r\n  background-color: steelblue;\r\n}\r\n\r\n.ai-square.ai-ship,\r\n.square.ship {\r\n  background-color: gray;\r\n}\r\n\r\n.square.attacked,\r\n.ai-square.attacked {\r\n  background-color: green;\r\n}\r\n\r\n.ai-square.ai-ship.attacked,\r\n.square.ship.attacked {\r\n  background-color: red;\r\n}\r\n\r\n.modal {\r\n  display: block;\r\n  position: fixed;\r\n  z-index: 1;\r\n  left: 0;\r\n  top: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  background-color: rgba(0, 0, 0, 0.4);\r\n}\r\n", "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;EACE,UAAU;EACV,SAAS;EACT,sBAAsB;EACtB,eAAe;AACjB;;AAEA;EACE,aAAa;EACb,aAAa;EACb,2BAA2B;EAC3B,8BAA8B;EAC9B,aAAa;EACb,SAAS;AACX;;AAEA;EACE,aAAa;EACb,gBAAgB;EAChB,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,eAAe;AACjB;;AAEA;;EAEE,aAAa;EACb,uBAAuB;EACvB,UAAU;EACV,iBAAiB;EACjB,oBAAoB;EACpB,aAAa;EACb,sCAAsC;EACtC,mCAAmC;AACrC;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;;EAEE,uBAAuB;EACvB,2BAA2B;AAC7B;;AAEA;;EAEE,sBAAsB;AACxB;;AAEA;;EAEE,uBAAuB;AACzB;;AAEA;;EAEE,qBAAqB;AACvB;;AAEA;EACE,cAAc;EACd,eAAe;EACf,UAAU;EACV,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,oCAAoC;AACtC","sourcesContent":["* {\r\n  padding: 0;\r\n  margin: 0;\r\n  box-sizing: border-box;\r\n  font-size: 16px;\r\n}\r\n\r\n.content {\r\n  height: 100vh;\r\n  display: grid;\r\n  grid-template-rows: 1fr 3fr;\r\n  grid-template-columns: 1fr 1fr;\r\n  padding: 64px;\r\n  gap: 16px;\r\n}\r\n\r\n.header {\r\n  grid-row: 1/2;\r\n  grid-column: 1/3;\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  font-size: 3rem;\r\n}\r\n\r\n.player-board,\r\n.ai-board {\r\n  grid-row: 2/3;\r\n  border: 1px solid black;\r\n  width: 70%;\r\n  aspect-ratio: 1/1;\r\n  justify-self: center;\r\n  display: grid;\r\n  grid-template-columns: repeat(10, 1fr);\r\n  grid-template-rows: repeat(10, 1fr);\r\n}\r\n\r\n.player-board {\r\n  grid-column: 1/2;\r\n}\r\n\r\n.ai-board {\r\n  grid-column: 2/3;\r\n}\r\n\r\n.square,\r\n.ai-square {\r\n  border: 1px solid black;\r\n  background-color: steelblue;\r\n}\r\n\r\n.ai-square.ai-ship,\r\n.square.ship {\r\n  background-color: gray;\r\n}\r\n\r\n.square.attacked,\r\n.ai-square.attacked {\r\n  background-color: green;\r\n}\r\n\r\n.ai-square.ai-ship.attacked,\r\n.square.ship.attacked {\r\n  background-color: red;\r\n}\r\n\r\n.modal {\r\n  display: block;\r\n  position: fixed;\r\n  z-index: 1;\r\n  left: 0;\r\n  top: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  background-color: rgba(0, 0, 0, 0.4);\r\n}\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ "./src/style.css");


const startBtn = document.querySelector(".start-btn");
startBtn.addEventListener("click", _game__WEBPACK_IMPORTED_MODULE_0__.game);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7QUNBOEI7QUFDVDtBQUVyQixNQUFNQyxRQUFRLEdBQUcvRSxRQUFRLENBQUNDLGFBQWEsQ0FBQyxZQUFZLENBQUM7QUFDckQ4RSxRQUFRLENBQUM1RSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUVkLHVDQUFJLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ludGVyZmFjZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUJvYXJkcywgaGFuZGxlTW9kYWwsIHBsYXllckF0dGFjayB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBnYW1lID0gKCkgPT4ge1xyXG4gIGNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIoXCJwbGF5ZXJcIik7XHJcbiAgY29uc3QgYWkgPSBuZXcgUGxheWVyKFwiYWlcIik7XHJcblxyXG4gIC8vICFUT0RPIGxldCBwbGF5ZXIgY2hvb3NlIHRoZWlyIG93biBwbGFjZW1lbnRcclxuICBwbGF5ZXIuZ2FtZWJvYXJkLnJhbmRvbVBsYWNlbWVudCgpO1xyXG4gIGFpLmdhbWVib2FyZC5yYW5kb21QbGFjZW1lbnQoKTtcclxuXHJcbiAgY3JlYXRlQm9hcmRzKHBsYXllci5nYW1lYm9hcmQuYm9hcmQsIGFpLmdhbWVib2FyZC5ib2FyZCk7XHJcbiAgaGFuZGxlTW9kYWwoKTtcclxuICBwbGF5Um91bmQocGxheWVyLCBhaSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcGxheVJvdW5kID0gKHBsYXllciwgYWkpID0+IHtcclxuICBpZiAocGxheWVyLmdhbWVib2FyZC5pc0dhbWVPdmVyKCkpIGVuZEdhbWUoYWkpO1xyXG4gIGlmIChhaS5nYW1lYm9hcmQuaXNHYW1lT3ZlcigpKSBlbmRHYW1lKHBsYXllcik7XHJcbiAgaWYgKHBsYXllci5pc1R1cm4pIHtcclxuICAgIGNvbnN0IGFpQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFpLWJvYXJkXCIpO1xyXG4gICAgYWlCb2FyZC5wYXJhbSA9IHsgcGxheWVyLCBhaSB9O1xyXG4gICAgYWlCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxheWVyQXR0YWNrKTtcclxuICB9IGVsc2Uge1xyXG4gICAgYWkubWFrZU1vdmUocGxheWVyKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZW5kR2FtZSA9IHdpbm5lciA9PiB7XHJcbiAgaGFuZGxlTW9kYWwoKTtcclxuICAvLyAhVE9ETyB0aGluayBtb3JlIGFwcHJvcHJpYXRlIHdpbiBtZXNzYWdlIGZvciBkb20uXHJcbiAgY29uc3QgZ3VpZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmd1aWRlXCIpO1xyXG4gIGd1aWRlLnRleHRDb250ZW50ID0gYCR7d2lubmVyLm5hbWV9IHdvbiFgO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBTaGlwIH0gZnJvbSBcIi4vc2hpcFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVib2FyZCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmJvYXJkID0gdGhpcy5jcmVhdGVCb2FyZCgpO1xyXG4gICAgdGhpcy5zaGlwcyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlQm9hcmQoKSB7XHJcbiAgICBjb25zdCBib2FyZCA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcbiAgICAgIGJvYXJkW2ldID0gW107XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xyXG4gICAgICAgIGJvYXJkW2ldW2pdID0geyBjb29yOiBbaSwgal0sIHNoaXA6IGZhbHNlLCBoYXNBdHRhY2tlZDogZmFsc2UgfTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJvYXJkO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlU2hpcChzaGlwTGVuZ3RoKSB7XHJcbiAgICBsZXQgc2hpcDtcclxuICAgIHN3aXRjaCAoc2hpcExlbmd0aCkge1xyXG4gICAgICBjYXNlIDU6XHJcbiAgICAgICAgc2hpcCA9IG5ldyBTaGlwKDUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDQ6XHJcbiAgICAgICAgc2hpcCA9IG5ldyBTaGlwKDQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDM6XHJcbiAgICAgICAgc2hpcCA9IG5ldyBTaGlwKDMpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgc2hpcCA9IG5ldyBTaGlwKDIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zaGlwcy5wdXNoKHNoaXApO1xyXG4gICAgcmV0dXJuIHNoaXA7XHJcbiAgfVxyXG5cclxuICBwbGFjZVNoaXAoc2hpcExlbmd0aCwgc3RhcnRQb2ludCwgZW5kUG9pbnQpIHtcclxuICAgIGNvbnN0IHNoaXAgPSB0aGlzLmNyZWF0ZVNoaXAoc2hpcExlbmd0aCk7XHJcbiAgICBpZiAoc2hpcExlbmd0aCA9PT0gMikge1xyXG4gICAgICB0aGlzLmJvYXJkW3N0YXJ0UG9pbnRbMF1dW3N0YXJ0UG9pbnRbMV1dLnNoaXAgPSBzaGlwO1xyXG4gICAgICB0aGlzLmJvYXJkW2VuZFBvaW50WzBdXVtlbmRQb2ludFsxXV0uc2hpcCA9IHNoaXA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoc3RhcnRQb2ludFswXSA9PT0gZW5kUG9pbnRbMF0pIHtcclxuICAgICAgICBpZiAoc3RhcnRQb2ludFsxXSA+IGVuZFBvaW50WzFdKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkW3N0YXJ0UG9pbnRbMF1dW3N0YXJ0UG9pbnRbMV0gLSBpXS5zaGlwID0gc2hpcDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZFtzdGFydFBvaW50WzBdXVtzdGFydFBvaW50WzFdICsgaV0uc2hpcCA9IHNoaXA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChzdGFydFBvaW50WzBdID4gZW5kUG9pbnRbMF0pIHtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbc3RhcnRQb2ludFswXSAtIGldW3N0YXJ0UG9pbnRbMV1dLnNoaXAgPSBzaGlwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkW3N0YXJ0UG9pbnRbMF0gKyBpXVtzdGFydFBvaW50WzFdXS5zaGlwID0gc2hpcDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlY2VpdmVBdHRhY2soY29vcikge1xyXG4gICAgaWYgKCF0aGlzLmJvYXJkW2Nvb3JbMF1dW2Nvb3JbMV1dLmhhc0F0dGFja2VkKSB7XHJcbiAgICAgIHRoaXMuYm9hcmRbY29vclswXV1bY29vclsxXV0uaGFzQXR0YWNrZWQgPSB0cnVlO1xyXG4gICAgICBpZiAodGhpcy5ib2FyZFtjb29yWzBdXVtjb29yWzFdXS5zaGlwKSB7XHJcbiAgICAgICAgdGhpcy5ib2FyZFtjb29yWzBdXVtjb29yWzFdXS5zaGlwLmhpdCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc0dhbWVPdmVyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2hpcHMuZXZlcnkoc2hpcCA9PiBzaGlwLmlzU3VuaygpKTtcclxuICB9XHJcblxyXG4gIHJhbmRvbVBsYWNlbWVudCgpIHtcclxuICAgIGNvbnN0IGNoZWNrU3F1YXJlID0gKGNvb3IsIGZpbGxlZENvb3IpID0+IHtcclxuICAgICAgaWYgKGNvb3Iuc29tZShjID0+IGZpbGxlZENvb3IuaW5jbHVkZXMoYykpKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHBpY2tSYW5kb21YWSA9ICgpID0+IHtcclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpID09PSAwID8gXCJ4XCIgOiBcInlcIjtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcGlja1JhbmRvbU51bWJlciA9IGxlbmd0aCA9PiB7XHJcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoMTAgLSBsZW5ndGggKyAxKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBmaWxsZWRDb29yID0gW107XHJcblxyXG4gICAgY29uc3QgcGxhY2UgPSAobGVuZ3RoLCBmaWxsZWRDb29yKSA9PiB7XHJcbiAgICAgIGxldCByYW5kb21YO1xyXG4gICAgICBsZXQgcmFuZG9tWTtcclxuICAgICAgbGV0IGNvb3I7XHJcblxyXG4gICAgICBkbyB7XHJcbiAgICAgICAgY29vciA9IFtdO1xyXG4gICAgICAgIGlmIChwaWNrUmFuZG9tWFkoKSA9PT0gXCJ4XCIpIHtcclxuICAgICAgICAgIHJhbmRvbVggPSBwaWNrUmFuZG9tTnVtYmVyKGxlbmd0aCk7XHJcbiAgICAgICAgICByYW5kb21ZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb29yLnB1c2goYCR7KHJhbmRvbVggKyBpKSAlIDEwfSwgJHtyYW5kb21ZfWApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByYW5kb21YID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xyXG4gICAgICAgICAgcmFuZG9tWSA9IHBpY2tSYW5kb21OdW1iZXIobGVuZ3RoKTtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29vci5wdXNoKGAke3JhbmRvbVh9LCAkeyhyYW5kb21ZICsgaSkgJSAxMH1gKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gd2hpbGUgKGNoZWNrU3F1YXJlKGNvb3IsIGZpbGxlZENvb3IpKTtcclxuXHJcbiAgICAgIGZpbGxlZENvb3IgPSBbLi4uZmlsbGVkQ29vciwgLi4uY29vcl07XHJcbiAgICAgIGNvbnN0IHBvcCA9IGNvb3IucG9wKCk7XHJcbiAgICAgIGNvbnN0IHNoaWZ0ID0gY29vci5zaGlmdCgpO1xyXG4gICAgICB0aGlzLnBsYWNlU2hpcChcclxuICAgICAgICBsZW5ndGgsXHJcbiAgICAgICAgW3BvcC5jaGFyQXQoMCksIHBvcC5jaGFyQXQoMyldLFxyXG4gICAgICAgIFtzaGlmdC5jaGFyQXQoMCksIHNoaWZ0LmNoYXJBdCgzKV1cclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuIGZpbGxlZENvb3I7XHJcbiAgICB9O1xyXG5cclxuICAgIGZpbGxlZENvb3IgPSBbLi4ucGxhY2UoNSwgZmlsbGVkQ29vcildO1xyXG4gICAgZmlsbGVkQ29vciA9IFsuLi5wbGFjZSg0LCBmaWxsZWRDb29yKV07XHJcbiAgICBmaWxsZWRDb29yID0gWy4uLnBsYWNlKDMsIGZpbGxlZENvb3IpXTtcclxuICAgIGZpbGxlZENvb3IgPSBbLi4ucGxhY2UoMiwgZmlsbGVkQ29vcildO1xyXG4gICAgcGxhY2UoMiwgZmlsbGVkQ29vcik7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IHBsYXlSb3VuZCB9IGZyb20gXCIuL2dhbWVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVCb2FyZHMgPSAocGxheWVyQm9hcmRBcnIsIGFpQm9hcmRBcnIpID0+IHtcclxuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLWJvYXJkXCIpO1xyXG4gIGNvbnN0IGFpQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFpLWJvYXJkXCIpO1xyXG4gIGNvbnN0IHBsYXllclNxdWFyZXMgPSBbXTtcclxuICBjb25zdCBhaVNxdWFyZXMgPSBbXTtcclxuXHJcbiAgcGxheWVyQm9hcmRBcnIuZm9yRWFjaChjb2wgPT4ge1xyXG4gICAgY29sLmZvckVhY2goc3EgPT4ge1xyXG4gICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZChcInNxdWFyZVwiKTtcclxuICAgICAgc3F1YXJlLmRhdGFzZXQuY29vciA9IHNxLmNvb3I7XHJcbiAgICAgIGlmIChzcS5zaGlwKSBzcXVhcmUuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XHJcbiAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9IHNxLmNvb3I7XHJcbiAgICAgIHBsYXllclNxdWFyZXMucHVzaChzcXVhcmUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGFpQm9hcmRBcnIuZm9yRWFjaChjb2wgPT4ge1xyXG4gICAgY29sLmZvckVhY2goc3EgPT4ge1xyXG4gICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZChcImFpLXNxdWFyZVwiKTtcclxuICAgICAgc3F1YXJlLmRhdGFzZXQuY29vciA9IHNxLmNvb3I7XHJcbiAgICAgIGlmIChzcS5zaGlwKSBzcXVhcmUuY2xhc3NMaXN0LmFkZChcImFpLXNoaXBcIik7XHJcbiAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9IHNxLmNvb3I7XHJcbiAgICAgIGFpU3F1YXJlcy5wdXNoKHNxdWFyZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgcGxheWVyQm9hcmQucmVwbGFjZUNoaWxkcmVuKC4uLnBsYXllclNxdWFyZXMpO1xyXG4gIGFpQm9hcmQucmVwbGFjZUNoaWxkcmVuKC4uLmFpU3F1YXJlcyk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcGxheWVyQXR0YWNrID0gZSA9PiB7XHJcbiAgY29uc3QgYXR0YWNrZWRTcXVhcmUgPSBlLnRhcmdldDtcclxuICBpZiAoYXR0YWNrZWRTcXVhcmUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYXR0YWNrZWRcIikpIHJldHVybjtcclxuICBhdHRhY2tlZFNxdWFyZS5jbGFzc0xpc3QuYWRkKFwiYXR0YWNrZWRcIik7XHJcbiAgY29uc3QgcGxheWVyID0gZS5jdXJyZW50VGFyZ2V0LnBhcmFtLnBsYXllcjtcclxuICBjb25zdCBhaSA9IGUuY3VycmVudFRhcmdldC5wYXJhbS5haTtcclxuICBjb25zdCBjb29yID0gYXR0YWNrZWRTcXVhcmUuZGF0YXNldC5jb29yO1xyXG4gIGNvbnN0IGNvb3JBcnIgPSBbK2Nvb3JbMF0sICtjb29yWzJdXTtcclxuICBwbGF5ZXIubWFrZU1vdmUoYWksIGNvb3JBcnIpO1xyXG4gIHBsYXlSb3VuZChwbGF5ZXIsIGFpKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBhaUF0dGFjayA9IGNvb3IgPT4ge1xyXG4gIGNvbnN0IHN0cmluZ0Nvb3IgPSBjb29yLmpvaW4oXCIsXCIpO1xyXG4gIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNxdWFyZVwiKTtcclxuICBzcXVhcmVzLmZvckVhY2goc3EgPT4ge1xyXG4gICAgaWYgKHNxLmRhdGFzZXQuY29vciA9PT0gc3RyaW5nQ29vcikgc3EuY2xhc3NMaXN0LmFkZChcImF0dGFja2VkXCIpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhbmRsZU1vZGFsID0gKCkgPT4ge1xyXG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbFwiKTtcclxuICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gbW9kYWwuc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIgPyBcImJsb2NrXCIgOiBcIm5vbmVcIjtcclxufTtcclxuIiwiaW1wb3J0IHsgZW5kR2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcclxuaW1wb3J0IHsgR2FtZWJvYXJkIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XHJcbmltcG9ydCB7IGFpQXR0YWNrIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgdGhpcy5nYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XHJcbiAgICB0aGlzLmlzVHVybiA9IG5hbWUgPT09IFwiYWlcIiA/IGZhbHNlIDogdHJ1ZTtcclxuICB9XHJcblxyXG4gIG1ha2VNb3ZlKG9wcG9uZW50LCBjb29yID0gbnVsbCkge1xyXG4gICAgaWYgKGNvb3IpIG9wcG9uZW50LmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3IpO1xyXG4gICAgZWxzZSB0aGlzLmFpTW92ZShvcHBvbmVudCk7XHJcbiAgICB0aGlzLmlzVHVybiA9ICF0aGlzLmlzVHVybjtcclxuICAgIG9wcG9uZW50LmlzVHVybiA9ICFvcHBvbmVudC5pc1R1cm47XHJcbiAgfVxyXG5cclxuICBhaU1vdmUob3Bwb25lbnQpIHtcclxuICAgIGxldCByYW5kb21YID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xyXG4gICAgbGV0IHJhbmRvbVkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XHJcbiAgICB3aGlsZSAob3Bwb25lbnQuZ2FtZWJvYXJkLmJvYXJkW3JhbmRvbVhdW3JhbmRvbVldLmhhc0F0dGFja2VkKSB7XHJcbiAgICAgIHJhbmRvbVggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XHJcbiAgICAgIHJhbmRvbVkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XHJcbiAgICB9XHJcbiAgICBvcHBvbmVudC5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhbcmFuZG9tWCwgcmFuZG9tWV0pO1xyXG4gICAgYWlBdHRhY2soW3JhbmRvbVgsIHJhbmRvbVldKTtcclxuICAgIGlmIChvcHBvbmVudC5nYW1lYm9hcmQuaXNHYW1lT3ZlcigpKSBlbmRHYW1lKHRoaXMpO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgY2xhc3MgU2hpcCB7XHJcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XHJcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcclxuICAgIHRoaXMubnVtYmVyT2ZIaXRzID0gMDtcclxuICB9XHJcblxyXG4gIGhpdCgpIHtcclxuICAgIGlmICghdGhpcy5pc1N1bmsoKSkgdGhpcy5udW1iZXJPZkhpdHMrKztcclxuICB9XHJcblxyXG4gIGlzU3VuaygpIHtcclxuICAgIHJldHVybiB0aGlzLmxlbmd0aCA9PT0gdGhpcy5udW1iZXJPZkhpdHM7XHJcbiAgfVxyXG59XHJcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiKiB7XFxyXFxuICBwYWRkaW5nOiAwO1xcclxcbiAgbWFyZ2luOiAwO1xcclxcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gIGZvbnQtc2l6ZTogMTZweDtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbnRlbnQge1xcclxcbiAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gIGRpc3BsYXk6IGdyaWQ7XFxyXFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmciAzZnI7XFxyXFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxyXFxuICBwYWRkaW5nOiA2NHB4O1xcclxcbiAgZ2FwOiAxNnB4O1xcclxcbn1cXHJcXG5cXHJcXG4uaGVhZGVyIHtcXHJcXG4gIGdyaWQtcm93OiAxLzI7XFxyXFxuICBncmlkLWNvbHVtbjogMS8zO1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gIGZvbnQtc2l6ZTogM3JlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllci1ib2FyZCxcXHJcXG4uYWktYm9hcmQge1xcclxcbiAgZ3JpZC1yb3c6IDIvMztcXHJcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgd2lkdGg6IDcwJTtcXHJcXG4gIGFzcGVjdC1yYXRpbzogMS8xO1xcclxcbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XFxyXFxuICBkaXNwbGF5OiBncmlkO1xcclxcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDFmcik7XFxyXFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMWZyKTtcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllci1ib2FyZCB7XFxyXFxuICBncmlkLWNvbHVtbjogMS8yO1xcclxcbn1cXHJcXG5cXHJcXG4uYWktYm9hcmQge1xcclxcbiAgZ3JpZC1jb2x1bW46IDIvMztcXHJcXG59XFxyXFxuXFxyXFxuLnNxdWFyZSxcXHJcXG4uYWktc3F1YXJlIHtcXHJcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogc3RlZWxibHVlO1xcclxcbn1cXHJcXG5cXHJcXG4uYWktc3F1YXJlLmFpLXNoaXAsXFxyXFxuLnNxdWFyZS5zaGlwIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IGdyYXk7XFxyXFxufVxcclxcblxcclxcbi5zcXVhcmUuYXR0YWNrZWQsXFxyXFxuLmFpLXNxdWFyZS5hdHRhY2tlZCB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbjtcXHJcXG59XFxyXFxuXFxyXFxuLmFpLXNxdWFyZS5haS1zaGlwLmF0dGFja2VkLFxcclxcbi5zcXVhcmUuc2hpcC5hdHRhY2tlZCB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XFxyXFxufVxcclxcblxcclxcbi5tb2RhbCB7XFxyXFxuICBkaXNwbGF5OiBibG9jaztcXHJcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gIHotaW5kZXg6IDE7XFxyXFxuICBsZWZ0OiAwO1xcclxcbiAgdG9wOiAwO1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICBoZWlnaHQ6IDEwMCU7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNCk7XFxyXFxufVxcclxcblwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxVQUFVO0VBQ1YsU0FBUztFQUNULHNCQUFzQjtFQUN0QixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLGFBQWE7RUFDYiwyQkFBMkI7RUFDM0IsOEJBQThCO0VBQzlCLGFBQWE7RUFDYixTQUFTO0FBQ1g7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsZ0JBQWdCO0VBQ2hCLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLGVBQWU7QUFDakI7O0FBRUE7O0VBRUUsYUFBYTtFQUNiLHVCQUF1QjtFQUN2QixVQUFVO0VBQ1YsaUJBQWlCO0VBQ2pCLG9CQUFvQjtFQUNwQixhQUFhO0VBQ2Isc0NBQXNDO0VBQ3RDLG1DQUFtQztBQUNyQzs7QUFFQTtFQUNFLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGdCQUFnQjtBQUNsQjs7QUFFQTs7RUFFRSx1QkFBdUI7RUFDdkIsMkJBQTJCO0FBQzdCOztBQUVBOztFQUVFLHNCQUFzQjtBQUN4Qjs7QUFFQTs7RUFFRSx1QkFBdUI7QUFDekI7O0FBRUE7O0VBRUUscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UsY0FBYztFQUNkLGVBQWU7RUFDZixVQUFVO0VBQ1YsT0FBTztFQUNQLE1BQU07RUFDTixXQUFXO0VBQ1gsWUFBWTtFQUNaLG9DQUFvQztBQUN0Q1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqIHtcXHJcXG4gIHBhZGRpbmc6IDA7XFxyXFxuICBtYXJnaW46IDA7XFxyXFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbiAgZm9udC1zaXplOiAxNnB4O1xcclxcbn1cXHJcXG5cXHJcXG4uY29udGVudCB7XFxyXFxuICBoZWlnaHQ6IDEwMHZoO1xcclxcbiAgZGlzcGxheTogZ3JpZDtcXHJcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDNmcjtcXHJcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXHJcXG4gIHBhZGRpbmc6IDY0cHg7XFxyXFxuICBnYXA6IDE2cHg7XFxyXFxufVxcclxcblxcclxcbi5oZWFkZXIge1xcclxcbiAgZ3JpZC1yb3c6IDEvMjtcXHJcXG4gIGdyaWQtY29sdW1uOiAxLzM7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgZm9udC1zaXplOiAzcmVtO1xcclxcbn1cXHJcXG5cXHJcXG4ucGxheWVyLWJvYXJkLFxcclxcbi5haS1ib2FyZCB7XFxyXFxuICBncmlkLXJvdzogMi8zO1xcclxcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICB3aWR0aDogNzAlO1xcclxcbiAgYXNwZWN0LXJhdGlvOiAxLzE7XFxyXFxuICBqdXN0aWZ5LXNlbGY6IGNlbnRlcjtcXHJcXG4gIGRpc3BsYXk6IGdyaWQ7XFxyXFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMWZyKTtcXHJcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAxZnIpO1xcclxcbn1cXHJcXG5cXHJcXG4ucGxheWVyLWJvYXJkIHtcXHJcXG4gIGdyaWQtY29sdW1uOiAxLzI7XFxyXFxufVxcclxcblxcclxcbi5haS1ib2FyZCB7XFxyXFxuICBncmlkLWNvbHVtbjogMi8zO1xcclxcbn1cXHJcXG5cXHJcXG4uc3F1YXJlLFxcclxcbi5haS1zcXVhcmUge1xcclxcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBzdGVlbGJsdWU7XFxyXFxufVxcclxcblxcclxcbi5haS1zcXVhcmUuYWktc2hpcCxcXHJcXG4uc3F1YXJlLnNoaXAge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogZ3JheTtcXHJcXG59XFxyXFxuXFxyXFxuLnNxdWFyZS5hdHRhY2tlZCxcXHJcXG4uYWktc3F1YXJlLmF0dGFja2VkIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IGdyZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4uYWktc3F1YXJlLmFpLXNoaXAuYXR0YWNrZWQsXFxyXFxuLnNxdWFyZS5zaGlwLmF0dGFja2VkIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHJlZDtcXHJcXG59XFxyXFxuXFxyXFxuLm1vZGFsIHtcXHJcXG4gIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgcG9zaXRpb246IGZpeGVkO1xcclxcbiAgei1pbmRleDogMTtcXHJcXG4gIGxlZnQ6IDA7XFxyXFxuICB0b3A6IDA7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIGhlaWdodDogMTAwJTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC40KTtcXHJcXG59XFxyXFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCB7IGdhbWUgfSBmcm9tIFwiLi9nYW1lXCI7XHJcbmltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XHJcblxyXG5jb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnQtYnRuXCIpO1xyXG5zdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZ2FtZSk7XHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVCb2FyZHMiLCJoYW5kbGVNb2RhbCIsInBsYXllckF0dGFjayIsIlBsYXllciIsImdhbWUiLCJwbGF5ZXIiLCJhaSIsImdhbWVib2FyZCIsInJhbmRvbVBsYWNlbWVudCIsImJvYXJkIiwicGxheVJvdW5kIiwiaXNHYW1lT3ZlciIsImVuZEdhbWUiLCJpc1R1cm4iLCJhaUJvYXJkIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwicGFyYW0iLCJhZGRFdmVudExpc3RlbmVyIiwibWFrZU1vdmUiLCJ3aW5uZXIiLCJndWlkZSIsInRleHRDb250ZW50IiwibmFtZSIsIlNoaXAiLCJHYW1lYm9hcmQiLCJjb25zdHJ1Y3RvciIsImNyZWF0ZUJvYXJkIiwic2hpcHMiLCJpIiwiaiIsImNvb3IiLCJzaGlwIiwiaGFzQXR0YWNrZWQiLCJjcmVhdGVTaGlwIiwic2hpcExlbmd0aCIsInB1c2giLCJwbGFjZVNoaXAiLCJzdGFydFBvaW50IiwiZW5kUG9pbnQiLCJyZWNlaXZlQXR0YWNrIiwiaGl0IiwiZXZlcnkiLCJpc1N1bmsiLCJjaGVja1NxdWFyZSIsImZpbGxlZENvb3IiLCJzb21lIiwiYyIsImluY2x1ZGVzIiwicGlja1JhbmRvbVhZIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwicGlja1JhbmRvbU51bWJlciIsImxlbmd0aCIsInBsYWNlIiwicmFuZG9tWCIsInJhbmRvbVkiLCJwb3AiLCJzaGlmdCIsImNoYXJBdCIsInBsYXllckJvYXJkQXJyIiwiYWlCb2FyZEFyciIsInBsYXllckJvYXJkIiwicGxheWVyU3F1YXJlcyIsImFpU3F1YXJlcyIsImZvckVhY2giLCJjb2wiLCJzcSIsInNxdWFyZSIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJkYXRhc2V0IiwicmVwbGFjZUNoaWxkcmVuIiwiZSIsImF0dGFja2VkU3F1YXJlIiwidGFyZ2V0IiwiY29udGFpbnMiLCJjdXJyZW50VGFyZ2V0IiwiY29vckFyciIsImFpQXR0YWNrIiwic3RyaW5nQ29vciIsImpvaW4iLCJzcXVhcmVzIiwicXVlcnlTZWxlY3RvckFsbCIsIm1vZGFsIiwic3R5bGUiLCJkaXNwbGF5Iiwib3Bwb25lbnQiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJhaU1vdmUiLCJudW1iZXJPZkhpdHMiLCJzdGFydEJ0biJdLCJzb3VyY2VSb290IjoiIn0=