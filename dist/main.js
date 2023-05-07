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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7QUNBOEI7QUFDVDtBQUVyQixNQUFNQyxRQUFRLEdBQUduRSxRQUFRLENBQUNDLGFBQWEsQ0FBQyxZQUFZLENBQUM7QUFDckRrRSxRQUFRLENBQUNoRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUVkLHVDQUFJLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ludGVyZmFjZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUJvYXJkcywgaGFuZGxlTW9kYWwsIHBsYXllckF0dGFjayB9IGZyb20gXCIuL2ludGVyZmFjZVwiO1xyXG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBnYW1lID0gKCkgPT4ge1xyXG4gIGNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIoXCJwbGF5ZXJcIik7XHJcbiAgY29uc3QgYWkgPSBuZXcgUGxheWVyKFwiYWlcIik7XHJcblxyXG4gIC8vIGNoYW5nZSBwbGFjZW1lbnQgbGF0ZXJcclxuICBwbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcCgyLCBbOSwgOF0sIFs4LCA4XSk7XHJcbiAgcGxheWVyLmdhbWVib2FyZC5wbGFjZVNoaXAoMywgWzEsIDhdLCBbMywgOF0pO1xyXG4gIHBsYXllci5nYW1lYm9hcmQucGxhY2VTaGlwKDMsIFs2LCAxXSwgWzYsIDNdKTtcclxuICBwbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcCg0LCBbMSwgMV0sIFsxLCA0XSk7XHJcbiAgcGxheWVyLmdhbWVib2FyZC5wbGFjZVNoaXAoNSwgWzQsIDZdLCBbOCwgNl0pO1xyXG4gIGFpLmdhbWVib2FyZC5wbGFjZVNoaXAoMiwgWzcsIDddLCBbNywgOF0pO1xyXG4gIGFpLmdhbWVib2FyZC5wbGFjZVNoaXAoMywgWzIsIDFdLCBbMiwgM10pO1xyXG4gIGFpLmdhbWVib2FyZC5wbGFjZVNoaXAoMywgWzQsIDRdLCBbNiwgNF0pO1xyXG4gIGFpLmdhbWVib2FyZC5wbGFjZVNoaXAoNCwgWzEsIDddLCBbNCwgN10pO1xyXG4gIGFpLmdhbWVib2FyZC5wbGFjZVNoaXAoNSwgWzgsIDFdLCBbOCwgNV0pO1xyXG5cclxuICBjcmVhdGVCb2FyZHMocGxheWVyLmdhbWVib2FyZC5ib2FyZCwgYWkuZ2FtZWJvYXJkLmJvYXJkKTtcclxuICBoYW5kbGVNb2RhbCgpO1xyXG4gIHBsYXlSb3VuZChwbGF5ZXIsIGFpKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBwbGF5Um91bmQgPSAocGxheWVyLCBhaSkgPT4ge1xyXG4gIGlmIChwbGF5ZXIuZ2FtZWJvYXJkLmlzR2FtZU92ZXIoKSkgZW5kR2FtZShhaSk7XHJcbiAgaWYgKGFpLmdhbWVib2FyZC5pc0dhbWVPdmVyKCkpIGVuZEdhbWUocGxheWVyKTtcclxuICBpZiAocGxheWVyLmlzVHVybikge1xyXG4gICAgY29uc3QgYWlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWktYm9hcmRcIik7XHJcbiAgICBhaUJvYXJkLnBhcmFtID0geyBwbGF5ZXIsIGFpIH07XHJcbiAgICBhaUJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwbGF5ZXJBdHRhY2spO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBhaS5tYWtlTW92ZShwbGF5ZXIpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGVuZEdhbWUgPSB3aW5uZXIgPT4ge1xyXG4gIGhhbmRsZU1vZGFsKCk7XHJcbiAgLy8gIVRPRE8gdGhpbmsgbW9yZSBhcHByb3ByaWF0ZSB3aW4gbWVzc2FnZSBmb3IgZG9tLlxyXG4gIGNvbnN0IGd1aWRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ndWlkZVwiKTtcclxuICBndWlkZS50ZXh0Q29udGVudCA9IGAke3dpbm5lci5uYW1lfSB3b24hYDtcclxufTtcclxuIiwiaW1wb3J0IHsgU2hpcCB9IGZyb20gXCIuL3NoaXBcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lYm9hcmQge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5ib2FyZCA9IHRoaXMuY3JlYXRlQm9hcmQoKTtcclxuICAgIHRoaXMuc2hpcHMgPSBbXTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUJvYXJkKCkge1xyXG4gICAgY29uc3QgYm9hcmQgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xyXG4gICAgICBib2FyZFtpXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcclxuICAgICAgICBib2FyZFtpXVtqXSA9IHsgY29vcjogW2ksIGpdLCBzaGlwOiBmYWxzZSwgaGFzQXR0YWNrZWQ6IGZhbHNlIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBib2FyZDtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVNoaXAoc2hpcExlbmd0aCkge1xyXG4gICAgbGV0IHNoaXA7XHJcbiAgICBzd2l0Y2ggKHNoaXBMZW5ndGgpIHtcclxuICAgICAgY2FzZSA1OlxyXG4gICAgICAgIHNoaXAgPSBuZXcgU2hpcCg1KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSA0OlxyXG4gICAgICAgIHNoaXAgPSBuZXcgU2hpcCg0KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAzOlxyXG4gICAgICAgIHNoaXAgPSBuZXcgU2hpcCgzKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHNoaXAgPSBuZXcgU2hpcCgyKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHRoaXMuc2hpcHMucHVzaChzaGlwKTtcclxuICAgIHJldHVybiBzaGlwO1xyXG4gIH1cclxuXHJcbiAgcGxhY2VTaGlwKHNoaXBMZW5ndGgsIHN0YXJ0UG9pbnQsIGVuZFBvaW50KSB7XHJcbiAgICBjb25zdCBzaGlwID0gdGhpcy5jcmVhdGVTaGlwKHNoaXBMZW5ndGgpO1xyXG4gICAgaWYgKHNoaXBMZW5ndGggPT09IDIpIHtcclxuICAgICAgdGhpcy5ib2FyZFtzdGFydFBvaW50WzBdXVtzdGFydFBvaW50WzFdXS5zaGlwID0gc2hpcDtcclxuICAgICAgdGhpcy5ib2FyZFtlbmRQb2ludFswXV1bZW5kUG9pbnRbMV1dLnNoaXAgPSBzaGlwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHN0YXJ0UG9pbnRbMF0gPT09IGVuZFBvaW50WzBdKSB7XHJcbiAgICAgICAgaWYgKHN0YXJ0UG9pbnRbMV0gPiBlbmRQb2ludFsxXSkge1xyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZFtzdGFydFBvaW50WzBdXVtzdGFydFBvaW50WzFdIC0gaV0uc2hpcCA9IHNoaXA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbc3RhcnRQb2ludFswXV1bc3RhcnRQb2ludFsxXSArIGldLnNoaXAgPSBzaGlwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoc3RhcnRQb2ludFswXSA+IGVuZFBvaW50WzBdKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmJvYXJkW3N0YXJ0UG9pbnRbMF0gLSBpXVtzdGFydFBvaW50WzFdXS5zaGlwID0gc2hpcDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5ib2FyZFtzdGFydFBvaW50WzBdICsgaV1bc3RhcnRQb2ludFsxXV0uc2hpcCA9IHNoaXA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWNlaXZlQXR0YWNrKGNvb3IpIHtcclxuICAgIGlmICghdGhpcy5ib2FyZFtjb29yWzBdXVtjb29yWzFdXS5oYXNBdHRhY2tlZCkge1xyXG4gICAgICB0aGlzLmJvYXJkW2Nvb3JbMF1dW2Nvb3JbMV1dLmhhc0F0dGFja2VkID0gdHJ1ZTtcclxuICAgICAgaWYgKHRoaXMuYm9hcmRbY29vclswXV1bY29vclsxXV0uc2hpcCkge1xyXG4gICAgICAgIHRoaXMuYm9hcmRbY29vclswXV1bY29vclsxXV0uc2hpcC5oaXQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNHYW1lT3ZlcigpIHtcclxuICAgIHJldHVybiB0aGlzLnNoaXBzLmV2ZXJ5KHNoaXAgPT4gc2hpcC5pc1N1bmsoKSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IHBsYXlSb3VuZCB9IGZyb20gXCIuL2dhbWVcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVCb2FyZHMgPSAocGxheWVyQm9hcmRBcnIsIGFpQm9hcmRBcnIpID0+IHtcclxuICBjb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLWJvYXJkXCIpO1xyXG4gIGNvbnN0IGFpQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFpLWJvYXJkXCIpO1xyXG4gIGNvbnN0IHBsYXllclNxdWFyZXMgPSBbXTtcclxuICBjb25zdCBhaVNxdWFyZXMgPSBbXTtcclxuXHJcbiAgcGxheWVyQm9hcmRBcnIuZm9yRWFjaChjb2wgPT4ge1xyXG4gICAgY29sLmZvckVhY2goc3EgPT4ge1xyXG4gICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZChcInNxdWFyZVwiKTtcclxuICAgICAgc3F1YXJlLmRhdGFzZXQuY29vciA9IHNxLmNvb3I7XHJcbiAgICAgIGlmIChzcS5zaGlwKSBzcXVhcmUuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XHJcbiAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9IHNxLmNvb3I7XHJcbiAgICAgIHBsYXllclNxdWFyZXMucHVzaChzcXVhcmUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGFpQm9hcmRBcnIuZm9yRWFjaChjb2wgPT4ge1xyXG4gICAgY29sLmZvckVhY2goc3EgPT4ge1xyXG4gICAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZChcImFpLXNxdWFyZVwiKTtcclxuICAgICAgc3F1YXJlLmRhdGFzZXQuY29vciA9IHNxLmNvb3I7XHJcbiAgICAgIGlmIChzcS5zaGlwKSBzcXVhcmUuY2xhc3NMaXN0LmFkZChcImFpLXNoaXBcIik7XHJcbiAgICAgIHNxdWFyZS50ZXh0Q29udGVudCA9IHNxLmNvb3I7XHJcbiAgICAgIGFpU3F1YXJlcy5wdXNoKHNxdWFyZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgcGxheWVyQm9hcmQucmVwbGFjZUNoaWxkcmVuKC4uLnBsYXllclNxdWFyZXMpO1xyXG4gIGFpQm9hcmQucmVwbGFjZUNoaWxkcmVuKC4uLmFpU3F1YXJlcyk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcGxheWVyQXR0YWNrID0gZSA9PiB7XHJcbiAgY29uc3QgYXR0YWNrZWRTcXVhcmUgPSBlLnRhcmdldDtcclxuICBpZiAoYXR0YWNrZWRTcXVhcmUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYXR0YWNrZWRcIikpIHJldHVybjtcclxuICBhdHRhY2tlZFNxdWFyZS5jbGFzc0xpc3QuYWRkKFwiYXR0YWNrZWRcIik7XHJcbiAgY29uc3QgcGxheWVyID0gZS5jdXJyZW50VGFyZ2V0LnBhcmFtLnBsYXllcjtcclxuICBjb25zdCBhaSA9IGUuY3VycmVudFRhcmdldC5wYXJhbS5haTtcclxuICBjb25zdCBjb29yID0gYXR0YWNrZWRTcXVhcmUuZGF0YXNldC5jb29yO1xyXG4gIGNvbnN0IGNvb3JBcnIgPSBbK2Nvb3JbMF0sICtjb29yWzJdXTtcclxuICBwbGF5ZXIubWFrZU1vdmUoYWksIGNvb3JBcnIpO1xyXG4gIHBsYXlSb3VuZChwbGF5ZXIsIGFpKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBhaUF0dGFjayA9IGNvb3IgPT4ge1xyXG4gIGNvbnN0IHN0cmluZ0Nvb3IgPSBjb29yLmpvaW4oXCIsXCIpO1xyXG4gIGNvbnN0IHNxdWFyZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnNxdWFyZVwiKTtcclxuICBzcXVhcmVzLmZvckVhY2goc3EgPT4ge1xyXG4gICAgaWYgKHNxLmRhdGFzZXQuY29vciA9PT0gc3RyaW5nQ29vcikgc3EuY2xhc3NMaXN0LmFkZChcImF0dGFja2VkXCIpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGhhbmRsZU1vZGFsID0gKCkgPT4ge1xyXG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbFwiKTtcclxuICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gbW9kYWwuc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIgPyBcImJsb2NrXCIgOiBcIm5vbmVcIjtcclxufTtcclxuIiwiaW1wb3J0IHsgR2FtZWJvYXJkIH0gZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XHJcbmltcG9ydCB7IGFpQXR0YWNrIH0gZnJvbSBcIi4vaW50ZXJmYWNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUGxheWVyIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgdGhpcy5nYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XHJcbiAgICB0aGlzLmlzVHVybiA9IG5hbWUgPT09IFwiYWlcIiA/IGZhbHNlIDogdHJ1ZTtcclxuICB9XHJcblxyXG4gIG1ha2VNb3ZlKG9wcG9uZW50LCBjb29yID0gbnVsbCkge1xyXG4gICAgaWYgKGNvb3IpIG9wcG9uZW50LmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKGNvb3IpO1xyXG4gICAgZWxzZSB0aGlzLmFpTW92ZShvcHBvbmVudCk7XHJcbiAgICB0aGlzLmlzVHVybiA9ICF0aGlzLmlzVHVybjtcclxuICAgIG9wcG9uZW50LmlzVHVybiA9ICFvcHBvbmVudC5pc1R1cm47XHJcbiAgfVxyXG5cclxuICBhaU1vdmUob3Bwb25lbnQpIHtcclxuICAgIGxldCByYW5kb21YID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xyXG4gICAgbGV0IHJhbmRvbVkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XHJcbiAgICB3aGlsZSAob3Bwb25lbnQuZ2FtZWJvYXJkLmJvYXJkW3JhbmRvbVhdW3JhbmRvbVldLmhhc0F0dGFja2VkKSB7XHJcbiAgICAgIHJhbmRvbVggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XHJcbiAgICAgIHJhbmRvbVkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XHJcbiAgICB9XHJcbiAgICBvcHBvbmVudC5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhbcmFuZG9tWCwgcmFuZG9tWV0pO1xyXG4gICAgYWlBdHRhY2soW3JhbmRvbVgsIHJhbmRvbVldKTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFNoaXAge1xyXG4gIGNvbnN0cnVjdG9yKGxlbmd0aCkge1xyXG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICB0aGlzLm51bWJlck9mSGl0cyA9IDA7XHJcbiAgfVxyXG5cclxuICBoaXQoKSB7XHJcbiAgICBpZiAoIXRoaXMuaXNTdW5rKCkpIHRoaXMubnVtYmVyT2ZIaXRzKys7XHJcbiAgfVxyXG5cclxuICBpc1N1bmsoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggPT09IHRoaXMubnVtYmVyT2ZIaXRzO1xyXG4gIH1cclxufVxyXG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIioge1xcclxcbiAgcGFkZGluZzogMDtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICBmb250LXNpemU6IDE2cHg7XFxyXFxufVxcclxcblxcclxcbi5jb250ZW50IHtcXHJcXG4gIGhlaWdodDogMTAwdmg7XFxyXFxuICBkaXNwbGF5OiBncmlkO1xcclxcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgM2ZyO1xcclxcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xcclxcbiAgcGFkZGluZzogNjRweDtcXHJcXG4gIGdhcDogMTZweDtcXHJcXG59XFxyXFxuXFxyXFxuLmhlYWRlciB7XFxyXFxuICBncmlkLXJvdzogMS8yO1xcclxcbiAgZ3JpZC1jb2x1bW46IDEvMztcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICBmb250LXNpemU6IDNyZW07XFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXItYm9hcmQsXFxyXFxuLmFpLWJvYXJkIHtcXHJcXG4gIGdyaWQtcm93OiAyLzM7XFxyXFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gIHdpZHRoOiA3MCU7XFxyXFxuICBhc3BlY3QtcmF0aW86IDEvMTtcXHJcXG4gIGp1c3RpZnktc2VsZjogY2VudGVyO1xcclxcbiAgZGlzcGxheTogZ3JpZDtcXHJcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxZnIpO1xcclxcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDFmcik7XFxyXFxufVxcclxcblxcclxcbi5wbGF5ZXItYm9hcmQge1xcclxcbiAgZ3JpZC1jb2x1bW46IDEvMjtcXHJcXG59XFxyXFxuXFxyXFxuLmFpLWJvYXJkIHtcXHJcXG4gIGdyaWQtY29sdW1uOiAyLzM7XFxyXFxufVxcclxcblxcclxcbi5zcXVhcmUsXFxyXFxuLmFpLXNxdWFyZSB7XFxyXFxuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHN0ZWVsYmx1ZTtcXHJcXG59XFxyXFxuXFxyXFxuLmFpLXNxdWFyZS5haS1zaGlwLFxcclxcbi5zcXVhcmUuc2hpcCB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmF5O1xcclxcbn1cXHJcXG5cXHJcXG4uc3F1YXJlLmF0dGFja2VkLFxcclxcbi5haS1zcXVhcmUuYXR0YWNrZWQge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XFxyXFxufVxcclxcblxcclxcbi5haS1zcXVhcmUuYWktc2hpcC5hdHRhY2tlZCxcXHJcXG4uc3F1YXJlLnNoaXAuYXR0YWNrZWQge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xcclxcbn1cXHJcXG5cXHJcXG4ubW9kYWwge1xcclxcbiAgZGlzcGxheTogYmxvY2s7XFxyXFxuICBwb3NpdGlvbjogZml4ZWQ7XFxyXFxuICB6LWluZGV4OiAxO1xcclxcbiAgbGVmdDogMDtcXHJcXG4gIHRvcDogMDtcXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbiAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjQpO1xcclxcbn1cXHJcXG5cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsVUFBVTtFQUNWLFNBQVM7RUFDVCxzQkFBc0I7RUFDdEIsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixhQUFhO0VBQ2IsMkJBQTJCO0VBQzNCLDhCQUE4QjtFQUM5QixhQUFhO0VBQ2IsU0FBUztBQUNYOztBQUVBO0VBQ0UsYUFBYTtFQUNiLGdCQUFnQjtFQUNoQixhQUFhO0VBQ2IsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtFQUNuQixlQUFlO0FBQ2pCOztBQUVBOztFQUVFLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsVUFBVTtFQUNWLGlCQUFpQjtFQUNqQixvQkFBb0I7RUFDcEIsYUFBYTtFQUNiLHNDQUFzQztFQUN0QyxtQ0FBbUM7QUFDckM7O0FBRUE7RUFDRSxnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxnQkFBZ0I7QUFDbEI7O0FBRUE7O0VBRUUsdUJBQXVCO0VBQ3ZCLDJCQUEyQjtBQUM3Qjs7QUFFQTs7RUFFRSxzQkFBc0I7QUFDeEI7O0FBRUE7O0VBRUUsdUJBQXVCO0FBQ3pCOztBQUVBOztFQUVFLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGNBQWM7RUFDZCxlQUFlO0VBQ2YsVUFBVTtFQUNWLE9BQU87RUFDUCxNQUFNO0VBQ04sV0FBVztFQUNYLFlBQVk7RUFDWixvQ0FBb0M7QUFDdENcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKiB7XFxyXFxuICBwYWRkaW5nOiAwO1xcclxcbiAgbWFyZ2luOiAwO1xcclxcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gIGZvbnQtc2l6ZTogMTZweDtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbnRlbnQge1xcclxcbiAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gIGRpc3BsYXk6IGdyaWQ7XFxyXFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmciAzZnI7XFxyXFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxyXFxuICBwYWRkaW5nOiA2NHB4O1xcclxcbiAgZ2FwOiAxNnB4O1xcclxcbn1cXHJcXG5cXHJcXG4uaGVhZGVyIHtcXHJcXG4gIGdyaWQtcm93OiAxLzI7XFxyXFxuICBncmlkLWNvbHVtbjogMS8zO1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gIGZvbnQtc2l6ZTogM3JlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllci1ib2FyZCxcXHJcXG4uYWktYm9hcmQge1xcclxcbiAgZ3JpZC1yb3c6IDIvMztcXHJcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgd2lkdGg6IDcwJTtcXHJcXG4gIGFzcGVjdC1yYXRpbzogMS8xO1xcclxcbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XFxyXFxuICBkaXNwbGF5OiBncmlkO1xcclxcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDFmcik7XFxyXFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMWZyKTtcXHJcXG59XFxyXFxuXFxyXFxuLnBsYXllci1ib2FyZCB7XFxyXFxuICBncmlkLWNvbHVtbjogMS8yO1xcclxcbn1cXHJcXG5cXHJcXG4uYWktYm9hcmQge1xcclxcbiAgZ3JpZC1jb2x1bW46IDIvMztcXHJcXG59XFxyXFxuXFxyXFxuLnNxdWFyZSxcXHJcXG4uYWktc3F1YXJlIHtcXHJcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogc3RlZWxibHVlO1xcclxcbn1cXHJcXG5cXHJcXG4uYWktc3F1YXJlLmFpLXNoaXAsXFxyXFxuLnNxdWFyZS5zaGlwIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IGdyYXk7XFxyXFxufVxcclxcblxcclxcbi5zcXVhcmUuYXR0YWNrZWQsXFxyXFxuLmFpLXNxdWFyZS5hdHRhY2tlZCB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbjtcXHJcXG59XFxyXFxuXFxyXFxuLmFpLXNxdWFyZS5haS1zaGlwLmF0dGFja2VkLFxcclxcbi5zcXVhcmUuc2hpcC5hdHRhY2tlZCB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XFxyXFxufVxcclxcblxcclxcbi5tb2RhbCB7XFxyXFxuICBkaXNwbGF5OiBibG9jaztcXHJcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gIHotaW5kZXg6IDE7XFxyXFxuICBsZWZ0OiAwO1xcclxcbiAgdG9wOiAwO1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICBoZWlnaHQ6IDEwMCU7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNCk7XFxyXFxufVxcclxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgeyBnYW1lIH0gZnJvbSBcIi4vZ2FtZVwiO1xyXG5pbXBvcnQgXCIuL3N0eWxlLmNzc1wiO1xyXG5cclxuY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0LWJ0blwiKTtcclxuc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGdhbWUpO1xyXG4iXSwibmFtZXMiOlsiY3JlYXRlQm9hcmRzIiwiaGFuZGxlTW9kYWwiLCJwbGF5ZXJBdHRhY2siLCJQbGF5ZXIiLCJnYW1lIiwicGxheWVyIiwiYWkiLCJnYW1lYm9hcmQiLCJwbGFjZVNoaXAiLCJib2FyZCIsInBsYXlSb3VuZCIsImlzR2FtZU92ZXIiLCJlbmRHYW1lIiwiaXNUdXJuIiwiYWlCb2FyZCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInBhcmFtIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm1ha2VNb3ZlIiwid2lubmVyIiwiZ3VpZGUiLCJ0ZXh0Q29udGVudCIsIm5hbWUiLCJTaGlwIiwiR2FtZWJvYXJkIiwiY29uc3RydWN0b3IiLCJjcmVhdGVCb2FyZCIsInNoaXBzIiwiaSIsImoiLCJjb29yIiwic2hpcCIsImhhc0F0dGFja2VkIiwiY3JlYXRlU2hpcCIsInNoaXBMZW5ndGgiLCJwdXNoIiwic3RhcnRQb2ludCIsImVuZFBvaW50IiwicmVjZWl2ZUF0dGFjayIsImhpdCIsImV2ZXJ5IiwiaXNTdW5rIiwicGxheWVyQm9hcmRBcnIiLCJhaUJvYXJkQXJyIiwicGxheWVyQm9hcmQiLCJwbGF5ZXJTcXVhcmVzIiwiYWlTcXVhcmVzIiwiZm9yRWFjaCIsImNvbCIsInNxIiwic3F1YXJlIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImRhdGFzZXQiLCJyZXBsYWNlQ2hpbGRyZW4iLCJlIiwiYXR0YWNrZWRTcXVhcmUiLCJ0YXJnZXQiLCJjb250YWlucyIsImN1cnJlbnRUYXJnZXQiLCJjb29yQXJyIiwiYWlBdHRhY2siLCJzdHJpbmdDb29yIiwiam9pbiIsInNxdWFyZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwibW9kYWwiLCJzdHlsZSIsImRpc3BsYXkiLCJvcHBvbmVudCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImFpTW92ZSIsInJhbmRvbVgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJyYW5kb21ZIiwibnVtYmVyT2ZIaXRzIiwic3RhcnRCdG4iXSwic291cmNlUm9vdCI6IiJ9