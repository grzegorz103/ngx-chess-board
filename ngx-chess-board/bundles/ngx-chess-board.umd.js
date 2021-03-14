(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/drag-drop'), require('@angular/common'), require('@angular/core'), require('rxjs'), require('lodash')) :
    typeof define === 'function' && define.amd ? define('ngx-chess-board', ['exports', '@angular/cdk/drag-drop', '@angular/common', '@angular/core', 'rxjs', 'lodash'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ngx-chess-board'] = {}, global.ng.cdk.dragDrop, global.ng.common, global.ng.core, global.rxjs, global.lodash));
}(this, (function (exports, i4, i2, i0, rxjs, lodash) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    var Color;
    (function (Color) {
        Color[Color["WHITE"] = 0] = "WHITE";
        Color[Color["BLACK"] = 1] = "BLACK";
    })(Color || (Color = {}));

    var Piece = /** @class */ (function () {
        function Piece(point, color, constant, relValue, board) {
            this.checkPoints = [];
            this.color = color;
            this.constant = constant;
            this.point = point;
            this.relValue = relValue;
            this.board = board;
        }
        return Piece;
    }());

    var Point = /** @class */ (function () {
        function Point(row, col) {
            this.row = row;
            this.col = col;
        }
        Point.prototype.isEqual = function (that) {
            return that && this.row === that.row && this.col === that.col;
        };
        Point.prototype.hasCoordsEqual = function (row, col) {
            return row && col && this.row === row && this.col === col;
        };
        return Point;
    }());

    var Rook = /** @class */ (function (_super) {
        __extends(Rook, _super);
        function Rook(point, color, constant, board) {
            var _this = _super.call(this, point, color, constant, 5, board) || this;
            _this.isMovedAlready = false;
            return _this;
        }
        Rook.prototype.getPossibleMoves = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            for (var i = row + 1; i < 8; ++i) {
                // dol
                if (this.board.isFieldEmpty(i, col)) {
                    possiblePoints.push(new Point(i, col));
                }
                else {
                    break;
                }
            }
            for (var i = row - 1; i >= 0; --i) {
                // gora
                if (this.board.isFieldEmpty(i, col)) {
                    possiblePoints.push(new Point(i, col));
                }
                else {
                    break;
                }
            }
            for (var j = col - 1; j >= 0; --j) {
                // lewo
                if (this.board.isFieldEmpty(row, j)) {
                    possiblePoints.push(new Point(row, j));
                }
                else {
                    break;
                }
            }
            for (var j = col + 1; j < 8; ++j) {
                // prawo
                if (this.board.isFieldEmpty(row, j)) {
                    possiblePoints.push(new Point(row, j));
                }
                else {
                    break;
                }
            }
            return possiblePoints;
        };
        Rook.prototype.getPossibleCaptures = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            for (var i = row + 1; i < 8; ++i) {
                // dol
                if (this.board.isFieldTakenByEnemy(i, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(i, col));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(i, col)) {
                        break;
                    }
                }
            }
            for (var i = row - 1; i >= 0; --i) {
                // gora
                if (this.board.isFieldTakenByEnemy(i, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(i, col));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(i, col)) {
                        break;
                    }
                }
            }
            for (var j = col - 1; j >= 0; --j) {
                // lewo
                if (this.board.isFieldTakenByEnemy(row, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(row, j));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(row, j)) {
                        break;
                    }
                }
            }
            for (var j = col + 1; j < 8; ++j) {
                // prawo
                if (this.board.isFieldTakenByEnemy(row, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(row, j));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(row, j)) {
                        break;
                    }
                }
            }
            return possiblePoints;
        };
        Rook.prototype.getCoveredFields = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            for (var i = row + 1; i < 8; ++i) {
                // dol
                if (this.board.isFieldEmpty(i, col)) {
                    possiblePoints.push(new Point(i, col));
                }
                else {
                    if (!(this.board.getPieceByField instanceof King)) {
                        possiblePoints.push(new Point(i, col));
                        break;
                    }
                }
            }
            for (var i = row - 1; i >= 0; --i) {
                // gora
                if (this.board.isFieldEmpty(i, col)) {
                    possiblePoints.push(new Point(i, col));
                }
                else {
                    if (!(this.board.getPieceByField instanceof King)) {
                        possiblePoints.push(new Point(i, col));
                        break;
                    }
                }
            }
            for (var j = col - 1; j >= 0; --j) {
                // lewo
                if (this.board.isFieldEmpty(row, j)) {
                    possiblePoints.push(new Point(row, j));
                }
                else {
                    if (!(this.board.getPieceByField instanceof King)) {
                        possiblePoints.push(new Point(row, j));
                        break;
                    }
                }
            }
            for (var j = col + 1; j < 8; ++j) {
                // prawo
                if (this.board.isFieldEmpty(row, j)) {
                    possiblePoints.push(new Point(row, j));
                }
                else {
                    if (!(this.board.getPieceByField instanceof King)) {
                        possiblePoints.push(new Point(row, j));
                        break;
                    }
                }
            }
            return possiblePoints;
        };
        return Rook;
    }(Piece));

    var King = /** @class */ (function (_super) {
        __extends(King, _super);
        function King(point, color, constant, board) {
            var _this = _super.call(this, point, color, constant, 0, board) || this;
            _this.castledAlready = false;
            _this.shortCastled = false;
            _this.longCastled = false;
            _this.isCastling = false;
            return _this;
        }
        King.prototype.getPossibleMoves = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            // lewo
            if (this.board.isFieldEmpty(row, col - 1) &&
                !this.board.isFieldUnderAttack(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row, col - 1));
            }
            // prawo
            if (this.board.isFieldEmpty(row, col + 1) &&
                !this.board.isFieldUnderAttack(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row, col + 1));
            }
            // dol
            if (this.board.isFieldEmpty(row + 1, col) &&
                !this.board.isFieldUnderAttack(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row + 1, col));
            }
            // gora
            if (this.board.isFieldEmpty(row - 1, col) &&
                !this.board.isFieldUnderAttack(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row - 1, col));
            }
            // lewo gora
            if (this.board.isFieldEmpty(row - 1, col - 1) &&
                !this.board.isFieldUnderAttack(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row - 1, col - 1));
            }
            // prawo gora
            if (this.board.isFieldEmpty(row - 1, col + 1) &&
                !this.board.isFieldUnderAttack(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row - 1, col + 1));
            }
            // lewo dol
            if (this.board.isFieldEmpty(row + 1, col - 1) &&
                !this.board.isFieldUnderAttack(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row + 1, col - 1));
            }
            // prawo dol
            if (this.board.isFieldEmpty(row + 1, col + 1) &&
                !this.board.isFieldUnderAttack(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row + 1, col + 1));
            }
            if (!this.isMovedAlready) {
                var longCastlePossible = true;
                for (var i = col - 1; i > 0; --i) {
                    if (!this.board.isFieldEmpty(row, i) ||
                        this.board.isFieldUnderAttack(row, i, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                        longCastlePossible = false;
                        break;
                    }
                }
                if (longCastlePossible && !this.board.isKingInCheck(this.color, this.board.pieces) && this.board.getPieceByField(row, 0)) {
                    var leftRook = this.board.getPieceByField(row, 0);
                    if (leftRook instanceof Rook) {
                        if (!leftRook.isMovedAlready) {
                            possiblePoints.push(new Point(row, col - 2));
                        }
                    }
                }
                var shortCastlePossible = true;
                for (var i = col + 1; i < 7; ++i) {
                    if (!this.board.isFieldEmpty(row, i) ||
                        this.board.isFieldUnderAttack(row, i, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                        shortCastlePossible = false;
                        break;
                    }
                }
                if (shortCastlePossible && !this.board.isKingInCheck(this.color, this.board.pieces) && this.board.getPieceByField(row, 7)) {
                    var rightRook = this.board.getPieceByField(row, 7);
                    if (rightRook instanceof Rook) {
                        if (!rightRook.isMovedAlready) {
                            possiblePoints.push(new Point(row, col + 2));
                        }
                    }
                }
            }
            return possiblePoints;
        };
        King.prototype.getPossibleCaptures = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            // lewo
            if (this.board.isFieldTakenByEnemy(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) &&
                !this.board.isFieldUnderAttack(row, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row, col - 1));
            }
            // prawo
            if (this.board.isFieldTakenByEnemy(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) &&
                !this.board.isFieldUnderAttack(row, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row, col + 1));
            }
            // dol
            if (this.board.isFieldTakenByEnemy(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) &&
                !this.board.isFieldUnderAttack(row + 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row + 1, col));
            }
            // gora
            if (this.board.isFieldTakenByEnemy(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) &&
                !this.board.isFieldUnderAttack(row - 1, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row - 1, col));
            }
            // lewo gora
            if (this.board.isFieldTakenByEnemy(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) &&
                !this.board.isFieldUnderAttack(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row - 1, col - 1));
            }
            // prawo gora
            if (this.board.isFieldTakenByEnemy(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) &&
                !this.board.isFieldUnderAttack(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row - 1, col + 1));
            }
            // lewo dol
            if (this.board.isFieldTakenByEnemy(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) &&
                !this.board.isFieldUnderAttack(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row + 1, col - 1));
            }
            // prawo dol
            if (this.board.isFieldTakenByEnemy(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE) &&
                !this.board.isFieldUnderAttack(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row + 1, col + 1));
            }
            return possiblePoints;
        };
        King.prototype.getCoveredFields = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            // lewo
            possiblePoints.push(new Point(row, col - 1));
            // prawo
            possiblePoints.push(new Point(row, col + 1));
            // dol
            possiblePoints.push(new Point(row + 1, col));
            // gora
            possiblePoints.push(new Point(row - 1, col));
            // lewo gora
            possiblePoints.push(new Point(row - 1, col - 1));
            // prawo gora
            possiblePoints.push(new Point(row - 1, col + 1));
            // lewo dol
            possiblePoints.push(new Point(row + 1, col - 1));
            // prawo dol
            possiblePoints.push(new Point(row + 1, col + 1));
            return possiblePoints;
        };
        return King;
    }(Piece));

    var Bishop = /** @class */ (function (_super) {
        __extends(Bishop, _super);
        function Bishop(point, color, constant, board) {
            return _super.call(this, point, color, constant, 3, board) || this;
        }
        Bishop.prototype.getPossibleMoves = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            for (var i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
                // lewa gorna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    break;
                }
            }
            for (var i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
                // prawa gorna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    break;
                }
            }
            for (var i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
                // lewa dolna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    break;
                }
            }
            for (var i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
                // prawa dolna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    break;
                }
            }
            return possiblePoints;
        };
        Bishop.prototype.getPossibleCaptures = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            for (var i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
                // lewa gorna przekatna
                if (this.board.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(i, j));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(i, j)) {
                        break;
                    }
                }
            }
            for (var i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
                // prawa gorna przekatna
                if (this.board.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(i, j));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(i, j)) {
                        break;
                    }
                }
            }
            for (var i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
                // lewa dolna przekatna
                if (this.board.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(i, j));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(i, j)) {
                        break;
                    }
                }
            }
            for (var i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
                // prawa dolna przekatna
                if (this.board.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(i, j));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(i, j)) {
                        break;
                    }
                }
            }
            return possiblePoints;
        };
        Bishop.prototype.getCoveredFields = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            for (var i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
                // lewa gorna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    if (!(this.board.getPieceByField(i, j) instanceof King)) {
                        possiblePoints.push(new Point(i, j));
                    }
                    break;
                }
            }
            for (var i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
                // prawa gorna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    if (!(this.board.getPieceByField(i, j) instanceof King)) {
                        possiblePoints.push(new Point(i, j));
                    }
                    break;
                }
            }
            for (var i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
                // lewa dolna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    if (!(this.board.getPieceByField(i, j) instanceof King)) {
                        possiblePoints.push(new Point(i, j));
                    }
                    break;
                }
            }
            for (var i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
                // prawa dolna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    if (!(this.board.getPieceByField(i, j) instanceof King)) {
                        possiblePoints.push(new Point(i, j));
                    }
                    break;
                }
            }
            return possiblePoints;
        };
        return Bishop;
    }(Piece));

    var Knight = /** @class */ (function (_super) {
        __extends(Knight, _super);
        function Knight(point, color, constant, board) {
            var _this = _super.call(this, point, color, constant, 3, board) || this;
            _this.isMovedAlready = false;
            return _this;
        }
        Knight.prototype.getPossibleMoves = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            // gora -> lewo
            if (this.board.isFieldEmpty(row - 2, col - 1)) {
                possiblePoints.push(new Point(row - 2, col - 1));
            }
            // gora -> prawo
            if (this.board.isFieldEmpty(row - 2, col + 1)) {
                possiblePoints.push(new Point(row - 2, col + 1));
            }
            // lewo -> gora
            if (this.board.isFieldEmpty(row - 1, col - 2)) {
                possiblePoints.push(new Point(row - 1, col - 2));
            }
            // prawo -> gora
            if (this.board.isFieldEmpty(row - 1, col + 2)) {
                possiblePoints.push(new Point(row - 1, col + 2));
            }
            // lewo -> dol
            if (this.board.isFieldEmpty(row + 1, col - 2)) {
                possiblePoints.push(new Point(row + 1, col - 2));
            }
            // prawo -> dol
            if (this.board.isFieldEmpty(row + 1, col + 2)) {
                possiblePoints.push(new Point(row + 1, col + 2));
            }
            // dol -> lewo
            if (this.board.isFieldEmpty(row + 2, col - 1)) {
                possiblePoints.push(new Point(row + 2, col - 1));
            }
            // dol -> prawo
            if (this.board.isFieldEmpty(row + 2, col + 1)) {
                possiblePoints.push(new Point(row + 2, col + 1));
            }
            return possiblePoints;
        };
        Knight.prototype.getPossibleCaptures = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            // gora -> lewo
            if (this.board.isFieldTakenByEnemy(row - 2, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row - 2, col - 1));
            }
            // gora -> prawo
            if (this.board.isFieldTakenByEnemy(row - 2, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row - 2, col + 1));
            }
            // lewo -> gora
            if (this.board.isFieldTakenByEnemy(row - 1, col - 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row - 1, col - 2));
            }
            // prawo -> gora
            if (this.board.isFieldTakenByEnemy(row - 1, col + 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row - 1, col + 2));
            }
            // lewo -> dol
            if (this.board.isFieldTakenByEnemy(row + 1, col - 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row + 1, col - 2));
            }
            // prawo -> dol
            if (this.board.isFieldTakenByEnemy(row + 1, col + 2, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row + 1, col + 2));
            }
            // dol -> lewo
            if (this.board.isFieldTakenByEnemy(row + 2, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row + 2, col - 1));
            }
            // dol -> prawo
            if (this.board.isFieldTakenByEnemy(row + 2, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                possiblePoints.push(new Point(row + 2, col + 1));
            }
            return possiblePoints;
        };
        Knight.prototype.getCoveredFields = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            // gora -> lewo
            possiblePoints.push(new Point(row - 2, col - 1));
            // gora -> prawo
            possiblePoints.push(new Point(row - 2, col + 1));
            // lewo -> gora
            possiblePoints.push(new Point(row - 1, col - 2));
            // prawo -> gora
            possiblePoints.push(new Point(row - 1, col + 2));
            // lewo -> dol
            possiblePoints.push(new Point(row + 1, col - 2));
            // prawo -> dol
            possiblePoints.push(new Point(row + 1, col + 2));
            // dol -> lewo
            possiblePoints.push(new Point(row + 2, col - 1));
            // dol -> prawo
            possiblePoints.push(new Point(row + 2, col + 1));
            return possiblePoints;
        };
        return Knight;
    }(Piece));

    var Pawn = /** @class */ (function (_super) {
        __extends(Pawn, _super);
        function Pawn(point, color, constant, board) {
            var _this = _super.call(this, point, color, constant, 1, board) || this;
            _this.isMovedAlready = false;
            return _this;
        }
        Pawn.prototype.getPossibleMoves = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            if ((!this.board.reverted && this.color === Color.WHITE) ||
                (this.board.reverted && this.color === Color.BLACK)) {
                if (this.board.isFieldEmpty(row - 1, col)) {
                    possiblePoints.push(new Point(row - 1, col));
                    if (!this.isMovedAlready &&
                        this.board.isFieldEmpty(row - 2, col)) {
                        possiblePoints.push(new Point(row - 2, col));
                    }
                }
            }
            else {
                if (
                /*!board.isFieldTakenByEnemy(row + 1, col, Color.WHITE) &&*/ this.board.isFieldEmpty(row + 1, col)) {
                    possiblePoints.push(new Point(row + 1, col));
                    if (!this.isMovedAlready &&
                        this.board.isFieldEmpty(row + 2, col)) {
                        possiblePoints.push(new Point(row + 2, col));
                    }
                }
            }
            return possiblePoints;
        };
        Pawn.prototype.getPossibleCaptures = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            if ((!this.board.reverted && this.color === Color.WHITE) ||
                (this.board.reverted && this.color === Color.BLACK)) {
                if (this.board.isFieldTakenByEnemy(row - 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(row - 1, col - 1));
                }
                if (this.board.isFieldTakenByEnemy(row - 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(row - 1, col + 1));
                }
            }
            else {
                if (this.board.isFieldTakenByEnemy(row + 1, col - 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(row + 1, col - 1));
                }
                if (this.board.isFieldTakenByEnemy(row + 1, col + 1, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(row + 1, col + 1));
                }
            }
            if (this.board.enPassantPoint &&
                this.board.enPassantPiece.color ===
                    (this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                if (row === this.board.enPassantPiece.point.row &&
                    Math.abs(this.board.enPassantPiece.point.col - col) === 1) {
                    possiblePoints.push(this.board.enPassantPoint);
                }
            }
            return possiblePoints;
        };
        Pawn.prototype.getCoveredFields = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            if ((!this.board.reverted && this.color === Color.WHITE) ||
                (this.board.reverted && this.color === Color.BLACK)) {
                possiblePoints.push(new Point(row - 1, col - 1));
                possiblePoints.push(new Point(row - 1, col + 1));
            }
            else {
                possiblePoints.push(new Point(row + 1, col - 1));
                possiblePoints.push(new Point(row + 1, col + 1));
            }
            return possiblePoints;
        };
        return Pawn;
    }(Piece));

    var Queen = /** @class */ (function (_super) {
        __extends(Queen, _super);
        function Queen(point, color, constant, board) {
            return _super.call(this, point, color, constant, 9, board) || this;
        }
        Queen.prototype.getPossibleMoves = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            for (var i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
                // lewa gorna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    break;
                }
            }
            for (var i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
                // prawa gorna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    break;
                }
            }
            for (var i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
                // lewa dolna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    break;
                }
            }
            for (var i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
                // prawa dolna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    break;
                }
            }
            for (var i = row + 1; i < 8; ++i) {
                // dol
                if (this.board.isFieldEmpty(i, col)) {
                    possiblePoints.push(new Point(i, col));
                }
                else {
                    break;
                }
            }
            for (var i = row - 1; i >= 0; --i) {
                // gora
                if (this.board.isFieldEmpty(i, col)) {
                    possiblePoints.push(new Point(i, col));
                }
                else {
                    break;
                }
            }
            for (var j = col - 1; j >= 0; --j) {
                // lewo
                if (this.board.isFieldEmpty(row, j)) {
                    possiblePoints.push(new Point(row, j));
                }
                else {
                    break;
                }
            }
            for (var j = col + 1; j < 8; ++j) {
                // prawo
                if (this.board.isFieldEmpty(row, j)) {
                    possiblePoints.push(new Point(row, j));
                }
                else {
                    break;
                }
            }
            return possiblePoints;
        };
        Queen.prototype.getPossibleCaptures = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            for (var i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
                // lewa gorna przekatna
                if (this.board.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(i, j));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(i, j)) {
                        break;
                    }
                }
            }
            for (var i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
                // prawa gorna przekatna
                if (this.board.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(i, j));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(i, j)) {
                        break;
                    }
                }
            }
            for (var i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
                // lewa dolna przekatna
                if (this.board.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(i, j));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(i, j)) {
                        break;
                    }
                }
            }
            for (var i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
                // prawa dolna przekatna
                if (this.board.isFieldTakenByEnemy(i, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(i, j));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(i, j)) {
                        break;
                    }
                }
            }
            for (var i = row + 1; i < 8; ++i) {
                // dol
                if (this.board.isFieldTakenByEnemy(i, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(i, col));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(i, col)) {
                        break;
                    }
                }
            }
            for (var i = row - 1; i >= 0; --i) {
                // gora
                if (this.board.isFieldTakenByEnemy(i, col, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(i, col));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(i, col)) {
                        break;
                    }
                }
            }
            for (var j = col - 1; j >= 0; --j) {
                // lewo
                if (this.board.isFieldTakenByEnemy(row, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(row, j));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(row, j)) {
                        break;
                    }
                }
            }
            for (var j = col + 1; j < 8; ++j) {
                // prawo
                if (this.board.isFieldTakenByEnemy(row, j, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    possiblePoints.push(new Point(row, j));
                    break;
                }
                else {
                    if (!this.board.isFieldEmpty(row, j)) {
                        break;
                    }
                }
            }
            return possiblePoints;
        };
        Queen.prototype.getCoveredFields = function () {
            var possiblePoints = [];
            var row = this.point.row;
            var col = this.point.col;
            for (var i = row + 1; i < 8; ++i) {
                // dol
                if (this.board.isFieldEmpty(i, col)) {
                    possiblePoints.push(new Point(i, col));
                }
                else {
                    if (!(this.board.getPieceByField(i, col) instanceof King)) {
                        possiblePoints.push(new Point(i, col));
                    }
                    break;
                }
            }
            for (var i = row - 1; i >= 0; --i) {
                // gora
                if (this.board.isFieldEmpty(i, col)) {
                    possiblePoints.push(new Point(i, col));
                }
                else {
                    if (!(this.board.getPieceByField(i, col) instanceof King)) {
                        possiblePoints.push(new Point(i, col));
                    }
                    break;
                }
            }
            for (var j = col - 1; j >= 0; --j) {
                // lewo
                if (this.board.isFieldEmpty(row, j)) {
                    possiblePoints.push(new Point(row, j));
                }
                else {
                    if (!(this.board.getPieceByField(row, j) instanceof King)) {
                        possiblePoints.push(new Point(row, j));
                    }
                    break;
                }
            }
            for (var j = col + 1; j < 8; ++j) {
                // prawo
                if (this.board.isFieldEmpty(row, j)) {
                    possiblePoints.push(new Point(row, j));
                }
                else {
                    if (!(this.board.getPieceByField(row, j) instanceof King)) {
                        possiblePoints.push(new Point(row, j));
                    }
                    break;
                }
            }
            for (var i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
                // lewa gorna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    if (!(this.board.getPieceByField(i, j) instanceof King)) {
                        possiblePoints.push(new Point(i, j));
                    }
                    break;
                }
            }
            for (var i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
                // prawa gorna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    if (!(this.board.getPieceByField(i, j) instanceof King)) {
                        possiblePoints.push(new Point(i, j));
                    }
                    break;
                }
            }
            for (var i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
                // lewa dolna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    if (!(this.board.getPieceByField(i, j) instanceof King)) {
                        possiblePoints.push(new Point(i, j));
                    }
                    break;
                }
            }
            for (var i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
                // prawa dolna przekatna
                if (this.board.isFieldEmpty(i, j)) {
                    possiblePoints.push(new Point(i, j));
                }
                else {
                    if (!(this.board.getPieceByField(i, j) instanceof King)) {
                        possiblePoints.push(new Point(i, j));
                    }
                    break;
                }
            }
            return possiblePoints;
        };
        return Queen;
    }(Piece));

    var UnicodeConstants = {
        WHITE_KING: { name: 'King', icon: '&#x2654;' },
        WHITE_QUEEN: { name: 'Queen', icon: '&#x2655;' },
        WHITE_KNIGHT: { name: 'Knight', icon: '&#x2658' },
        WHITE_ROOK: { name: 'Rook', icon: '&#x2656' },
        WHITE_PAWN: { name: 'Pawn', icon: '&#x2659' },
        WHITE_BISHOP: { name: 'Bishop', icon: '&#x2657' },
        BLACK_KING: { name: 'King', icon: '&#x265A' },
        BLACK_QUEEN: { name: 'Queen', icon: '&#x265B' },
        BLACK_KNIGHT: { name: 'Knight', icon: '&#x265E' },
        BLACK_ROOK: { name: 'Rook', icon: '&#x265C' },
        BLACK_PAWN: { name: 'Pawn', icon: '&#x265F' },
        BLACK_BISHOP: { name: 'Bishop', icon: '&#x265D' },
    };

    var BoardLoader = /** @class */ (function () {
        function BoardLoader(board) {
            this.board = board;
        }
        BoardLoader.prototype.addPieces = function () {
            this.board.pieces = [];
            // piony czarne
            for (var i = 0; i < 8; ++i) {
                this.board.pieces.push(new Pawn(new Point(1, i), Color.BLACK, UnicodeConstants.BLACK_PAWN, this.board));
            }
            this.board.pieces.push(new Rook(new Point(0, 0), Color.BLACK, UnicodeConstants.BLACK_ROOK, this.board));
            this.board.pieces.push(new Knight(new Point(0, 1), Color.BLACK, UnicodeConstants.BLACK_KNIGHT, this.board));
            this.board.pieces.push(new Bishop(new Point(0, 2), Color.BLACK, UnicodeConstants.BLACK_BISHOP, this.board));
            this.board.pieces.push(new Queen(new Point(0, 3), Color.BLACK, UnicodeConstants.BLACK_QUEEN, this.board));
            this.board.pieces.push(new King(new Point(0, 4), Color.BLACK, UnicodeConstants.BLACK_KING, this.board));
            this.board.pieces.push(new Bishop(new Point(0, 5), Color.BLACK, UnicodeConstants.BLACK_BISHOP, this.board));
            this.board.pieces.push(new Knight(new Point(0, 6), Color.BLACK, UnicodeConstants.BLACK_KNIGHT, this.board));
            this.board.pieces.push(new Rook(new Point(0, 7), Color.BLACK, UnicodeConstants.BLACK_ROOK, this.board));
            // piony biale
            for (var i = 0; i < 8; ++i) {
                this.board.pieces.push(new Pawn(new Point(6, i), Color.WHITE, UnicodeConstants.WHITE_PAWN, this.board));
            }
            this.board.pieces.push(new Rook(new Point(7, 0), Color.WHITE, UnicodeConstants.WHITE_ROOK, this.board));
            this.board.pieces.push(new Knight(new Point(7, 1), Color.WHITE, UnicodeConstants.WHITE_KNIGHT, this.board));
            this.board.pieces.push(new Bishop(new Point(7, 2), Color.WHITE, UnicodeConstants.WHITE_BISHOP, this.board));
            this.board.pieces.push(new Queen(new Point(7, 3), Color.WHITE, UnicodeConstants.WHITE_QUEEN, this.board));
            this.board.pieces.push(new King(new Point(7, 4), Color.WHITE, UnicodeConstants.WHITE_KING, this.board));
            this.board.pieces.push(new Bishop(new Point(7, 5), Color.WHITE, UnicodeConstants.WHITE_BISHOP, this.board));
            this.board.pieces.push(new Knight(new Point(7, 6), Color.WHITE, UnicodeConstants.WHITE_KNIGHT, this.board));
            this.board.pieces.push(new Rook(new Point(7, 7), Color.WHITE, UnicodeConstants.WHITE_ROOK, this.board));
            this.board.calculateFEN();
        };
        BoardLoader.prototype.loadFEN = function (fen) {
            console.log(fen);
            if (fen) {
                this.board.reverted = false;
                this.board.pieces = [];
                var split = fen.split('/');
                for (var i = 0; i < 8; ++i) {
                    var pointer = 0;
                    for (var j = 0; j < 8; ++j) {
                        var chunk = split[i].charAt(j);
                        if (chunk.match(/[0-9]/)) {
                            pointer += Number(chunk);
                        }
                        else {
                            switch (chunk) {
                                case 'r':
                                    this.board.pieces.push(new Rook(new Point(i, pointer), Color.BLACK, UnicodeConstants.BLACK_ROOK, this.board));
                                    break;
                                case 'n':
                                    this.board.pieces.push(new Knight(new Point(i, pointer), Color.BLACK, UnicodeConstants.BLACK_KNIGHT, this.board));
                                    break;
                                case 'b':
                                    this.board.pieces.push(new Bishop(new Point(i, pointer), Color.BLACK, UnicodeConstants.BLACK_BISHOP, this.board));
                                    break;
                                case 'q':
                                    this.board.pieces.push(new Queen(new Point(i, pointer), Color.BLACK, UnicodeConstants.BLACK_QUEEN, this.board));
                                    break;
                                case 'k':
                                    this.board.pieces.push(new King(new Point(i, pointer), Color.BLACK, UnicodeConstants.BLACK_KING, this.board));
                                    break;
                                case 'p': {
                                    var pawn = new Pawn(new Point(i, pointer), Color.BLACK, UnicodeConstants.BLACK_PAWN, this.board);
                                    if ((pawn.color === Color.BLACK && pawn.point.row !== 1) ||
                                        (pawn.color === Color.WHITE && pawn.point.row !== 6)) {
                                        pawn.isMovedAlready = true;
                                    }
                                    this.board.pieces.push(pawn);
                                    break;
                                }
                                case 'R':
                                    this.board.pieces.push(new Rook(new Point(i, pointer), Color.WHITE, UnicodeConstants.WHITE_ROOK, this.board));
                                    break;
                                case 'N':
                                    this.board.pieces.push(new Knight(new Point(i, pointer), Color.WHITE, UnicodeConstants.WHITE_KNIGHT, this.board));
                                    break;
                                case 'B':
                                    this.board.pieces.push(new Bishop(new Point(i, pointer), Color.WHITE, UnicodeConstants.WHITE_BISHOP, this.board));
                                    break;
                                case 'Q':
                                    this.board.pieces.push(new Queen(new Point(i, pointer), Color.WHITE, UnicodeConstants.WHITE_QUEEN, this.board));
                                    break;
                                case 'K':
                                    this.board.pieces.push(new King(new Point(i, pointer), Color.WHITE, UnicodeConstants.WHITE_KING, this.board));
                                    break;
                                case 'P': {
                                    var pawn = new Pawn(new Point(i, pointer), Color.WHITE, UnicodeConstants.WHITE_PAWN, this.board);
                                    if ((pawn.color === Color.BLACK && pawn.point.row !== 1) ||
                                        (pawn.color === Color.WHITE && pawn.point.row !== 6)) {
                                        pawn.isMovedAlready = true;
                                    }
                                    this.board.pieces.push(pawn);
                                    break;
                                }
                            }
                            ++pointer;
                        }
                    }
                }
                this.setCurrentPlayer(fen);
                this.setCastles(fen);
                this.setEnPassant(fen);
                this.setFullMoveCount(fen);
            }
            else {
                throw Error('Incorrect FEN provided');
            }
        };
        BoardLoader.prototype.setBoard = function (board) {
            this.board = board;
        };
        BoardLoader.prototype.setCurrentPlayer = function (fen) {
            if (fen) {
                var split = fen.split(' ');
                this.board.currentWhitePlayer = split[1] === 'w';
            }
        };
        BoardLoader.prototype.setCastles = function (fen) {
            if (fen) {
                var split = fen.split(' ');
                var castleChunk = split[2];
                if (!castleChunk.includes('K')) {
                    this.setRookAlreadyMoved(Color.WHITE, 7);
                }
                if (!castleChunk.includes('Q')) {
                    this.setRookAlreadyMoved(Color.WHITE, 0);
                }
                if (!castleChunk.includes('k')) {
                    this.setRookAlreadyMoved(Color.BLACK, 7);
                }
                if (!castleChunk.includes('q')) {
                    this.setRookAlreadyMoved(Color.BLACK, 0);
                }
            }
        };
        BoardLoader.prototype.setFullMoveCount = function (fen) { };
        BoardLoader.prototype.setEnPassant = function (fen) {
            if (fen) {
                var split = fen.split(' ');
                var enPassantPoint = split[3];
                if (enPassantPoint === '-') {
                    return;
                }
                // if()
            }
        };
        BoardLoader.prototype.setRookAlreadyMoved = function (color, col) {
            var rook = this.board.pieces.find(function (piece) { return piece.color === color && piece instanceof Rook && piece.point.col === col; });
            if (rook) {
                rook.isMovedAlready = true;
            }
        };
        return BoardLoader;
    }());

    var BoardState = /** @class */ (function () {
        function BoardState(board) {
            this.board = board;
        }
        return BoardState;
    }());

    var BoardStateProvider = /** @class */ (function () {
        function BoardStateProvider() {
            this.statesSubject$ = new rxjs.BehaviorSubject([]);
        }
        Object.defineProperty(BoardStateProvider.prototype, "states", {
            get: function () {
                return this.statesSubject$.value;
            },
            set: function (states) {
                this.statesSubject$.next(states);
            },
            enumerable: false,
            configurable: true
        });
        BoardStateProvider.prototype.addMove = function (state) {
            this.states = __spread(this.states, [state]);
        };
        BoardStateProvider.prototype.getStates = function () {
            return this.states;
        };
        BoardStateProvider.prototype.pop = function () {
            var lastState = this.getLastState();
            this.states = this.states.filter(function (state) { return state !== lastState; });
            return lastState;
        };
        BoardStateProvider.prototype.isEmpty = function () {
            return this.states.length === 0;
        };
        BoardStateProvider.prototype.clear = function () {
            this.states = [];
        };
        BoardStateProvider.prototype.getLastState = function () {
            return this.states[this.getLastStateIndex()];
        };
        BoardStateProvider.prototype.getLastStateIndex = function () {
            return this.states.length - 1;
        };
        return BoardStateProvider;
    }());

    var CoordsProvider = /** @class */ (function () {
        function CoordsProvider() {
            this.defaultXCoords = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            this.defaultYCoords = [8, 7, 6, 5, 4, 3, 2, 1];
            this.currentXCoords = __spread(this.defaultXCoords);
            this.currentYCoords = __spread(this.defaultYCoords);
        }
        Object.defineProperty(CoordsProvider.prototype, "xCoords", {
            get: function () {
                return this.currentXCoords;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CoordsProvider.prototype, "yCoords", {
            get: function () {
                return this.currentYCoords;
            },
            enumerable: false,
            configurable: true
        });
        CoordsProvider.prototype.reverse = function () {
            this.currentXCoords = this.currentXCoords.reverse();
            this.currentYCoords = this.currentYCoords.reverse();
        };
        CoordsProvider.prototype.reset = function () {
            this.init();
        };
        CoordsProvider.prototype.init = function () {
            this.currentXCoords = __spread(this.defaultXCoords);
            this.currentYCoords = __spread(this.defaultYCoords);
        };
        return CoordsProvider;
    }());

    var Arrow = /** @class */ (function () {
        function Arrow() {
        }
        Arrow.prototype.isEqual = function (arrow) {
            return arrow && this.start.isEqual(arrow.start) && this.end.isEqual(arrow.end);
        };
        return Arrow;
    }());

    var Circle = /** @class */ (function () {
        function Circle() {
        }
        Circle.prototype.isEqual = function (circle) {
            return circle && this.drawPoint.isEqual(circle.drawPoint);
        };
        return Circle;
    }());

    var DrawPoint = /** @class */ (function () {
        function DrawPoint(x, y, color) {
            this.x = x + 0.5;
            this.y = y + 0.5;
            this.color = color;
        }
        DrawPoint.prototype.isEqual = function (that) {
            return that && that.x === this.x && this.y === that.y;
        };
        return DrawPoint;
    }());

    var DrawProvider = /** @class */ (function () {
        function DrawProvider() {
            this.arrowsSubject$ = new rxjs.BehaviorSubject([]);
            this.circlesSubject$ = new rxjs.BehaviorSubject([]);
            this.arrows$ = this.arrowsSubject$.asObservable();
            this.circles$ = this.circlesSubject$.asObservable();
        }
        Object.defineProperty(DrawProvider.prototype, "circles", {
            get: function () {
                return this.circlesSubject$.value;
            },
            set: function (circles) {
                this.circlesSubject$.next(circles);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DrawProvider.prototype, "arrows", {
            get: function () {
                return this.arrowsSubject$.value;
            },
            set: function (arrows) {
                this.arrowsSubject$.next(arrows);
            },
            enumerable: false,
            configurable: true
        });
        DrawProvider.prototype.addCircle = function (circle) {
            this.circles = __spread(this.circles, [circle]);
        };
        DrawProvider.prototype.reomveCircle = function (removeCircle) {
            this.circles = this.circles.filter(function (circle) { return !circle.isEqual(removeCircle); });
        };
        DrawProvider.prototype.addArrow = function (arrow) {
            this.arrows = __spread(this.arrows, [arrow]);
        };
        DrawProvider.prototype.removeArrow = function (removeArrow) {
            this.arrows = this.arrows.filter(function (arrow) { return !arrow.isEqual(removeArrow); });
        };
        DrawProvider.prototype.containsCircle = function (checkCircle) {
            return this.circles.some(function (circle) { return circle.isEqual(checkCircle); });
        };
        DrawProvider.prototype.containsArrow = function (checkArrow) {
            return this.arrows.some(function (arrow) { return arrow.isEqual(checkArrow); });
        };
        DrawProvider.prototype.clear = function () {
            this.arrows = [];
            this.circles = [];
        };
        return DrawProvider;
    }());

    var HistoryMove = /** @class */ (function () {
        function HistoryMove(move, piece, color, captured) {
            this.move = move;
            this.piece = piece;
            this.color = color;
            this.x = captured;
        }
        return HistoryMove;
    }());

    var HistoryMoveProvider = /** @class */ (function () {
        function HistoryMoveProvider() {
            this.historyMovesSubject$ = new rxjs.BehaviorSubject([]);
        }
        Object.defineProperty(HistoryMoveProvider.prototype, "historyMoves", {
            get: function () {
                return this.historyMovesSubject$.value;
            },
            set: function (states) {
                this.historyMovesSubject$.next(states);
            },
            enumerable: false,
            configurable: true
        });
        HistoryMoveProvider.prototype.addMove = function (historyMove) {
            this.historyMoves = __spread(this.historyMoves, [historyMove]);
        };
        HistoryMoveProvider.prototype.pop = function () {
            var lastHistoryMove = this.getLastMove();
            this.historyMoves = this.historyMoves.filter(function (state) { return state !== lastHistoryMove; });
            return lastHistoryMove;
        };
        HistoryMoveProvider.prototype.getAll = function () {
            return this.historyMoves;
        };
        HistoryMoveProvider.prototype.clear = function () {
            this.historyMoves = [];
        };
        HistoryMoveProvider.prototype.getLastMove = function () {
            return this.historyMoves[this.getLastMoveIndex()];
        };
        HistoryMoveProvider.prototype.getLastMoveIndex = function () {
            return this.historyMoves.length - 1;
        };
        return HistoryMoveProvider;
    }());

    var Board = /** @class */ (function () {
        function Board() {
            this.board = [];
            this.pieces = [];
            this.enPassantPoint = null;
            this.enPassantPiece = null;
            this.lastMoveSrc = null;
            this.lastMoveDest = null;
            this.possibleCaptures = [];
            this.possibleMoves = [];
            this.currentWhitePlayer = true;
            this.reverted = false;
            this.fullMoveCount = 1;
            for (var i = 0; i < 8; ++i) {
                this.board[i] = [];
                for (var j = 0; j < 8; ++j) {
                    this.board[i][j] = 0;
                }
            }
        }
        Board.prototype.isXYInPossibleMoves = function (row, col) {
            return this.possibleMoves.some(function (move) { return move.row === row && move.col === col; });
        };
        Board.prototype.isXYInPossibleCaptures = function (row, col) {
            return this.possibleCaptures.some(function (capture) { return capture.row === row && capture.col === col; });
        };
        Board.prototype.isXYInSourceMove = function (i, j) {
            return this.lastMoveSrc && this.lastMoveSrc.row === i && this.lastMoveSrc.col === j;
        };
        Board.prototype.isXYInDestMove = function (i, j) {
            return this.lastMoveDest && this.lastMoveDest.row === i && this.lastMoveDest.col === j;
        };
        Board.prototype.isXYInActiveMove = function (i, j) {
            return this.activePiece && this.activePiece.point.row === i && this.activePiece.point.col === j;
        };
        Board.prototype.isPointInPossibleMoves = function (point) {
            return this.possibleMoves.some(function (move) { return move.row === point.row && move.col === point.col; });
        };
        Board.prototype.isPointInPossibleCaptures = function (point) {
            return this.possibleCaptures.some(function (capture) { return capture.row === point.row && capture.col === point.col; });
        };
        Board.prototype.reset = function () {
            this.lastMoveDest = null;
            this.lastMoveSrc = null;
            this.whiteKingChecked = false;
            this.blackKingChecked = false;
            this.possibleCaptures = [];
            this.possibleMoves = [];
            this.activePiece = null;
            this.reverted = false;
            this.currentWhitePlayer = true;
            this.enPassantPoint = null;
            this.enPassantPiece = null;
            this.fullMoveCount = 1;
            this.calculateFEN();
        };
        Board.prototype.reverse = function () {
            var _this = this;
            this.reverted = !this.reverted;
            this.activePiece = null;
            this.possibleMoves = [];
            this.possibleCaptures = [];
            this.pieces.forEach(function (piece) { return _this.reversePoint(piece.point); });
            this.reversePoint(this.lastMoveSrc);
            if (this.enPassantPoint && this.enPassantPiece) {
                this.reversePoint(this.enPassantPoint);
            }
        };
        Board.prototype.clone = function () {
            return lodash.cloneDeep(this);
        };
        Board.prototype.isFieldTakenByEnemy = function (row, col, enemyColor) {
            if (row > 7 || row < 0 || col > 7 || col < 0) {
                return false;
            }
            return this.pieces.some(function (piece) { return piece.point.col === col && piece.point.row === row && piece.color === enemyColor; });
        };
        Board.prototype.isFieldEmpty = function (row, col) {
            if (row > 7 || row < 0 || col > 7 || col < 0) {
                return false;
            }
            return !this.pieces.some(function (piece) { return piece.point.col === col && piece.point.row === row; });
        };
        Board.prototype.isFieldUnderAttack = function (row, col, color) {
            return this.pieces
                .filter(function (piece) { return piece.color === color; })
                .some(function (piece) { return piece.getCoveredFields().some(function (field) { return field.col === col && field.row === row; }); });
        };
        Board.prototype.getPieceByField = function (row, col) {
            if (this.isFieldEmpty(row, col)) {
                //   throw new Error('Piece not found');
                return undefined;
            }
            return this.pieces.find(function (piece) { return piece.point.col === col && piece.point.row === row; });
        };
        Board.prototype.isKingInCheck = function (color, pieces) {
            var king = pieces.find(function (piece) { return piece.color === color && piece instanceof King; });
            if (king) {
                return pieces.some(function (piece) { return piece
                    .getPossibleCaptures()
                    .some(function (point) { return point.col === king.point.col && point.row === king.point.row; }) &&
                    piece.color !== color; });
            }
            return false;
        };
        Board.prototype.getKingByColor = function (color) {
            return this.pieces.find(function (piece) { return piece instanceof King && piece.color === color; });
        };
        Board.prototype.getCastleFENString = function (color) {
            var king = this.getKingByColor(color);
            if (king.isMovedAlready) {
                return '';
            }
            var fen = '';
            var leftRook = this.getPieceByField(king.point.row, 0);
            var rightRook = this.getPieceByField(king.point.row, 7);
            if (rightRook instanceof Rook && rightRook.color === color) {
                if (!rightRook.isMovedAlready) {
                    fen += this.reverted ? 'q' : 'k';
                }
            }
            if (leftRook instanceof Rook && leftRook.color === color) {
                if (!leftRook.isMovedAlready) {
                    fen += this.reverted ? 'k' : 'q';
                }
            }
            fen = fen.split('').sort().join('');
            return color === Color.BLACK ? fen : fen.toUpperCase();
        };
        Board.prototype.getEnPassantFENString = function () {
            if (this.enPassantPoint) {
                if (this.reverted) {
                    return String.fromCharCode(104 - this.enPassantPoint.col) + (this.enPassantPoint.row + 1);
                }
                else {
                    return String.fromCharCode(97 + this.enPassantPoint.col) + (Math.abs(this.enPassantPoint.row - 7) + 1);
                }
            }
            else {
                return '-';
            }
        };
        Board.prototype.calculateFEN = function () {
            var fen = '';
            var _loop_1 = function (i) {
                var emptyFields = 0;
                var _loop_2 = function (j) {
                    var foundPiece = this_1.pieces.find(function (piece) { return piece.point.col === j && piece.point.row === i; });
                    if (foundPiece) {
                        if (emptyFields > 0) {
                            fen += emptyFields;
                            emptyFields = 0;
                        }
                        if (foundPiece instanceof Rook) {
                            fen += foundPiece.color === Color.BLACK ? 'r' : 'R';
                        }
                        else {
                            if (foundPiece instanceof Knight) {
                                fen += foundPiece.color === Color.BLACK ? 'n' : 'N';
                            }
                            else {
                                if (foundPiece instanceof Bishop) {
                                    fen += foundPiece.color === Color.BLACK ? 'b' : 'B';
                                }
                                else {
                                    if (foundPiece instanceof Queen) {
                                        fen += foundPiece.color === Color.BLACK ? 'q' : 'Q';
                                    }
                                    else {
                                        if (foundPiece instanceof King) {
                                            fen += foundPiece.color === Color.BLACK ? 'k' : 'K';
                                        }
                                        else {
                                            if (foundPiece instanceof Pawn) {
                                                fen += foundPiece.color === Color.BLACK ? 'p' : 'P';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        ++emptyFields;
                    }
                };
                for (var j = 0; j < 8; ++j) {
                    _loop_2(j);
                }
                if (emptyFields > 0) {
                    fen += emptyFields;
                }
                fen += '/';
            };
            var this_1 = this;
            for (var i = 0; i < 8; ++i) {
                _loop_1(i);
            }
            fen = fen.substr(0, fen.length - 1);
            if (this.reverted) {
                fen = fen.split('').reverse().join('');
            }
            fen += ' ' + (this.currentWhitePlayer ? 'w' : 'b');
            var whiteEnPassant = this.getCastleFENString(Color.WHITE);
            var blackEnPassant = this.getCastleFENString(Color.BLACK);
            var concatedEnPassant = whiteEnPassant + blackEnPassant;
            if (!concatedEnPassant) {
                concatedEnPassant = '-';
            }
            fen += ' ' + concatedEnPassant;
            fen += ' ' + this.getEnPassantFENString();
            fen += ' ' + 0;
            fen += ' ' + this.fullMoveCount;
            this.fen = fen;
        };
        Board.prototype.isXYInPointSelection = function (i, j) {
            return false;
        };
        Board.prototype.reversePoint = function (point) {
            if (point) {
                point.row = Math.abs(point.row - 7);
                point.col = Math.abs(point.col - 7);
            }
        };
        return Board;
    }());

    var MoveTranslation = /** @class */ (function () {
        function MoveTranslation(xAxis, yAxis, reverted) {
            this._xAxis = xAxis;
            this._yAxis = yAxis;
            this._reverted = reverted;
        }
        Object.defineProperty(MoveTranslation.prototype, "xAxis", {
            get: function () {
                return this._xAxis;
            },
            set: function (value) {
                this._xAxis = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MoveTranslation.prototype, "yAxis", {
            get: function () {
                return this._yAxis;
            },
            set: function (value) {
                this._yAxis = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MoveTranslation.prototype, "reverted", {
            get: function () {
                return this._reverted;
            },
            set: function (value) {
                this._reverted = value;
            },
            enumerable: false,
            configurable: true
        });
        return MoveTranslation;
    }());

    var MoveUtils = /** @class */ (function () {
        function MoveUtils() {
        }
        MoveUtils.willMoveCauseCheck = function (currentColor, row, col, destRow, destCol, board) {
            var srcPiece = board.getPieceByField(row, col);
            var destPiece = board.getPieceByField(destRow, destCol);
            if (srcPiece) {
                srcPiece.point.row = destRow;
                srcPiece.point.col = destCol;
            }
            if (destPiece) {
                board.pieces = board.pieces.filter(function (piece) { return piece !== destPiece; });
            }
            var isBound = board.isKingInCheck(currentColor, board.pieces);
            if (srcPiece) {
                srcPiece.point.col = col;
                srcPiece.point.row = row;
            }
            if (destPiece) {
                board.pieces.push(destPiece);
            }
            return isBound;
        };
        MoveUtils.format = function (sourcePoint, destPoint, reverted) {
            if (reverted) {
                var sourceX = 104 - sourcePoint.col;
                var destX = 104 - destPoint.col;
                return (String.fromCharCode(sourceX) +
                    (sourcePoint.row + 1) +
                    String.fromCharCode(destX) +
                    (destPoint.row + 1));
            }
            else {
                var incrementX = 97;
                return (String.fromCharCode(sourcePoint.col + incrementX) +
                    (Math.abs(sourcePoint.row - 7) + 1) +
                    String.fromCharCode(destPoint.col + incrementX) +
                    (Math.abs(destPoint.row - 7) + 1));
            }
        };
        MoveUtils.translateCoordsToIndex = function (coords, reverted) {
            var xAxis;
            var yAxis;
            if (reverted) {
                xAxis = 104 - coords.charCodeAt(0);
                yAxis = +coords.charAt(1) - 1;
            }
            else {
                xAxis = coords.charCodeAt(0) - 97;
                yAxis = Math.abs(+coords.charAt(1) - 8);
            }
            return new MoveTranslation(xAxis, yAxis, reverted);
        };
        return MoveUtils;
    }());

    var PieceAbstractDecorator = /** @class */ (function () {
        function PieceAbstractDecorator(piece) {
            this.piece = piece;
        }
        return PieceAbstractDecorator;
    }());

    var AvailableMoveDecorator = /** @class */ (function (_super) {
        __extends(AvailableMoveDecorator, _super);
        function AvailableMoveDecorator(piece, pointClicked, color, board) {
            var _this = _super.call(this, piece) || this;
            _this.pointClicked = pointClicked;
            _this.color = color;
            _this.board = board;
            return _this;
        }
        AvailableMoveDecorator.prototype.getPossibleCaptures = function () {
            var _this = this;
            return this.piece
                .getPossibleCaptures()
                .filter(function (point) { return !MoveUtils.willMoveCauseCheck(_this.color, _this.pointClicked.row, _this.pointClicked.col, point.row, point.col, _this.board); });
        };
        AvailableMoveDecorator.prototype.getPossibleMoves = function () {
            var _this = this;
            return this.piece
                .getPossibleMoves()
                .filter(function (point) { return !MoveUtils.willMoveCauseCheck(_this.color, _this.pointClicked.row, _this.pointClicked.col, point.row, point.col, _this.board); });
        };
        return AvailableMoveDecorator;
    }(PieceAbstractDecorator));

    var Constants = /** @class */ (function () {
        function Constants() {
        }
        return Constants;
    }());
    Constants.DEFAULT_DARK_TILE_COLOR = 'rgb(97, 84, 61)';
    Constants.DEFAULT_LIGHT_TILE_COLOR = '#BAA378';
    Constants.DEFAULT_SIZE = 500;
    Constants.MIN_BOARD_SIZE = 100;
    Constants.MAX_BOARD_SIZE = 4000;

    var PieceIconInputManager = /** @class */ (function () {
        function PieceIconInputManager() {
            this._defaultIcons = false;
        }
        Object.defineProperty(PieceIconInputManager.prototype, "pieceIconInput", {
            get: function () {
                return this._pieceIconInput;
            },
            set: function (value) {
                this._pieceIconInput = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PieceIconInputManager.prototype, "defaultIcons", {
            get: function () {
                return this._defaultIcons;
            },
            set: function (value) {
                this._defaultIcons = value;
            },
            enumerable: false,
            configurable: true
        });
        PieceIconInputManager.prototype.isDefaultIcons = function () {
            return this.pieceIconInput === undefined || this.pieceIconInput === null;
        };
        PieceIconInputManager.prototype.getPieceIcon = function (piece) {
            var isWhite = (piece.color === Color.WHITE);
            switch (piece.constructor) {
                case King:
                    return isWhite ? this.pieceIconInput.whiteKingUrl : this.pieceIconInput.blackKingUrl;
                case Queen:
                    return isWhite ? this.pieceIconInput.whiteQueenUrl : this.pieceIconInput.blackQueenUrl;
                case Rook:
                    return isWhite ? this.pieceIconInput.whiteRookUrl : this.pieceIconInput.blackRookUrl;
                case Bishop:
                    return isWhite ? this.pieceIconInput.whiteBishopUrl : this.pieceIconInput.blackBishopUrl;
                case Knight:
                    return isWhite ? this.pieceIconInput.whiteKnightUrl : this.pieceIconInput.blackKnightUrl;
                case Pawn:
                    return isWhite ? this.pieceIconInput.whitePawnUrl : this.pieceIconInput.blackPawnUrl;
            }
        };
        PieceIconInputManager.prototype.loadDefaultData = function () {
            this.pieceIconInput = {
                blackBishopUrl: '',
                blackKingUrl: '',
                blackKnightUrl: '',
                blackQueenUrl: '',
                blackRookUrl: '',
                whiteBishopUrl: '',
                whiteKingUrl: '',
                whiteKnightUrl: '',
                whitePawnUrl: '',
                whiteQueenUrl: '',
                whiteRookUrl: '',
                blackPawnUrl: 'a'
            };
        };
        return PieceIconInputManager;
    }());

    var NgxChessBoardService = /** @class */ (function () {
        function NgxChessBoardService() {
            this.componentMethodCallSource = new rxjs.Subject();
            this.componentMethodCalled$ = this.componentMethodCallSource.asObservable();
        }
        NgxChessBoardService.prototype.reset = function () {
            this.componentMethodCallSource.next();
        };
        return NgxChessBoardService;
    }());
    NgxChessBoardService.ɵfac = function NgxChessBoardService_Factory(t) { return new (t || NgxChessBoardService)(); };
    NgxChessBoardService.ɵprov = i0.ɵɵdefineInjectable({ token: NgxChessBoardService, factory: NgxChessBoardService.ɵfac, providedIn: 'root' });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(NgxChessBoardService, [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root',
                    }]
            }], null, null);
    })();

    var _c0 = ["myModal"];
    var PiecePromotionModalComponent = /** @class */ (function () {
        function PiecePromotionModalComponent() {
            this.opened = false;
        }
        PiecePromotionModalComponent.prototype.open = function (closeCallback) {
            this.opened = true;
            this.onCloseCallback = closeCallback;
            this.modal.nativeElement.style.display = 'block';
        };
        PiecePromotionModalComponent.prototype.changeSelection = function (index) {
            this.modal.nativeElement.style.display = 'none';
            this.opened = false;
            this.onCloseCallback(index);
        };
        return PiecePromotionModalComponent;
    }());
    PiecePromotionModalComponent.ɵfac = function PiecePromotionModalComponent_Factory(t) { return new (t || PiecePromotionModalComponent)(); };
    PiecePromotionModalComponent.ɵcmp = i0.ɵɵdefineComponent({ type: PiecePromotionModalComponent, selectors: [["app-piece-promotion-modal"]], viewQuery: function PiecePromotionModalComponent_Query(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵviewQuery(_c0, true);
            }
            if (rf & 2) {
                var _t;
                i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.modal = _t.first);
            }
        }, decls: 13, vars: 0, consts: [[1, "container"], ["myModal", ""], [1, "wrapper"], [1, "content"], [1, "piece-wrapper"], [1, "piece", 3, "click"]], template: function PiecePromotionModalComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "div", 0, 1);
                i0.ɵɵelementStart(2, "div", 2);
                i0.ɵɵelementStart(3, "div", 3);
                i0.ɵɵelementStart(4, "div", 4);
                i0.ɵɵelementStart(5, "div", 5);
                i0.ɵɵlistener("click", function PiecePromotionModalComponent_Template_div_click_5_listener() { return ctx.changeSelection(1); });
                i0.ɵɵtext(6, "\u265B");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(7, "div", 5);
                i0.ɵɵlistener("click", function PiecePromotionModalComponent_Template_div_click_7_listener() { return ctx.changeSelection(2); });
                i0.ɵɵtext(8, "\u265C");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(9, "div", 5);
                i0.ɵɵlistener("click", function PiecePromotionModalComponent_Template_div_click_9_listener() { return ctx.changeSelection(3); });
                i0.ɵɵtext(10, "\u265D");
                i0.ɵɵelementEnd();
                i0.ɵɵelementStart(11, "div", 5);
                i0.ɵɵlistener("click", function PiecePromotionModalComponent_Template_div_click_11_listener() { return ctx.changeSelection(4); });
                i0.ɵɵtext(12, "\u265E");
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
                i0.ɵɵelementEnd();
            }
        }, styles: [".container[_ngcontent-%COMP%]{background-color:rgba(0,0,0,.4);color:#000;display:none;overflow:auto;position:absolute;top:0;z-index:1}.container[_ngcontent-%COMP%], .wrapper[_ngcontent-%COMP%]{height:100%;width:100%}.content[_ngcontent-%COMP%], .wrapper[_ngcontent-%COMP%]{position:relative}.content[_ngcontent-%COMP%]{background-color:#fefefe;border:1px solid #888;font-size:100%;height:40%;margin:auto;padding:10px;top:30%;width:90%}.piece[_ngcontent-%COMP%]{cursor:pointer;display:inline-block;font-size:5rem;height:100%;width:25%}.piece[_ngcontent-%COMP%]:hover{background-color:#ccc;border-radius:5px}.piece-wrapper[_ngcontent-%COMP%]{height:80%;width:100%}#close-button[_ngcontent-%COMP%]{background-color:#4caf50;border:none;border-radius:4px;color:#fff;display:inline-block;padding-left:5px;padding-right:5px;text-align:center;text-decoration:none}.selected[_ngcontent-%COMP%]{border:2px solid #00b919;border-radius:4px;box-sizing:border-box}"] });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(PiecePromotionModalComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'app-piece-promotion-modal',
                        templateUrl: './piece-promotion-modal.component.html',
                        styleUrls: ['./piece-promotion-modal.component.scss']
                    }]
            }], null, { modal: [{
                    type: i0.ViewChild,
                    args: ['myModal', { static: false }]
                }] });
    })();

    var _c0$1 = ["boardRef"];
    var _c1 = ["modal"];
    function NgxChessBoardComponent_div_3_div_1_span_1_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelementStart(0, "span", 15);
            i0.ɵɵtext(1);
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var i_r7 = i0.ɵɵnextContext(2).index;
            var ctx_r11 = i0.ɵɵnextContext();
            i0.ɵɵstyleProp("color", i_r7 % 2 === 0 ? ctx_r11.lightTileColor : ctx_r11.darkTileColor)("font-size", ctx_r11.pieceSize / 4, "px");
            i0.ɵɵadvance(1);
            i0.ɵɵtextInterpolate1(" ", ctx_r11.coords.yCoords[i_r7], " ");
        }
    }
    function NgxChessBoardComponent_div_3_div_1_span_2_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelementStart(0, "span", 16);
            i0.ɵɵtext(1);
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var j_r10 = i0.ɵɵnextContext().index;
            var ctx_r12 = i0.ɵɵnextContext(2);
            i0.ɵɵstyleProp("color", j_r10 % 2 === 0 ? ctx_r12.lightTileColor : ctx_r12.darkTileColor)("font-size", ctx_r12.pieceSize / 4, "px");
            i0.ɵɵadvance(1);
            i0.ɵɵtextInterpolate1(" ", ctx_r12.coords.xCoords[j_r10], " ");
        }
    }
    function NgxChessBoardComponent_div_3_div_1_div_3_Template(rf, ctx) {
        if (rf & 1) {
            var _r18_1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 17);
            i0.ɵɵelementStart(1, "div", 18);
            i0.ɵɵlistener("cdkDragEnded", function NgxChessBoardComponent_div_3_div_1_div_3_Template_div_cdkDragEnded_1_listener($event) { i0.ɵɵrestoreView(_r18_1); var ctx_r17 = i0.ɵɵnextContext(3); return ctx_r17.dragEnded($event); })("cdkDragStarted", function NgxChessBoardComponent_div_3_div_1_div_3_Template_div_cdkDragStarted_1_listener($event) { i0.ɵɵrestoreView(_r18_1); var ctx_r19 = i0.ɵɵnextContext(3); return ctx_r19.dragStart($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var j_r10 = i0.ɵɵnextContext().index;
            var i_r7 = i0.ɵɵnextContext().index;
            var ctx_r13 = i0.ɵɵnextContext();
            i0.ɵɵadvance(1);
            i0.ɵɵstyleProp("font-size", ctx_r13.pieceSize + "px");
            i0.ɵɵproperty("cdkDragDisabled", ctx_r13.dragDisabled)("innerHTML", ctx_r13.pieceIconManager.isDefaultIcons() ? ctx_r13.getPieceByPoint(i_r7, j_r10).constant.icon : "", i0.ɵɵsanitizeHtml)("ngClass", "piece")("ngStyle", ctx_r13.pieceIconManager.isDefaultIcons() ? "" : ctx_r13.getCustomPieceIcons(ctx_r13.getPieceByPoint(i_r7, j_r10)));
        }
    }
    function NgxChessBoardComponent_div_3_div_1_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 11);
            i0.ɵɵtemplate(1, NgxChessBoardComponent_div_3_div_1_span_1_Template, 2, 5, "span", 12);
            i0.ɵɵtemplate(2, NgxChessBoardComponent_div_3_div_1_span_2_Template, 2, 5, "span", 13);
            i0.ɵɵtemplate(3, NgxChessBoardComponent_div_3_div_1_div_3_Template, 2, 6, "div", 14);
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var j_r10 = ctx.index;
            var i_r7 = i0.ɵɵnextContext().index;
            var ctx_r8 = i0.ɵɵnextContext();
            i0.ɵɵstyleProp("background-color", (i_r7 + j_r10) % 2 === 0 ? ctx_r8.lightTileColor : ctx_r8.darkTileColor);
            i0.ɵɵclassProp("current-selection", ctx_r8.board.isXYInActiveMove(i_r7, j_r10))("dest-move", ctx_r8.board.isXYInDestMove(i_r7, j_r10))("king-check", ctx_r8.isKingChecked(ctx_r8.getPieceByPoint(i_r7, j_r10)))("point-circle", ctx_r8.board.isXYInPointSelection(i_r7, j_r10))("possible-capture", ctx_r8.board.isXYInPossibleCaptures(i_r7, j_r10))("possible-point", ctx_r8.board.isXYInPossibleMoves(i_r7, j_r10))("source-move", ctx_r8.board.isXYInSourceMove(i_r7, j_r10));
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("ngIf", ctx_r8.showCoords && j_r10 === 7);
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("ngIf", ctx_r8.showCoords && i_r7 === 7);
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("ngIf", ctx_r8.getPieceByPoint(i_r7, j_r10));
        }
    }
    function NgxChessBoardComponent_div_3_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 9);
            i0.ɵɵtemplate(1, NgxChessBoardComponent_div_3_div_1_Template, 4, 19, "div", 10);
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var row_r6 = ctx.$implicit;
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("ngForOf", row_r6);
        }
    }
    function NgxChessBoardComponent__svg_defs_5_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵnamespaceSVG();
            i0.ɵɵelementStart(0, "defs");
            i0.ɵɵelementStart(1, "marker", 19);
            i0.ɵɵelement(2, "path", 20);
            i0.ɵɵelementEnd();
            i0.ɵɵelementEnd();
        }
        if (rf & 2) {
            var color_r23 = ctx.$implicit;
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("id", color_r23 + "Arrow");
            i0.ɵɵadvance(1);
            i0.ɵɵstyleProp("fill", color_r23);
        }
    }
    function NgxChessBoardComponent__svg_line_6_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵnamespaceSVG();
            i0.ɵɵelement(0, "line", 21);
        }
        if (rf & 2) {
            var arrow_r24 = ctx.$implicit;
            i0.ɵɵattribute("marker-end", "url(#" + arrow_r24.end.color + "Arrow)")("stroke", arrow_r24.end.color)("x1", arrow_r24.start.x)("x2", arrow_r24.end.x)("y1", arrow_r24.start.y)("y2", arrow_r24.end.y);
        }
    }
    function NgxChessBoardComponent__svg_circle_8_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵnamespaceSVG();
            i0.ɵɵelement(0, "circle", 22);
        }
        if (rf & 2) {
            var circle_r25 = ctx.$implicit;
            var ctx_r4 = i0.ɵɵnextContext();
            i0.ɵɵattribute("cx", circle_r25.drawPoint.x)("cy", circle_r25.drawPoint.y)("r", ctx_r4.heightAndWidth / 18)("stroke", circle_r25.drawPoint.color);
        }
    }
    var _c2 = function () { return ["red", "green", "blue", "orange"]; };
    var NgxChessBoardComponent = /** @class */ (function () {
        function NgxChessBoardComponent(ngxChessBoardService) {
            this.ngxChessBoardService = ngxChessBoardService;
            this.darkTileColor = Constants.DEFAULT_DARK_TILE_COLOR;
            this.lightTileColor = Constants.DEFAULT_LIGHT_TILE_COLOR;
            this.showCoords = true;
            this.dragDisabled = false;
            this.drawDisabled = false;
            this.lightDisabled = false;
            this.darkDisabled = false;
            /**
             * Enabling free mode removes turn-based restriction and allows to move any piece freely!
             */
            this.freeMode = false;
            this.moveChange = new i0.EventEmitter();
            this.checkmate = new i0.EventEmitter();
            this.stalemate = new i0.EventEmitter();
            this.selected = false;
            this.coords = new CoordsProvider();
            this.disabling = false;
            this.heightAndWidth = Constants.DEFAULT_SIZE;
            this.board = new Board();
            this.boardLoader = new BoardLoader(this.board);
            this.boardLoader.addPieces();
            this.boardStateProvider = new BoardStateProvider();
            this.moveHistoryProvider = new HistoryMoveProvider();
            this.drawProvider = new DrawProvider();
            this.pieceIconManager = new PieceIconInputManager();
        }
        Object.defineProperty(NgxChessBoardComponent.prototype, "size", {
            set: function (size) {
                if (size &&
                    size >= Constants.MIN_BOARD_SIZE &&
                    size <= Constants.MAX_BOARD_SIZE) {
                    this.heightAndWidth = size;
                }
                else {
                    this.heightAndWidth = Constants.DEFAULT_SIZE;
                }
                this.drawProvider.clear();
                this.calculatePieceSize();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NgxChessBoardComponent.prototype, "pieceIcons", {
            set: function (pieceIcons) {
                this.pieceIconManager.pieceIconInput = pieceIcons;
            },
            enumerable: false,
            configurable: true
        });
        NgxChessBoardComponent.prototype.onRightClick = function (event) {
            event.preventDefault();
        };
        NgxChessBoardComponent.prototype.ngOnChanges = function (changes) {
            if ((changes.lightDisabled &&
                this.lightDisabled &&
                this.board.currentWhitePlayer) ||
                (changes.darkDisabled &&
                    this.darkDisabled &&
                    !this.board.currentWhitePlayer)) {
                this.board.possibleCaptures = [];
                this.board.possibleMoves = [];
            }
        };
        NgxChessBoardComponent.prototype.ngOnInit = function () {
            var _this = this;
            this.ngxChessBoardService.componentMethodCalled$.subscribe(function () {
                _this.board.reset();
            });
            this.calculatePieceSize();
        };
        NgxChessBoardComponent.prototype.onMouseUp = function (event) {
            if (event.button !== 0 && !this.drawDisabled) {
                this.addDrawPoint(event.x, event.y, event.ctrlKey, event.altKey, event.shiftKey);
                return;
            }
            this.drawProvider.clear();
            if (this.dragDisabled) {
                return;
            }
            var pointClicked = this.getClickPoint(event);
            if (this.board.activePiece &&
                pointClicked.isEqual(this.board.activePiece.point) &&
                this.disabling) {
                this.disableSelection();
                this.disabling = false;
                return;
            }
            var pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
            if (this.isPieceDisabled(pieceClicked)) {
                return;
            }
            if (this.selected) {
                this.handleClickEvent(pointClicked, false);
                //   this.possibleMoves = activePiece.getPossibleMoves();
            }
        };
        NgxChessBoardComponent.prototype.onPieceClicked = function (pieceClicked, pointClicked) {
            if ((this.board.currentWhitePlayer && pieceClicked.color === Color.BLACK) ||
                (!this.board.currentWhitePlayer && pieceClicked.color === Color.WHITE)) {
                return;
            }
            this.prepareActivePiece(pieceClicked, pointClicked);
        };
        /**
         * Validates whether freemode is turned on!
         */
        NgxChessBoardComponent.prototype.isFreeMode = function () {
            return this.freeMode;
        };
        /**
         * Processes logic to allow freeMode based logic processing
         */
        NgxChessBoardComponent.prototype.onFreeMode = function (pieceClicked) {
            if (!this.isFreeMode() ||
                pieceClicked === undefined ||
                pieceClicked === null) {
                return;
            }
            // sets player as white in-case white pieces are selected, and vice-versa when black is selected
            this.board.currentWhitePlayer = pieceClicked.color === Color.WHITE;
        };
        NgxChessBoardComponent.prototype.afterMoveActions = function (promotionIndex) {
            this.checkIfPawnFirstMove(this.board.activePiece);
            this.checkIfRookMoved(this.board.activePiece);
            this.checkIfKingMoved(this.board.activePiece);
            this.board.blackKingChecked = this.board.isKingInCheck(Color.BLACK, this.board.pieces);
            this.board.whiteKingChecked = this.board.isKingInCheck(Color.WHITE, this.board.pieces);
            var check = this.board.blackKingChecked || this.board.whiteKingChecked;
            var checkmate = this.checkForPossibleMoves(Color.BLACK) ||
                this.checkForPossibleMoves(Color.WHITE);
            var stalemate = this.checkForPat(Color.BLACK) || this.checkForPat(Color.WHITE);
            this.disabling = false;
            this.board.calculateFEN();
            var lastMove = this.moveHistoryProvider.getLastMove();
            if (lastMove && promotionIndex) {
                lastMove.move += promotionIndex;
            }
            this.moveChange.emit(Object.assign(Object.assign({}, lastMove), { check: check,
                checkmate: checkmate,
                stalemate: stalemate, fen: this.board.fen, freeMode: this.freeMode }));
        };
        NgxChessBoardComponent.prototype.disableSelection = function () {
            this.selected = false;
            this.board.possibleCaptures = [];
            this.board.activePiece = null;
            this.board.possibleMoves = [];
        };
        NgxChessBoardComponent.prototype.prepareActivePiece = function (pieceClicked, pointClicked) {
            this.board.activePiece = pieceClicked;
            this.selected = true;
            this.board.possibleCaptures = new AvailableMoveDecorator(pieceClicked, pointClicked, this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK, this.board).getPossibleCaptures();
            this.board.possibleMoves = new AvailableMoveDecorator(pieceClicked, pointClicked, this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK, this.board).getPossibleMoves();
        };
        NgxChessBoardComponent.prototype.getPieceByPoint = function (row, col) {
            row = Math.floor(row);
            col = Math.floor(col);
            return this.board.pieces.find(function (piece) { return piece.point.col === col && piece.point.row === row; });
        };
        NgxChessBoardComponent.prototype.isKingChecked = function (piece) {
            if (piece instanceof King) {
                return piece.color === Color.WHITE
                    ? this.board.whiteKingChecked
                    : this.board.blackKingChecked;
            }
        };
        NgxChessBoardComponent.prototype.getClickPoint = function (event) {
            return new Point(Math.floor((event.y -
                this.boardRef.nativeElement.getBoundingClientRect().top) /
                (this.boardRef.nativeElement.getBoundingClientRect()
                    .height /
                    8)), Math.floor((event.x -
                this.boardRef.nativeElement.getBoundingClientRect().left) /
                (this.boardRef.nativeElement.getBoundingClientRect().width /
                    8)));
        };
        NgxChessBoardComponent.prototype.movePiece = function (toMovePiece, newPoint, promotionIndex) {
            var destPiece = this.board.pieces.find(function (piece) { return piece.point.col === newPoint.col &&
                piece.point.row === newPoint.row; });
            if (destPiece && toMovePiece.color !== destPiece.color) {
                this.board.pieces = this.board.pieces.filter(function (piece) { return piece !== destPiece; });
            }
            else {
                if (destPiece && toMovePiece.color === destPiece.color) {
                    return;
                }
            }
            var move = new HistoryMove(MoveUtils.format(toMovePiece.point, newPoint, this.board.reverted), toMovePiece.constant.name, toMovePiece.color === Color.WHITE ? 'white' : 'black', !!destPiece);
            this.moveHistoryProvider.addMove(move);
            if (toMovePiece instanceof King) {
                var squaresMoved = Math.abs(newPoint.col - toMovePiece.point.col);
                if (squaresMoved > 1) {
                    if (newPoint.col < 3) {
                        var leftRook = this.board.getPieceByField(toMovePiece.point.row, 0);
                        if (!this.freeMode) {
                            leftRook.point.col = this.board.reverted ? 2 : 3;
                        }
                    }
                    else {
                        var rightRook = this.board.getPieceByField(toMovePiece.point.row, 7);
                        if (!this.freeMode) {
                            rightRook.point.col = this.board.reverted ? 4 : 5;
                        }
                    }
                }
            }
            if (toMovePiece instanceof Pawn) {
                this.checkIfPawnTakesEnPassant(newPoint);
                this.checkIfPawnEnpassanted(toMovePiece, newPoint);
            }
            toMovePiece.point = newPoint;
            this.increaseFullMoveCount();
            this.board.currentWhitePlayer = !this.board.currentWhitePlayer;
            if (!this.checkForPawnPromote(toMovePiece, promotionIndex)) {
                this.afterMoveActions();
            }
        };
        NgxChessBoardComponent.prototype.checkIfPawnFirstMove = function (piece) {
            if (piece instanceof Pawn) {
                piece.isMovedAlready = true;
            }
        };
        NgxChessBoardComponent.prototype.checkForPawnPromote = function (toPromotePiece, promotionIndex) {
            if (!(toPromotePiece instanceof Pawn)) {
                return;
            }
            if (toPromotePiece.point.row === 0 || toPromotePiece.point.row === 7) {
                this.board.pieces = this.board.pieces.filter(function (piece) { return piece !== toPromotePiece; });
                // When we make move manually, we pass promotion index already, so we don't need
                // to acquire it from promote dialog
                if (!promotionIndex) {
                    this.openPromoteDialog(toPromotePiece);
                }
                else {
                    this.resolvePromotionChoice(toPromotePiece, promotionIndex);
                    this.afterMoveActions(promotionIndex);
                }
                return true;
            }
        };
        NgxChessBoardComponent.prototype.openPromoteDialog = function (piece) {
            var _this = this;
            this.modal.open(function (index) {
                _this.resolvePromotionChoice(piece, index);
                _this.afterMoveActions(index);
            });
        };
        NgxChessBoardComponent.prototype.resolvePromotionChoice = function (piece, index) {
            var isWhite = piece.color === Color.WHITE;
            switch (index) {
                case 1:
                    this.board.pieces.push(new Queen(piece.point, piece.color, isWhite
                        ? UnicodeConstants.WHITE_QUEEN
                        : UnicodeConstants.BLACK_QUEEN, this.board));
                    break;
                case 2:
                    this.board.pieces.push(new Rook(piece.point, piece.color, isWhite
                        ? UnicodeConstants.WHITE_ROOK
                        : UnicodeConstants.BLACK_ROOK, this.board));
                    break;
                case 3:
                    this.board.pieces.push(new Bishop(piece.point, piece.color, isWhite
                        ? UnicodeConstants.WHITE_BISHOP
                        : UnicodeConstants.BLACK_BISHOP, this.board));
                    break;
                case 4:
                    this.board.pieces.push(new Knight(piece.point, piece.color, isWhite
                        ? UnicodeConstants.WHITE_KNIGHT
                        : UnicodeConstants.BLACK_KNIGHT, this.board));
                    break;
            }
        };
        NgxChessBoardComponent.prototype.reset = function () {
            this.boardStateProvider.clear();
            this.moveHistoryProvider.clear();
            this.boardLoader.addPieces();
            this.board.reset();
            this.coords.reset();
            this.drawProvider.clear();
            this.freeMode = false;
        };
        NgxChessBoardComponent.prototype.reverse = function () {
            this.selected = false;
            this.board.reverse();
            this.coords.reverse();
        };
        NgxChessBoardComponent.prototype.updateBoard = function (board) {
            this.board = board;
            this.boardLoader.setBoard(this.board);
            this.board.possibleCaptures = [];
            this.board.possibleMoves = [];
        };
        NgxChessBoardComponent.prototype.undo = function () {
            if (!this.boardStateProvider.isEmpty()) {
                var lastBoard = this.boardStateProvider.pop().board;
                if (this.board.reverted) {
                    lastBoard.reverse();
                }
                this.board = lastBoard;
                this.boardLoader.setBoard(this.board);
                this.board.possibleCaptures = [];
                this.board.possibleMoves = [];
                this.moveHistoryProvider.pop();
            }
        };
        NgxChessBoardComponent.prototype.getMoveHistory = function () {
            return this.moveHistoryProvider.getAll();
        };
        NgxChessBoardComponent.prototype.setFEN = function (fen) {
            try {
                this.boardLoader.loadFEN(fen);
                this.board.possibleCaptures = [];
                this.board.possibleMoves = [];
                this.coords.reset();
            }
            catch (exception) {
                this.boardLoader.addPieces();
            }
        };
        NgxChessBoardComponent.prototype.getFEN = function () {
            return this.board.fen;
        };
        NgxChessBoardComponent.prototype.dragEnded = function (event) {
            event.source.reset();
            event.source.element.nativeElement.style.zIndex = '0';
            event.source.element.nativeElement.style.pointerEvents = 'auto';
            event.source.element.nativeElement.style.touchAction = 'auto';
        };
        NgxChessBoardComponent.prototype.dragStart = function (event) {
            var style = event.source.element.nativeElement.style;
            style.position = 'relative';
            style.zIndex = '1000';
            style.touchAction = 'none';
            style.pointerEvents = 'none';
        };
        NgxChessBoardComponent.prototype.onMouseDown = function (event) {
            if (event.button !== 0) {
                this.drawPoint = this.getDrawingPoint(event.x, event.y, event.ctrlKey, event.altKey, event.shiftKey);
                return;
            }
            var pointClicked = this.getClickPoint(event);
            this.drawProvider.clear();
            if (this.board.activePiece &&
                pointClicked.isEqual(this.board.activePiece.point)) {
                this.disabling = true;
                return;
            }
            var pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
            if (this.freeMode) {
                if (pieceClicked) {
                    this.board.currentWhitePlayer = (pieceClicked.color === Color.WHITE);
                }
            }
            if (this.isPieceDisabled(pieceClicked)) {
                return;
            }
            if (this.selected) {
                this.handleClickEvent(pointClicked, true);
            }
            else {
                if (pieceClicked) {
                    this.onFreeMode(pieceClicked);
                    this.onPieceClicked(pieceClicked, pointClicked);
                }
            }
        };
        NgxChessBoardComponent.prototype.getDrawingPoint = function (x, y, crtl, alt, shift) {
            var squareSize = this.heightAndWidth / 8;
            var xx = Math.floor((x - this.boardRef.nativeElement.getBoundingClientRect().left) /
                squareSize);
            var yy = Math.floor((y - this.boardRef.nativeElement.getBoundingClientRect().top) /
                squareSize);
            var color = 'green';
            if (crtl || shift) {
                color = 'red';
            }
            if (alt) {
                color = 'blue';
            }
            if ((shift || crtl) && alt) {
                color = 'orange';
            }
            return new DrawPoint(Math.floor(xx * squareSize + squareSize / 2), Math.floor(yy * squareSize + squareSize / 2), color);
        };
        NgxChessBoardComponent.prototype.checkIfRookMoved = function (piece) {
            if (piece instanceof Rook) {
                piece.isMovedAlready = true;
            }
        };
        NgxChessBoardComponent.prototype.checkIfKingMoved = function (piece) {
            if (piece instanceof King) {
                piece.isMovedAlready = true;
            }
        };
        NgxChessBoardComponent.prototype.checkForPossibleMoves = function (color) {
            var _this = this;
            if (!this.board.pieces
                .filter(function (piece) { return piece.color === color; })
                .some(function (piece) { return piece
                .getPossibleMoves()
                .some(function (move) { return !MoveUtils.willMoveCauseCheck(color, piece.point.row, piece.point.col, move.row, move.col, _this.board); }) ||
                piece
                    .getPossibleCaptures()
                    .some(function (capture) { return !MoveUtils.willMoveCauseCheck(color, piece.point.row, piece.point.col, capture.row, capture.col, _this.board); }); })) {
                return true;
            }
            else {
                return false;
            }
        };
        NgxChessBoardComponent.prototype.checkForPat = function (color) {
            if (color === Color.WHITE && !this.board.whiteKingChecked) {
                return this.checkForPossibleMoves(color);
            }
            else {
                if (color === Color.BLACK && !this.board.blackKingChecked) {
                    return this.checkForPossibleMoves(color);
                }
            }
        };
        NgxChessBoardComponent.prototype.checkIfPawnEnpassanted = function (piece, newPoint) {
            if (Math.abs(piece.point.row - newPoint.row) > 1) {
                this.board.enPassantPiece = piece;
                this.board.enPassantPoint = new Point((piece.point.row + newPoint.row) / 2, piece.point.col);
            }
            else {
                this.board.enPassantPoint = null;
                this.board.enPassantPiece = null;
            }
        };
        NgxChessBoardComponent.prototype.checkIfPawnTakesEnPassant = function (newPoint) {
            var _this = this;
            if (newPoint.isEqual(this.board.enPassantPoint)) {
                this.board.pieces = this.board.pieces.filter(function (piece) { return piece !== _this.board.enPassantPiece; });
                this.board.enPassantPoint = null;
                this.board.enPassantPiece = null;
            }
        };
        NgxChessBoardComponent.prototype.saveClone = function () {
            var clone = this.board.clone();
            if (this.board.reverted) {
                clone.reverse();
            }
            this.boardStateProvider.addMove(new BoardState(clone));
        };
        NgxChessBoardComponent.prototype.saveMoveClone = function () {
            var clone = this.board.clone();
            if (this.board.reverted) {
                clone.reverse();
            }
            this.moveStateProvider.addMove(new BoardState(clone));
        };
        NgxChessBoardComponent.prototype.calculatePieceSize = function () {
            this.pieceSize = this.heightAndWidth / 10;
        };
        NgxChessBoardComponent.prototype.increaseFullMoveCount = function () {
            if (!this.board.currentWhitePlayer) {
                ++this.board.fullMoveCount;
            }
        };
        NgxChessBoardComponent.prototype.handleClickEvent = function (pointClicked, isMouseDown) {
            var moving = false;
            if ((this.board.isPointInPossibleMoves(pointClicked) ||
                this.board.isPointInPossibleCaptures(pointClicked)) || this.freeMode) {
                this.saveClone();
                this.board.lastMoveSrc = new Point(this.board.activePiece.point.row, this.board.activePiece.point.col);
                this.board.lastMoveDest = pointClicked;
                this.movePiece(this.board.activePiece, pointClicked);
                if (!this.board.activePiece.point.isEqual(this.board.lastMoveSrc)) {
                    moving = true;
                }
            }
            if (isMouseDown || moving) {
                this.disableSelection();
            }
            this.disableSelection();
            var pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
            if (pieceClicked && !moving) {
                this.onFreeMode(pieceClicked);
                this.onPieceClicked(pieceClicked, pointClicked);
            }
        };
        NgxChessBoardComponent.prototype.addDrawPoint = function (x, y, crtl, alt, shift) {
            var upPoint = this.getDrawingPoint(x, y, crtl, alt, shift);
            if (this.drawPoint.isEqual(upPoint)) {
                var circle = new Circle();
                circle.drawPoint = upPoint;
                if (!this.drawProvider.containsCircle(circle)) {
                    this.drawProvider.addCircle(circle);
                }
                else {
                    this.drawProvider.reomveCircle(circle);
                }
            }
            else {
                var arrow = new Arrow();
                arrow.start = this.drawPoint;
                arrow.end = upPoint;
                if (!this.drawProvider.containsArrow(arrow)) {
                    this.drawProvider.addArrow(arrow);
                }
                else {
                    this.drawProvider.removeArrow(arrow);
                }
            }
        };
        NgxChessBoardComponent.prototype.move = function (coords) {
            if (coords) {
                var sourceIndexes = MoveUtils.translateCoordsToIndex(coords.substring(0, 2), this.board.reverted);
                var destIndexes = MoveUtils.translateCoordsToIndex(coords.substring(2, 4), this.board.reverted);
                var srcPiece = this.getPieceByPoint(sourceIndexes.yAxis, sourceIndexes.xAxis);
                if (srcPiece) {
                    if ((this.board.currentWhitePlayer &&
                        srcPiece.color === Color.BLACK) ||
                        (!this.board.currentWhitePlayer &&
                            srcPiece.color === Color.WHITE)) {
                        return;
                    }
                    this.prepareActivePiece(srcPiece, srcPiece.point);
                    if (this.board.isPointInPossibleMoves(new Point(destIndexes.yAxis, destIndexes.xAxis)) ||
                        this.board.isPointInPossibleCaptures(new Point(destIndexes.yAxis, destIndexes.xAxis))) {
                        this.saveClone();
                        this.movePiece(srcPiece, new Point(destIndexes.yAxis, destIndexes.xAxis), coords.length === 5 ? +coords.substring(4, 5) : 0);
                        this.board.lastMoveSrc = new Point(sourceIndexes.yAxis, sourceIndexes.xAxis);
                        this.board.lastMoveDest = new Point(destIndexes.yAxis, destIndexes.xAxis);
                        this.disableSelection();
                    }
                    else {
                        this.disableSelection();
                    }
                }
            }
        };
        NgxChessBoardComponent.prototype.getCustomPieceIcons = function (piece) {
            return JSON.parse("{ \"background-image\": \"url('" + this.pieceIconManager.getPieceIcon(piece) + "')\"}");
        };
        NgxChessBoardComponent.prototype.isPieceDisabled = function (pieceClicked) {
            if (pieceClicked && pieceClicked.point) {
                var foundCapture = this.board.possibleCaptures.find(function (capture) { return capture.col === pieceClicked.point.col &&
                    capture.row === pieceClicked.point.row; });
                if (foundCapture) {
                    return false;
                }
            }
            return (pieceClicked &&
                ((this.lightDisabled && pieceClicked.color === Color.WHITE) ||
                    (this.darkDisabled && pieceClicked.color === Color.BLACK)));
        };
        return NgxChessBoardComponent;
    }());
    NgxChessBoardComponent.ɵfac = function NgxChessBoardComponent_Factory(t) { return new (t || NgxChessBoardComponent)(i0.ɵɵdirectiveInject(NgxChessBoardService)); };
    NgxChessBoardComponent.ɵcmp = i0.ɵɵdefineComponent({ type: NgxChessBoardComponent, selectors: [["ngx-chess-board"]], viewQuery: function NgxChessBoardComponent_Query(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵviewQuery(_c0$1, true);
                i0.ɵɵviewQuery(_c1, true);
            }
            if (rf & 2) {
                var _t;
                i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.boardRef = _t.first);
                i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.modal = _t.first);
            }
        }, hostBindings: function NgxChessBoardComponent_HostBindings(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵlistener("contextmenu", function NgxChessBoardComponent_contextmenu_HostBindingHandler($event) { return ctx.onRightClick($event); });
            }
        }, inputs: { darkTileColor: "darkTileColor", lightTileColor: "lightTileColor", showCoords: "showCoords", dragDisabled: "dragDisabled", drawDisabled: "drawDisabled", lightDisabled: "lightDisabled", darkDisabled: "darkDisabled", freeMode: "freeMode", size: "size", pieceIcons: "pieceIcons" }, outputs: { moveChange: "moveChange", checkmate: "checkmate", stalemate: "stalemate" }, features: [i0.ɵɵNgOnChangesFeature], decls: 12, vars: 15, consts: [["id", "board", 3, "pointerdown", "pointerup"], ["boardRef", ""], ["id", "drag"], ["class", "board-row", 4, "ngFor", "ngForOf"], [2, "position", "absolute", "top", "0", "pointer-events", "none"], [4, "ngFor", "ngForOf"], ["class", "arrow", 4, "ngFor", "ngForOf"], ["fill-opacity", "0.0", "stroke-width", "2", 4, "ngFor", "ngForOf"], ["modal", ""], [1, "board-row"], ["class", "board-col", 3, "current-selection", "dest-move", "king-check", "point-circle", "possible-capture", "possible-point", "source-move", "background-color", 4, "ngFor", "ngForOf"], [1, "board-col"], ["class", "yCoord", 3, "color", "font-size", 4, "ngIf"], ["class", "xCoord", 3, "color", "font-size", 4, "ngIf"], ["style", "height:100%; width:100%", 4, "ngIf"], [1, "yCoord"], [1, "xCoord"], [2, "height", "100%", "width", "100%"], ["cdkDrag", "", 3, "cdkDragDisabled", "innerHTML", "ngClass", "ngStyle", "cdkDragEnded", "cdkDragStarted"], ["markerHeight", "13", "markerWidth", "13", "orient", "auto", "refX", "9", "refY", "6", 3, "id"], ["d", "M2,2 L2,11 L10,6 L2,2"], [1, "arrow"], ["fill-opacity", "0.0", "stroke-width", "2"]], template: function NgxChessBoardComponent_Template(rf, ctx) {
            if (rf & 1) {
                var _r26_1 = i0.ɵɵgetCurrentView();
                i0.ɵɵelementStart(0, "div", 0, 1);
                i0.ɵɵlistener("pointerdown", function NgxChessBoardComponent_Template_div_pointerdown_0_listener($event) { i0.ɵɵrestoreView(_r26_1); var _r5 = i0.ɵɵreference(11); return !_r5.opened && ctx.onMouseDown($event); })("pointerup", function NgxChessBoardComponent_Template_div_pointerup_0_listener($event) { i0.ɵɵrestoreView(_r26_1); var _r5 = i0.ɵɵreference(11); return !_r5.opened && ctx.onMouseUp($event); });
                i0.ɵɵelementStart(2, "div", 2);
                i0.ɵɵtemplate(3, NgxChessBoardComponent_div_3_Template, 2, 1, "div", 3);
                i0.ɵɵelementEnd();
                i0.ɵɵnamespaceSVG();
                i0.ɵɵelementStart(4, "svg", 4);
                i0.ɵɵtemplate(5, NgxChessBoardComponent__svg_defs_5_Template, 3, 3, "defs", 5);
                i0.ɵɵtemplate(6, NgxChessBoardComponent__svg_line_6_Template, 1, 6, "line", 6);
                i0.ɵɵpipe(7, "async");
                i0.ɵɵtemplate(8, NgxChessBoardComponent__svg_circle_8_Template, 1, 4, "circle", 7);
                i0.ɵɵpipe(9, "async");
                i0.ɵɵelementEnd();
                i0.ɵɵnamespaceHTML();
                i0.ɵɵelement(10, "app-piece-promotion-modal", null, 8);
                i0.ɵɵelementEnd();
            }
            if (rf & 2) {
                i0.ɵɵstyleProp("height", ctx.heightAndWidth, "px")("width", ctx.heightAndWidth, "px");
                i0.ɵɵadvance(3);
                i0.ɵɵproperty("ngForOf", ctx.board.board);
                i0.ɵɵadvance(1);
                i0.ɵɵattribute("height", ctx.heightAndWidth)("width", ctx.heightAndWidth);
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngForOf", i0.ɵɵpureFunction0(14, _c2));
                i0.ɵɵadvance(1);
                i0.ɵɵproperty("ngForOf", i0.ɵɵpipeBind1(7, 10, ctx.drawProvider.arrows$));
                i0.ɵɵadvance(2);
                i0.ɵɵproperty("ngForOf", i0.ɵɵpipeBind1(9, 12, ctx.drawProvider.circles$));
            }
        }, directives: [i2.NgForOf, PiecePromotionModalComponent, i2.NgIf, i4.CdkDrag, i2.NgClass, i2.NgStyle], pipes: [i2.AsyncPipe], styles: ["@charset \"UTF-8\";#board[_ngcontent-%COMP%]{font-family:Courier New,serif;position:relative}.board-row[_ngcontent-%COMP%]{display:block;height:12.5%;position:relative;width:100%}.board-col[_ngcontent-%COMP%]{cursor:default;display:inline-block;height:100%;position:relative;vertical-align:top;width:12.5%}.piece[_ngcontent-%COMP%]{-moz-user-select:none;-webkit-user-select:none;background-size:cover;color:#000!important;cursor:-webkit-grab;cursor:grab;height:100%;justify-content:center;text-align:center;user-select:none;width:100%}.piece[_ngcontent-%COMP%], .piece[_ngcontent-%COMP%]:after{box-sizing:border-box}.piece[_ngcontent-%COMP%]:after{content:\"\u200B\"}#drag[_ngcontent-%COMP%]{height:100%;width:100%}.possible-point[_ngcontent-%COMP%]{background:radial-gradient(#13262f 15%,transparent 20%)}.possible-capture[_ngcontent-%COMP%]:hover, .possible-point[_ngcontent-%COMP%]:hover{opacity:.4}.possible-capture[_ngcontent-%COMP%]{background:radial-gradient(transparent 0,transparent 80%,#13262f 0);box-sizing:border-box;margin:0;opacity:.5;padding:0}.king-check[_ngcontent-%COMP%]{background:radial-gradient(ellipse at center,red 0,#e70000 25%,rgba(169,0,0,0) 89%,rgba(158,0,0,0) 100%)}.source-move[_ngcontent-%COMP%]{background-color:rgba(146,111,26,.79)!important}.dest-move[_ngcontent-%COMP%]{background-color:#b28e1a!important}.current-selection[_ngcontent-%COMP%]{background-color:#72620b!important}.yCoord[_ngcontent-%COMP%]{right:.2em}.xCoord[_ngcontent-%COMP%], .yCoord[_ngcontent-%COMP%]{-moz-user-select:none;-webkit-user-select:none;box-sizing:border-box;cursor:pointer;font-family:Lucida Console,Courier,monospace;position:absolute;user-select:none}.xCoord[_ngcontent-%COMP%]{bottom:0;left:.2em}.hovering[_ngcontent-%COMP%]{background-color:red!important}.arrow[_ngcontent-%COMP%]{stroke-width:2}svg[_ngcontent-%COMP%]{filter:drop-shadow(1px 1px 0 #111) drop-shadow(-1px 1px 0 #111) drop-shadow(1px -1px 0 #111) drop-shadow(-1px -1px 0 #111)}[_nghost-%COMP%]{display:inline-block!important}"] });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(NgxChessBoardComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'ngx-chess-board',
                        templateUrl: './ngx-chess-board.component.html',
                        styleUrls: ['./ngx-chess-board.component.scss'],
                    }]
            }], function () { return [{ type: NgxChessBoardService }]; }, { darkTileColor: [{
                    type: i0.Input
                }], lightTileColor: [{
                    type: i0.Input
                }], showCoords: [{
                    type: i0.Input
                }], dragDisabled: [{
                    type: i0.Input
                }], drawDisabled: [{
                    type: i0.Input
                }], lightDisabled: [{
                    type: i0.Input
                }], darkDisabled: [{
                    type: i0.Input
                }], freeMode: [{
                    type: i0.Input
                }], moveChange: [{
                    type: i0.Output
                }], checkmate: [{
                    type: i0.Output
                }], stalemate: [{
                    type: i0.Output
                }], boardRef: [{
                    type: i0.ViewChild,
                    args: ['boardRef']
                }], modal: [{
                    type: i0.ViewChild,
                    args: ['modal']
                }], size: [{
                    type: i0.Input,
                    args: ['size']
                }], pieceIcons: [{
                    type: i0.Input,
                    args: ['pieceIcons']
                }], onRightClick: [{
                    type: i0.HostListener,
                    args: ['contextmenu', ['$event']]
                }] });
    })();

    var NgxChessBoardModule = /** @class */ (function () {
        function NgxChessBoardModule() {
        }
        NgxChessBoardModule.forRoot = function () {
            return {
                ngModule: NgxChessBoardModule,
                providers: [NgxChessBoardService],
            };
        };
        return NgxChessBoardModule;
    }());
    NgxChessBoardModule.ɵmod = i0.ɵɵdefineNgModule({ type: NgxChessBoardModule });
    NgxChessBoardModule.ɵinj = i0.ɵɵdefineInjector({ factory: function NgxChessBoardModule_Factory(t) { return new (t || NgxChessBoardModule)(); }, imports: [[i2.CommonModule, i4.DragDropModule]] });
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NgxChessBoardModule, { declarations: [NgxChessBoardComponent, PiecePromotionModalComponent], imports: [i2.CommonModule, i4.DragDropModule], exports: [NgxChessBoardComponent] }); })();
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(NgxChessBoardModule, [{
                type: i0.NgModule,
                args: [{
                        declarations: [NgxChessBoardComponent, PiecePromotionModalComponent],
                        imports: [i2.CommonModule, i4.DragDropModule],
                        exports: [NgxChessBoardComponent],
                    }]
            }], null, null);
    })();

    /*
     * Public API Surface of ngx-chess-board
     */
    /*
     * Public API Surface of im-grid
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.HistoryMove = HistoryMove;
    exports.NgxChessBoardComponent = NgxChessBoardComponent;
    exports.NgxChessBoardModule = NgxChessBoardModule;
    exports.NgxChessBoardService = NgxChessBoardService;
    exports.PiecePromotionModalComponent = PiecePromotionModalComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-chess-board.umd.js.map
