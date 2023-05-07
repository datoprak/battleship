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
/* harmony export */   "game": () => (/* binding */ game),
/* harmony export */   "playRound": () => (/* binding */ playRound)
/* harmony export */ });
/* harmony import */ var _interface__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interface */ "./src/interface.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");


const game = () => {
  const player = new _player__WEBPACK_IMPORTED_MODULE_1__.Player("player");
  const ai = new _player__WEBPACK_IMPORTED_MODULE_1__.Player("ai");
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
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _interface__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interface */ "./src/interface.js");


class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__.Gameboard();
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
    (0,_interface__WEBPACK_IMPORTED_MODULE_1__.aiAttack)([randomX, randomY]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7QUNBOEI7QUFDVDtBQUVyQixNQUFNQyxRQUFRLEdBQUcvRSxRQUFRLENBQUNDLGFBQWEsQ0FBQyxZQUFZLENBQUM7QUFDckQ4RSxRQUFRLENBQUM1RSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUVkLHVDQUFJLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ludGVyZmFjZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUJvYXJkcywgaGFuZGxlTW9kYWwsIHBsYXllckF0dGFjayB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBnYW1lID0gKCkgPT4ge1xyXG4gIGNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIoXCJwbGF5ZXJcIik7XHJcbiAgY29uc3QgYWkgPSBuZXcgUGxheWVyKFwiYWlcIik7XHJcblxyXG4gIHBsYXllci5nYW1lYm9hcmQucmFuZG9tUGxhY2VtZW50KCk7XHJcbiAgYWkuZ2FtZWJvYXJkLnJhbmRvbVBsYWNlbWVudCgpO1xyXG5cclxuICBjcmVhdGVCb2FyZHMocGxheWVyLmdhbWVib2FyZC5ib2FyZCwgYWkuZ2FtZWJvYXJkLmJvYXJkKTtcclxuICBoYW5kbGVNb2RhbCgpO1xyXG4gIHBsYXlSb3VuZChwbGF5ZXIsIGFpKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBwbGF5Um91bmQgPSAocGxheWVyLCBhaSkgPT4ge1xyXG4gIGlmIChwbGF5ZXIuZ2FtZWJvYXJkLmlzR2FtZU92ZXIoKSkgZW5kR2FtZShhaSk7XHJcbiAgaWYgKGFpLmdhbWVib2FyZC5pc0dhbWVPdmVyKCkpIGVuZEdhbWUocGxheWVyKTtcclxuICBpZiAocGxheWVyLmlzVHVybikge1xyXG4gICAgY29uc3QgYWlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWktYm9hcmRcIik7XHJcbiAgICBhaUJvYXJkLnBhcmFtID0geyBwbGF5ZXIsIGFpIH07XHJcbiAgICBhaUJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwbGF5ZXJBdHRhY2spO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBhaS5tYWtlTW92ZShwbGF5ZXIpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGVuZEdhbWUgPSB3aW5uZXIgPT4ge1xyXG4gIGhhbmRsZU1vZGFsKCk7XHJcbiAgLy8gIVRPRE8gdGhpbmsgbW9yZSBhcHByb3ByaWF0ZSB3aW4gbWVzc2FnZSBmb3IgZG9tLlxyXG4gIGNvbnN0IGd1aWRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ndWlkZVwiKTtcclxuICBndWlkZS50ZXh0Q29udGVudCA9IGAke3dpbm5lci5uYW1lfSB3b24hYDtcclxufTtcclxuIiwiaW1wb3J0IHsgU2hpcCB9IGZyb20gXCIuL3NoaXBcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lYm9hcmQge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5ib2FyZCA9IHRoaXMuY3JlYXRlQm9hcmQoKTtcclxuICAgIHRoaXMuc2hpcHMgPSBbXTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUJvYXJkKCkge1xyXG4gICAgY29uc3QgYm9hcmQgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xyXG4gICAgICBib2FyZFtpXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcclxuICAgICAgICBib2FyZFtpXVtqXSA9IHsgY29vcjogW2ksIGpdLCBzaGlwOiBmYWxzZSwgaGFzQXR0YWNrZWQ6IGZhbHNlIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBib2FyZDtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVNoaXAoc2hpcExlbmd0aCkge1xyXG4gICAgbGV0IHNoaXA7XHJcbiAgICBzd2l0Y2ggKHNoaXBMZW5ndGgpIHtcclxuICAgICAgY2FzZSA1OlxyXG4gICAgICAgIHNoaXAgPSBuZXcgU2hpcCg1KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA0OlxyXG4gICAgICAgIHNoaXAgPSBuZXcgU2hpcCg0KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAzOlxyXG4gICAgICAgIHNoaXAgPSBuZXcgU2hpcCgzKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHNoaXAgPSBuZXcgU2hpcCgyKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHRoaXMuc2hpcHMucHVzaChzaGlwKTtcclxuICAgIHJldHVybiBzaGlwO1xyXG4gIH1cclxuXHJcbiAgcGxhY2VTaGlwKHNoaXBMZW5ndGgsIHN0YXJ0UG9pbnQsIGVuZFBvaW50KSB7XHJcbiAgICBjb25zdCBzaGlwID0gdGhpcy5jcmVhdGVTaGlwKHNoaXBMZW5ndGgpO1xyXG4gICAgaWYgKHNoaXBMZW5ndGggPT09IDIpIHtcclxuICAgICAgdGhpcy5ib2FyZFtzdGFydFBvaW50WzBdXVtzdGFydFBvaW50WzFdXS5zaGlwID0gc2hpcDtcclxuICAgICAgdGhpcy5ib2FyZFtlbmRQb2ludFswXV1bZW5kUG9pbnRbMV1dLnNoaXAgPSBzaGlwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHN0YXJ0UG9pbnRbMF0gPT09IGVuZFBvaW50WzBdKSB7XHJcbiAgICAgICAgaWYgKHN0YXJ0UG9pbnRbMV0gPiBlbmRQb2ludFsxXSkge1xyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZFtzdGFydFBvaW50WzBdXVtzdGFydFBvaW50WzFdIC0gaV0uc2hpcCA9IHNoaXA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbc3RhcnRQb2ludFswXV1bc3RhcnRQb2ludFsxXSArIGldLnNoaXAgPSBzaGlwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoc3RhcnRQb2ludFswXSA+IGVuZFBvaW50WzBdKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkW3N0YXJ0UG9pbnRbMF0gLSBpXVtzdGFydFBvaW50WzFdXS5zaGlwID0gc2hpcDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZFtzdGFydFBvaW50WzBdICsgaV1bc3RhcnRQb2ludFsxXV0uc2hpcCA9IHNoaXA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWNlaXZlQXR0YWNrKGNvb3IpIHtcclxuICAgIGlmICghdGhpcy5ib2FyZFtjb29yWzBdXVtjb29yWzFdXS5oYXNBdHRhY2tlZCkge1xyXG4gICAgICB0aGlzLmJvYXJkW2Nvb3JbMF1dW2Nvb3JbMV1dLmhhc0F0dGFja2VkID0gdHJ1ZTtcclxuICAgICAgaWYgKHRoaXMuYm9hcmRbY29vclswXV1bY29vclsxXV0uc2hpcCkge1xyXG4gICAgICAgIHRoaXMuYm9hcmRbY29vclswXV1bY29vclsxXV0uc2hpcC5oaXQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNHYW1lT3ZlcigpIHtcclxuICAgIHJldHVybiB0aGlzLnNoaXBzLmV2ZXJ5KHNoaXAgPT4gc2hpcC5pc1N1bmsoKSk7XHJcbiAgfVxyXG5cclxuICByYW5kb21QbGFjZW1lbnQoKSB7XHJcbiAgICBjb25zdCBjaGVja1NxdWFyZSA9IChjb29yLCBmaWxsZWRDb29yKSA9PiB7XHJcbiAgICAgIGlmIChjb29yLnNvbWUoYyA9PiBmaWxsZWRDb29yLmluY2x1ZGVzKGMpKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBwaWNrUmFuZG9tWFkgPSAoKSA9PiB7XHJcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKSA9PT0gMCA/IFwieFwiIDogXCJ5XCI7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHBpY2tSYW5kb21OdW1iZXIgPSBsZW5ndGggPT4ge1xyXG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDEwIC0gbGVuZ3RoICsgMSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgZmlsbGVkQ29vciA9IFtdO1xyXG5cclxuICAgIGNvbnN0IHBsYWNlID0gKGxlbmd0aCwgZmlsbGVkQ29vcikgPT4ge1xyXG4gICAgICBsZXQgcmFuZG9tWDtcclxuICAgICAgbGV0IHJhbmRvbVk7XHJcbiAgICAgIGxldCBjb29yO1xyXG5cclxuICAgICAgZG8ge1xyXG4gICAgICAgIGNvb3IgPSBbXTtcclxuICAgICAgICBpZiAocGlja1JhbmRvbVhZKCkgPT09IFwieFwiKSB7XHJcbiAgICAgICAgICByYW5kb21YID0gcGlja1JhbmRvbU51bWJlcihsZW5ndGgpO1xyXG4gICAgICAgICAgcmFuZG9tWSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29vci5wdXNoKGAkeyhyYW5kb21YICsgaSkgJSAxMH0sICR7cmFuZG9tWX1gKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmFuZG9tWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcclxuICAgICAgICAgIHJhbmRvbVkgPSBwaWNrUmFuZG9tTnVtYmVyKGxlbmd0aCk7XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvb3IucHVzaChgJHtyYW5kb21YfSwgJHsocmFuZG9tWSArIGkpICUgMTB9YCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IHdoaWxlIChjaGVja1NxdWFyZShjb29yLCBmaWxsZWRDb29yKSk7XHJcblxyXG4gICAgICBmaWxsZWRDb29yID0gWy4uLmZpbGxlZENvb3IsIC4uLmNvb3JdO1xyXG4gICAgICBjb25zdCBwb3AgPSBjb29yLnBvcCgpO1xyXG4gICAgICBjb25zdCBzaGlmdCA9IGNvb3Iuc2hpZnQoKTtcclxuICAgICAgdGhpcy5wbGFjZVNoaXAoXHJcbiAgICAgICAgbGVuZ3RoLFxyXG4gICAgICAgIFtwb3AuY2hhckF0KDApLCBwb3AuY2hhckF0KDMpXSxcclxuICAgICAgICBbc2hpZnQuY2hhckF0KDApLCBzaGlmdC5jaGFyQXQoMyldXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiBmaWxsZWRDb29yO1xyXG4gICAgfTtcclxuXHJcbiAgICBmaWxsZWRDb29yID0gWy4uLnBsYWNlKDUsIGZpbGxlZENvb3IpXTtcclxuICAgIGZpbGxlZENvb3IgPSBbLi4ucGxhY2UoNCwgZmlsbGVkQ29vcildO1xyXG4gICAgZmlsbGVkQ29vciA9IFsuLi5wbGFjZSgzLCBmaWxsZWRDb29yKV07XHJcbiAgICBmaWxsZWRDb29yID0gWy4uLnBsYWNlKDIsIGZpbGxlZENvb3IpXTtcclxuICAgIHBsYWNlKDIsIGZpbGxlZENvb3IpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBwbGF5Um91bmQgfSBmcm9tIFwiLi9nYW1lXCI7XHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlQm9hcmRzID0gKHBsYXllckJvYXJkQXJyLCBhaUJvYXJkQXJyKSA9PiB7XHJcbiAgY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllci1ib2FyZFwiKTtcclxuICBjb25zdCBhaUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5haS1ib2FyZFwiKTtcclxuICBjb25zdCBwbGF5ZXJTcXVhcmVzID0gW107XHJcbiAgY29uc3QgYWlTcXVhcmVzID0gW107XHJcblxyXG4gIHBsYXllckJvYXJkQXJyLmZvckVhY2goY29sID0+IHtcclxuICAgIGNvbC5mb3JFYWNoKHNxID0+IHtcclxuICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoXCJzcXVhcmVcIik7XHJcbiAgICAgIHNxdWFyZS5kYXRhc2V0LmNvb3IgPSBzcS5jb29yO1xyXG4gICAgICBpZiAoc3Euc2hpcCkgc3F1YXJlLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xyXG4gICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSBzcS5jb29yO1xyXG4gICAgICBwbGF5ZXJTcXVhcmVzLnB1c2goc3F1YXJlKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBhaUJvYXJkQXJyLmZvckVhY2goY29sID0+IHtcclxuICAgIGNvbC5mb3JFYWNoKHNxID0+IHtcclxuICAgICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgc3F1YXJlLmNsYXNzTGlzdC5hZGQoXCJhaS1zcXVhcmVcIik7XHJcbiAgICAgIHNxdWFyZS5kYXRhc2V0LmNvb3IgPSBzcS5jb29yO1xyXG4gICAgICBpZiAoc3Euc2hpcCkgc3F1YXJlLmNsYXNzTGlzdC5hZGQoXCJhaS1zaGlwXCIpO1xyXG4gICAgICBzcXVhcmUudGV4dENvbnRlbnQgPSBzcS5jb29yO1xyXG4gICAgICBhaVNxdWFyZXMucHVzaChzcXVhcmUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHBsYXllckJvYXJkLnJlcGxhY2VDaGlsZHJlbiguLi5wbGF5ZXJTcXVhcmVzKTtcclxuICBhaUJvYXJkLnJlcGxhY2VDaGlsZHJlbiguLi5haVNxdWFyZXMpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHBsYXllckF0dGFjayA9IGUgPT4ge1xyXG4gIGNvbnN0IGF0dGFja2VkU3F1YXJlID0gZS50YXJnZXQ7XHJcbiAgaWYgKGF0dGFja2VkU3F1YXJlLmNsYXNzTGlzdC5jb250YWlucyhcImF0dGFja2VkXCIpKSByZXR1cm47XHJcbiAgYXR0YWNrZWRTcXVhcmUuY2xhc3NMaXN0LmFkZChcImF0dGFja2VkXCIpO1xyXG4gIGNvbnN0IHBsYXllciA9IGUuY3VycmVudFRhcmdldC5wYXJhbS5wbGF5ZXI7XHJcbiAgY29uc3QgYWkgPSBlLmN1cnJlbnRUYXJnZXQucGFyYW0uYWk7XHJcbiAgY29uc3QgY29vciA9IGF0dGFja2VkU3F1YXJlLmRhdGFzZXQuY29vcjtcclxuICBjb25zdCBjb29yQXJyID0gWytjb29yWzBdLCArY29vclsyXV07XHJcbiAgcGxheWVyLm1ha2VNb3ZlKGFpLCBjb29yQXJyKTtcclxuICBwbGF5Um91bmQocGxheWVyLCBhaSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgYWlBdHRhY2sgPSBjb29yID0+IHtcclxuICBjb25zdCBzdHJpbmdDb29yID0gY29vci5qb2luKFwiLFwiKTtcclxuICBjb25zdCBzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zcXVhcmVcIik7XHJcbiAgc3F1YXJlcy5mb3JFYWNoKHNxID0+IHtcclxuICAgIGlmIChzcS5kYXRhc2V0LmNvb3IgPT09IHN0cmluZ0Nvb3IpIHNxLmNsYXNzTGlzdC5hZGQoXCJhdHRhY2tlZFwiKTtcclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBoYW5kbGVNb2RhbCA9ICgpID0+IHtcclxuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWxcIik7XHJcbiAgbW9kYWwuc3R5bGUuZGlzcGxheSA9IG1vZGFsLnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiID8gXCJibG9ja1wiIDogXCJub25lXCI7XHJcbn07XHJcbiIsImltcG9ydCB7IEdhbWVib2FyZCB9IGZyb20gXCIuL2dhbWVib2FyZFwiO1xyXG5pbXBvcnQgeyBhaUF0dGFjayB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllciB7XHJcbiAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgIHRoaXMuZ2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xyXG4gICAgdGhpcy5pc1R1cm4gPSBuYW1lID09PSBcImFpXCIgPyBmYWxzZSA6IHRydWU7XHJcbiAgfVxyXG5cclxuICBtYWtlTW92ZShvcHBvbmVudCwgY29vciA9IG51bGwpIHtcclxuICAgIGlmIChjb29yKSBvcHBvbmVudC5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yKTtcclxuICAgIGVsc2UgdGhpcy5haU1vdmUob3Bwb25lbnQpO1xyXG4gICAgdGhpcy5pc1R1cm4gPSAhdGhpcy5pc1R1cm47XHJcbiAgICBvcHBvbmVudC5pc1R1cm4gPSAhb3Bwb25lbnQuaXNUdXJuO1xyXG4gIH1cclxuXHJcbiAgYWlNb3ZlKG9wcG9uZW50KSB7XHJcbiAgICBsZXQgcmFuZG9tWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcclxuICAgIGxldCByYW5kb21ZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xyXG4gICAgd2hpbGUgKG9wcG9uZW50LmdhbWVib2FyZC5ib2FyZFtyYW5kb21YXVtyYW5kb21ZXS5oYXNBdHRhY2tlZCkge1xyXG4gICAgICByYW5kb21YID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xyXG4gICAgICByYW5kb21ZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xyXG4gICAgfVxyXG4gICAgb3Bwb25lbnQuZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soW3JhbmRvbVgsIHJhbmRvbVldKTtcclxuICAgIGFpQXR0YWNrKFtyYW5kb21YLCByYW5kb21ZXSk7XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBTaGlwIHtcclxuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcclxuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgdGhpcy5udW1iZXJPZkhpdHMgPSAwO1xyXG4gIH1cclxuXHJcbiAgaGl0KCkge1xyXG4gICAgaWYgKCF0aGlzLmlzU3VuaygpKSB0aGlzLm51bWJlck9mSGl0cysrO1xyXG4gIH1cclxuXHJcbiAgaXNTdW5rKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoID09PSB0aGlzLm51bWJlck9mSGl0cztcclxuICB9XHJcbn1cclxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIqIHtcXHJcXG4gIHBhZGRpbmc6IDA7XFxyXFxuICBtYXJnaW46IDA7XFxyXFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbiAgZm9udC1zaXplOiAxNnB4O1xcclxcbn1cXHJcXG5cXHJcXG4uY29udGVudCB7XFxyXFxuICBoZWlnaHQ6IDEwMHZoO1xcclxcbiAgZGlzcGxheTogZ3JpZDtcXHJcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDNmcjtcXHJcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXHJcXG4gIHBhZGRpbmc6IDY0cHg7XFxyXFxuICBnYXA6IDE2cHg7XFxyXFxufVxcclxcblxcclxcbi5oZWFkZXIge1xcclxcbiAgZ3JpZC1yb3c6IDEvMjtcXHJcXG4gIGdyaWQtY29sdW1uOiAxLzM7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgZm9udC1zaXplOiAzcmVtO1xcclxcbn1cXHJcXG5cXHJcXG4ucGxheWVyLWJvYXJkLFxcclxcbi5haS1ib2FyZCB7XFxyXFxuICBncmlkLXJvdzogMi8zO1xcclxcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICB3aWR0aDogNzAlO1xcclxcbiAgYXNwZWN0LXJhdGlvOiAxLzE7XFxyXFxuICBqdXN0aWZ5LXNlbGY6IGNlbnRlcjtcXHJcXG4gIGRpc3BsYXk6IGdyaWQ7XFxyXFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMWZyKTtcXHJcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAxZnIpO1xcclxcbn1cXHJcXG5cXHJcXG4ucGxheWVyLWJvYXJkIHtcXHJcXG4gIGdyaWQtY29sdW1uOiAxLzI7XFxyXFxufVxcclxcblxcclxcbi5haS1ib2FyZCB7XFxyXFxuICBncmlkLWNvbHVtbjogMi8zO1xcclxcbn1cXHJcXG5cXHJcXG4uc3F1YXJlLFxcclxcbi5haS1zcXVhcmUge1xcclxcbiAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBzdGVlbGJsdWU7XFxyXFxufVxcclxcblxcclxcbi5haS1zcXVhcmUuYWktc2hpcCxcXHJcXG4uc3F1YXJlLnNoaXAge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogZ3JheTtcXHJcXG59XFxyXFxuXFxyXFxuLnNxdWFyZS5hdHRhY2tlZCxcXHJcXG4uYWktc3F1YXJlLmF0dGFja2VkIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IGdyZWVuO1xcclxcbn1cXHJcXG5cXHJcXG4uYWktc3F1YXJlLmFpLXNoaXAuYXR0YWNrZWQsXFxyXFxuLnNxdWFyZS5zaGlwLmF0dGFja2VkIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHJlZDtcXHJcXG59XFxyXFxuXFxyXFxuLm1vZGFsIHtcXHJcXG4gIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgcG9zaXRpb246IGZpeGVkO1xcclxcbiAgei1pbmRleDogMTtcXHJcXG4gIGxlZnQ6IDA7XFxyXFxuICB0b3A6IDA7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIGhlaWdodDogMTAwJTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC40KTtcXHJcXG59XFxyXFxuXCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLFVBQVU7RUFDVixTQUFTO0VBQ1Qsc0JBQXNCO0VBQ3RCLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsYUFBYTtFQUNiLDJCQUEyQjtFQUMzQiw4QkFBOEI7RUFDOUIsYUFBYTtFQUNiLFNBQVM7QUFDWDs7QUFFQTtFQUNFLGFBQWE7RUFDYixnQkFBZ0I7RUFDaEIsYUFBYTtFQUNiLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsZUFBZTtBQUNqQjs7QUFFQTs7RUFFRSxhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLFVBQVU7RUFDVixpQkFBaUI7RUFDakIsb0JBQW9CO0VBQ3BCLGFBQWE7RUFDYixzQ0FBc0M7RUFDdEMsbUNBQW1DO0FBQ3JDOztBQUVBO0VBQ0UsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsZ0JBQWdCO0FBQ2xCOztBQUVBOztFQUVFLHVCQUF1QjtFQUN2QiwyQkFBMkI7QUFDN0I7O0FBRUE7O0VBRUUsc0JBQXNCO0FBQ3hCOztBQUVBOztFQUVFLHVCQUF1QjtBQUN6Qjs7QUFFQTs7RUFFRSxxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsZUFBZTtFQUNmLFVBQVU7RUFDVixPQUFPO0VBQ1AsTUFBTTtFQUNOLFdBQVc7RUFDWCxZQUFZO0VBQ1osb0NBQW9DO0FBQ3RDXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIioge1xcclxcbiAgcGFkZGluZzogMDtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICBmb250LXNpemU6IDE2cHg7XFxyXFxufVxcclxcblxcclxcbi5jb250ZW50IHtcXHJcXG4gIGhlaWdodDogMTAwdmg7XFxyXFxuICBkaXNwbGF5OiBncmlkO1xcclxcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgM2ZyO1xcclxcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xcclxcbiAgcGFkZGluZzogNjRweDtcXHJcXG4gIGdhcDogMTZweDtcXHJcXG59XFxyXFxuXFxyXFxuLmhlYWRlciB7XFxyXFxuICBncmlkLXJvdzogMS8yO1xcclxcbiAgZ3JpZC1jb2x1bW46IDEvMztcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICBmb250LXNpemU6IDNyZW07XFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXItYm9hcmQsXFxyXFxuLmFpLWJvYXJkIHtcXHJcXG4gIGdyaWQtcm93OiAyLzM7XFxyXFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gIHdpZHRoOiA3MCU7XFxyXFxuICBhc3BlY3QtcmF0aW86IDEvMTtcXHJcXG4gIGp1c3RpZnktc2VsZjogY2VudGVyO1xcclxcbiAgZGlzcGxheTogZ3JpZDtcXHJcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxZnIpO1xcclxcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDFmcik7XFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXItYm9hcmQge1xcclxcbiAgZ3JpZC1jb2x1bW46IDEvMjtcXHJcXG59XFxyXFxuXFxyXFxuLmFpLWJvYXJkIHtcXHJcXG4gIGdyaWQtY29sdW1uOiAyLzM7XFxyXFxufVxcclxcblxcclxcbi5zcXVhcmUsXFxyXFxuLmFpLXNxdWFyZSB7XFxyXFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHN0ZWVsYmx1ZTtcXHJcXG59XFxyXFxuXFxyXFxuLmFpLXNxdWFyZS5haS1zaGlwLFxcclxcbi5zcXVhcmUuc2hpcCB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmF5O1xcclxcbn1cXHJcXG5cXHJcXG4uc3F1YXJlLmF0dGFja2VkLFxcclxcbi5haS1zcXVhcmUuYXR0YWNrZWQge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XFxyXFxufVxcclxcblxcclxcbi5haS1zcXVhcmUuYWktc2hpcC5hdHRhY2tlZCxcXHJcXG4uc3F1YXJlLnNoaXAuYXR0YWNrZWQge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xcclxcbn1cXHJcXG5cXHJcXG4ubW9kYWwge1xcclxcbiAgZGlzcGxheTogYmxvY2s7XFxyXFxuICBwb3NpdGlvbjogZml4ZWQ7XFxyXFxuICB6LWluZGV4OiAxO1xcclxcbiAgbGVmdDogMDtcXHJcXG4gIHRvcDogMDtcXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbiAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjQpO1xcclxcbn1cXHJcXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IHsgZ2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcclxuaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcclxuXHJcbmNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFydC1idG5cIik7XHJcbnN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBnYW1lKTtcclxuIl0sIm5hbWVzIjpbImNyZWF0ZUJvYXJkcyIsImhhbmRsZU1vZGFsIiwicGxheWVyQXR0YWNrIiwiUGxheWVyIiwiZ2FtZSIsInBsYXllciIsImFpIiwiZ2FtZWJvYXJkIiwicmFuZG9tUGxhY2VtZW50IiwiYm9hcmQiLCJwbGF5Um91bmQiLCJpc0dhbWVPdmVyIiwiZW5kR2FtZSIsImlzVHVybiIsImFpQm9hcmQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJwYXJhbSIsImFkZEV2ZW50TGlzdGVuZXIiLCJtYWtlTW92ZSIsIndpbm5lciIsImd1aWRlIiwidGV4dENvbnRlbnQiLCJuYW1lIiwiU2hpcCIsIkdhbWVib2FyZCIsImNvbnN0cnVjdG9yIiwiY3JlYXRlQm9hcmQiLCJzaGlwcyIsImkiLCJqIiwiY29vciIsInNoaXAiLCJoYXNBdHRhY2tlZCIsImNyZWF0ZVNoaXAiLCJzaGlwTGVuZ3RoIiwicHVzaCIsInBsYWNlU2hpcCIsInN0YXJ0UG9pbnQiLCJlbmRQb2ludCIsInJlY2VpdmVBdHRhY2siLCJoaXQiLCJldmVyeSIsImlzU3VuayIsImNoZWNrU3F1YXJlIiwiZmlsbGVkQ29vciIsInNvbWUiLCJjIiwiaW5jbHVkZXMiLCJwaWNrUmFuZG9tWFkiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJwaWNrUmFuZG9tTnVtYmVyIiwibGVuZ3RoIiwicGxhY2UiLCJyYW5kb21YIiwicmFuZG9tWSIsInBvcCIsInNoaWZ0IiwiY2hhckF0IiwicGxheWVyQm9hcmRBcnIiLCJhaUJvYXJkQXJyIiwicGxheWVyQm9hcmQiLCJwbGF5ZXJTcXVhcmVzIiwiYWlTcXVhcmVzIiwiZm9yRWFjaCIsImNvbCIsInNxIiwic3F1YXJlIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImRhdGFzZXQiLCJyZXBsYWNlQ2hpbGRyZW4iLCJlIiwiYXR0YWNrZWRTcXVhcmUiLCJ0YXJnZXQiLCJjb250YWlucyIsImN1cnJlbnRUYXJnZXQiLCJjb29yQXJyIiwiYWlBdHRhY2siLCJzdHJpbmdDb29yIiwiam9pbiIsInNxdWFyZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwibW9kYWwiLCJzdHlsZSIsImRpc3BsYXkiLCJvcHBvbmVudCIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImFpTW92ZSIsIm51bWJlck9mSGl0cyIsInN0YXJ0QnRuIl0sInNvdXJjZVJvb3QiOiIifQ==