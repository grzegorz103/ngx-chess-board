import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ɵɵdefineInjectable, Injectable, EventEmitter, Component, Input, Output, ViewChild, HostListener, NgModule } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { cloneDeep } from 'lodash';

var Color;
(function (Color) {
    Color[Color["WHITE"] = 0] = "WHITE";
    Color[Color["BLACK"] = 1] = "BLACK";
})(Color || (Color = {}));

class Piece {
    constructor(point, color, constant, relValue, board) {
        this.checkPoints = [];
        this.color = color;
        this.constant = constant;
        this.point = point;
        this.relValue = relValue;
        this.board = board;
    }
}

class Point {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    isEqual(that) {
        return that && this.row === that.row && this.col === that.col;
    }
    hasCoordsEqual(row, col) {
        return row && col && this.row === row && this.col === col;
    }
}

class Rook extends Piece {
    constructor(point, color, constant, board) {
        super(point, color, constant, 5, board);
        this.isMovedAlready = false;
    }
    getPossibleMoves() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
        for (let i = row + 1; i < 8; ++i) {
            // dol
            if (this.board.isFieldEmpty(i, col)) {
                possiblePoints.push(new Point(i, col));
            }
            else {
                break;
            }
        }
        for (let i = row - 1; i >= 0; --i) {
            // gora
            if (this.board.isFieldEmpty(i, col)) {
                possiblePoints.push(new Point(i, col));
            }
            else {
                break;
            }
        }
        for (let j = col - 1; j >= 0; --j) {
            // lewo
            if (this.board.isFieldEmpty(row, j)) {
                possiblePoints.push(new Point(row, j));
            }
            else {
                break;
            }
        }
        for (let j = col + 1; j < 8; ++j) {
            // prawo
            if (this.board.isFieldEmpty(row, j)) {
                possiblePoints.push(new Point(row, j));
            }
            else {
                break;
            }
        }
        return possiblePoints;
    }
    getPossibleCaptures() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
        for (let i = row + 1; i < 8; ++i) {
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
        for (let i = row - 1; i >= 0; --i) {
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
        for (let j = col - 1; j >= 0; --j) {
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
        for (let j = col + 1; j < 8; ++j) {
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
    }
    getCoveredFields() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
        for (let i = row + 1; i < 8; ++i) {
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
        for (let i = row - 1; i >= 0; --i) {
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
        for (let j = col - 1; j >= 0; --j) {
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
        for (let j = col + 1; j < 8; ++j) {
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
    }
}

class King extends Piece {
    constructor(point, color, constant, board) {
        super(point, color, constant, 0, board);
        this.castledAlready = false;
        this.shortCastled = false;
        this.longCastled = false;
        this.isCastling = false;
    }
    getPossibleMoves() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
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
            let longCastlePossible = true;
            for (let i = col - 1; i > 0; --i) {
                if (!this.board.isFieldEmpty(row, i) ||
                    this.board.isFieldUnderAttack(row, i, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    longCastlePossible = false;
                    break;
                }
            }
            if (longCastlePossible && !this.board.isKingInCheck(this.color, this.board.pieces) && this.board.getPieceByField(row, 0)) {
                const leftRook = this.board.getPieceByField(row, 0);
                if (leftRook instanceof Rook) {
                    if (!leftRook.isMovedAlready) {
                        possiblePoints.push(new Point(row, col - 2));
                    }
                }
            }
            let shortCastlePossible = true;
            for (let i = col + 1; i < 7; ++i) {
                if (!this.board.isFieldEmpty(row, i) ||
                    this.board.isFieldUnderAttack(row, i, this.color === Color.WHITE ? Color.BLACK : Color.WHITE)) {
                    shortCastlePossible = false;
                    break;
                }
            }
            if (shortCastlePossible && !this.board.isKingInCheck(this.color, this.board.pieces) && this.board.getPieceByField(row, 7)) {
                const rightRook = this.board.getPieceByField(row, 7);
                if (rightRook instanceof Rook) {
                    if (!rightRook.isMovedAlready) {
                        possiblePoints.push(new Point(row, col + 2));
                    }
                }
            }
        }
        return possiblePoints;
    }
    getPossibleCaptures() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
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
    }
    getCoveredFields() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
        // lewo
        if (this.board.isFieldTakenByEnemy(row, col - 1, this.color)) {
            possiblePoints.push(new Point(row, col - 1));
        }
        // prawo
        if (this.board.isFieldTakenByEnemy(row, col + 1, this.color)) {
            possiblePoints.push(new Point(row, col + 1));
        }
        // dol
        if (this.board.isFieldTakenByEnemy(row + 1, col, this.color)) {
            possiblePoints.push(new Point(row + 1, col));
        }
        // gora
        if (this.board.isFieldTakenByEnemy(row - 1, col, this.color)) {
            possiblePoints.push(new Point(row - 1, col));
        }
        // lewo gora
        if (this.board.isFieldTakenByEnemy(row - 1, col - 1, this.color)) {
            possiblePoints.push(new Point(row - 1, col - 1));
        }
        // prawo gora
        if (this.board.isFieldTakenByEnemy(row - 1, col + 1, this.color)) {
            possiblePoints.push(new Point(row - 1, col + 1));
        }
        // lewo dol
        if (this.board.isFieldTakenByEnemy(row + 1, col - 1, this.color)) {
            possiblePoints.push(new Point(row + 1, col - 1));
        }
        // prawo dol
        if (this.board.isFieldTakenByEnemy(row + 1, col + 1, this.color)) {
            possiblePoints.push(new Point(row + 1, col + 1));
        }
        return possiblePoints;
    }
}

class Bishop extends Piece {
    constructor(point, color, constant, board) {
        super(point, color, constant, 3, board);
    }
    getPossibleMoves() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
            // lewa gorna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            }
            else {
                break;
            }
        }
        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
            // prawa gorna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            }
            else {
                break;
            }
        }
        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
            // lewa dolna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            }
            else {
                break;
            }
        }
        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
            // prawa dolna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            }
            else {
                break;
            }
        }
        return possiblePoints;
    }
    getPossibleCaptures() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
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
        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
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
        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
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
        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
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
    }
    getCoveredFields() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
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
        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
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
        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
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
        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
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
    }
}

class Knight extends Piece {
    constructor(point, color, constant, board) {
        super(point, color, constant, 3, board);
        this.isMovedAlready = false;
    }
    getPossibleMoves() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
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
    }
    getPossibleCaptures() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
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
    }
    getCoveredFields() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
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
    }
}

class Pawn extends Piece {
    constructor(point, color, constant, board) {
        super(point, color, constant, 1, board);
        this.isMovedAlready = false;
    }
    getPossibleMoves() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
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
    }
    getPossibleCaptures() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
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
    }
    getCoveredFields() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
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
    }
}

class Queen extends Piece {
    constructor(point, color, constant, board) {
        super(point, color, constant, 9, board);
    }
    getPossibleMoves() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
            // lewa gorna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            }
            else {
                break;
            }
        }
        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
            // prawa gorna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            }
            else {
                break;
            }
        }
        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
            // lewa dolna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            }
            else {
                break;
            }
        }
        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
            // prawa dolna przekatna
            if (this.board.isFieldEmpty(i, j)) {
                possiblePoints.push(new Point(i, j));
            }
            else {
                break;
            }
        }
        for (let i = row + 1; i < 8; ++i) {
            // dol
            if (this.board.isFieldEmpty(i, col)) {
                possiblePoints.push(new Point(i, col));
            }
            else {
                break;
            }
        }
        for (let i = row - 1; i >= 0; --i) {
            // gora
            if (this.board.isFieldEmpty(i, col)) {
                possiblePoints.push(new Point(i, col));
            }
            else {
                break;
            }
        }
        for (let j = col - 1; j >= 0; --j) {
            // lewo
            if (this.board.isFieldEmpty(row, j)) {
                possiblePoints.push(new Point(row, j));
            }
            else {
                break;
            }
        }
        for (let j = col + 1; j < 8; ++j) {
            // prawo
            if (this.board.isFieldEmpty(row, j)) {
                possiblePoints.push(new Point(row, j));
            }
            else {
                break;
            }
        }
        return possiblePoints;
    }
    getPossibleCaptures() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
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
        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
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
        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
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
        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
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
        for (let i = row + 1; i < 8; ++i) {
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
        for (let i = row - 1; i >= 0; --i) {
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
        for (let j = col - 1; j >= 0; --j) {
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
        for (let j = col + 1; j < 8; ++j) {
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
    }
    getCoveredFields() {
        const possiblePoints = [];
        const row = this.point.row;
        const col = this.point.col;
        for (let i = row + 1; i < 8; ++i) {
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
        for (let i = row - 1; i >= 0; --i) {
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
        for (let j = col - 1; j >= 0; --j) {
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
        for (let j = col + 1; j < 8; ++j) {
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
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
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
        for (let i = row - 1, j = col + 1; i >= 0 && j < 8; --i, ++j) {
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
        for (let i = row + 1, j = col - 1; i < 8 && j >= 0; ++i, --j) {
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
        for (let i = row + 1, j = col + 1; i < 8 && j < 8; ++i, ++j) {
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
    }
}

const UnicodeConstants = {
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

class BoardLoader {
    constructor(board) {
        this.board = board;
    }
    addPieces() {
        this.board.pieces = [];
        // piony czarne
        for (let i = 0; i < 8; ++i) {
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
        for (let i = 0; i < 8; ++i) {
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
    }
    loadFEN(fen) {
        console.log(fen);
        if (fen) {
            this.board.reverted = false;
            this.board.pieces = [];
            const split = fen.split('/');
            for (let i = 0; i < 8; ++i) {
                let pointer = 0;
                for (let j = 0; j < 8; ++j) {
                    const chunk = split[i].charAt(j);
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
                                const pawn = new Pawn(new Point(i, pointer), Color.BLACK, UnicodeConstants.BLACK_PAWN, this.board);
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
                                const pawn = new Pawn(new Point(i, pointer), Color.WHITE, UnicodeConstants.WHITE_PAWN, this.board);
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
    }
    setBoard(board) {
        this.board = board;
    }
    setCurrentPlayer(fen) {
        if (fen) {
            const split = fen.split(' ');
            this.board.currentWhitePlayer = split[1] === 'w';
        }
    }
    setCastles(fen) {
        if (fen) {
            const split = fen.split(' ');
            const castleChunk = split[2];
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
    }
    setFullMoveCount(fen) { }
    setEnPassant(fen) {
        if (fen) {
            const split = fen.split(' ');
            const enPassantPoint = split[3];
            if (enPassantPoint === '-') {
                return;
            }
            // if()
        }
    }
    setRookAlreadyMoved(color, col) {
        const rook = this.board.pieces.find((piece) => piece.color === color && piece instanceof Rook && piece.point.col === col);
        console.log(color + " " + col);
        if (rook) {
            rook.isMovedAlready = true;
        }
    }
}

class BoardState {
    constructor(board) {
        this.board = board;
    }
}

class BoardStateProvider {
    constructor() {
        this.statesSubject$ = new BehaviorSubject([]);
    }
    get states() {
        return this.statesSubject$.value;
    }
    set states(states) {
        this.statesSubject$.next(states);
    }
    addMove(state) {
        this.states = [...this.states, state];
    }
    getStates() {
        return this.states;
    }
    pop() {
        const lastState = this.getLastState();
        this.states = this.states.filter((state) => state !== lastState);
        return lastState;
    }
    isEmpty() {
        return this.states.length === 0;
    }
    clear() {
        this.states = [];
    }
    getLastState() {
        return this.states[this.getLastStateIndex()];
    }
    getLastStateIndex() {
        return this.states.length - 1;
    }
}

class CoordsProvider {
    constructor() {
        this.defaultXCoords = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        this.reversedXCoords = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
        this.defaultYCoords = [8, 7, 6, 5, 4, 3, 2, 1];
        this.reversedYCoords = [1, 2, 3, 4, 5, 6, 7, 8];
        this.currentXCoords = this.defaultXCoords;
        this.currentYCoords = this.defaultYCoords;
    }
    get xCoords() {
        return this.currentXCoords;
    }
    get yCoords() {
        return this.currentYCoords;
    }
    reverse() {
        this.currentXCoords = this.reversedXCoords;
        this.currentYCoords = this.reversedYCoords;
    }
    reset() {
        this.init();
    }
    init() {
        this.currentXCoords = this.defaultXCoords;
        this.currentYCoords = this.defaultYCoords;
    }
}

class Arrow {
    isEqual(arrow) {
        return arrow && this.start.isEqual(arrow.start) && this.end.isEqual(arrow.end);
    }
}

class Circle {
    isEqual(circle) {
        return circle && this.drawPoint.isEqual(circle.drawPoint);
    }
}

class DrawPoint {
    constructor(x, y, color) {
        this.x = x + 0.5;
        this.y = y + 0.5;
        this.color = color;
    }
    isEqual(that) {
        return that && that.x === this.x && this.y === that.y;
    }
}

class DrawProvider {
    constructor() {
        this.arrowsSubject$ = new BehaviorSubject([]);
        this.circlesSubject$ = new BehaviorSubject([]);
        this.arrows$ = this.arrowsSubject$.asObservable();
        this.circles$ = this.circlesSubject$.asObservable();
    }
    get circles() {
        return this.circlesSubject$.value;
    }
    set circles(circles) {
        this.circlesSubject$.next(circles);
    }
    get arrows() {
        return this.arrowsSubject$.value;
    }
    set arrows(arrows) {
        this.arrowsSubject$.next(arrows);
    }
    addCircle(circle) {
        this.circles = [...this.circles, circle];
    }
    reomveCircle(removeCircle) {
        this.circles = this.circles.filter((circle) => !circle.isEqual(removeCircle));
    }
    addArrow(arrow) {
        this.arrows = [...this.arrows, arrow];
    }
    removeArrow(removeArrow) {
        this.arrows = this.arrows.filter((arrow) => !arrow.isEqual(removeArrow));
    }
    containsCircle(checkCircle) {
        return this.circles.some((circle) => circle.isEqual(checkCircle));
    }
    containsArrow(checkArrow) {
        return this.arrows.some((arrow) => arrow.isEqual(checkArrow));
    }
    clear() {
        this.arrows = [];
        this.circles = [];
    }
}

class HistoryMove {
    constructor(move, piece, color, captured) {
        this.move = move;
        this.piece = piece;
        this.color = color;
        this.x = captured;
    }
}

class HistoryMoveProvider {
    constructor() {
        this.historyMovesSubject$ = new BehaviorSubject([]);
    }
    get historyMoves() {
        return this.historyMovesSubject$.value;
    }
    set historyMoves(states) {
        this.historyMovesSubject$.next(states);
    }
    addMove(historyMove) {
        this.historyMoves = [...this.historyMoves, historyMove];
    }
    pop() {
        const lastHistoryMove = this.getLastMove();
        this.historyMoves = this.historyMoves.filter((state) => state !== lastHistoryMove);
        return lastHistoryMove;
    }
    getAll() {
        return this.historyMoves;
    }
    clear() {
        this.historyMoves = [];
    }
    getLastMove() {
        return this.historyMoves[this.getLastMoveIndex()];
    }
    getLastMoveIndex() {
        return this.historyMoves.length - 1;
    }
}

class Board {
    constructor() {
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
        for (let i = 0; i < 8; ++i) {
            this.board[i] = [];
            for (let j = 0; j < 8; ++j) {
                this.board[i][j] = 0;
            }
        }
    }
    isXYInPossibleMoves(row, col) {
        return this.possibleMoves.some((move) => move.row === row && move.col === col);
    }
    isXYInPossibleCaptures(row, col) {
        return this.possibleCaptures.some((capture) => capture.row === row && capture.col === col);
    }
    isXYInSourceMove(i, j) {
        return this.lastMoveSrc && this.lastMoveSrc.row === i && this.lastMoveSrc.col === j;
    }
    isXYInDestMove(i, j) {
        return this.lastMoveDest && this.lastMoveDest.row === i && this.lastMoveDest.col === j;
    }
    isXYInActiveMove(i, j) {
        return this.activePiece && this.activePiece.point.row === i && this.activePiece.point.col === j;
    }
    isPointInPossibleMoves(point) {
        return this.possibleMoves.some((move) => move.row === point.row && move.col === point.col);
    }
    isPointInPossibleCaptures(point) {
        return this.possibleCaptures.some((capture) => capture.row === point.row && capture.col === point.col);
    }
    reset() {
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
    }
    reverse() {
        this.reverted = !this.reverted;
        this.activePiece = null;
        this.possibleMoves = [];
        this.possibleCaptures = [];
        this.pieces.forEach((piece) => this.reversePoint(piece.point));
        this.reversePoint(this.lastMoveSrc);
        if (this.enPassantPoint && this.enPassantPiece) {
            this.reversePoint(this.enPassantPoint);
        }
    }
    clone() {
        return cloneDeep(this);
    }
    isFieldTakenByEnemy(row, col, enemyColor) {
        if (row > 7 || row < 0 || col > 7 || col < 0) {
            return false;
        }
        return this.pieces.some((piece) => piece.point.col === col && piece.point.row === row && piece.color === enemyColor);
    }
    isFieldEmpty(row, col) {
        if (row > 7 || row < 0 || col > 7 || col < 0) {
            return false;
        }
        return !this.pieces.some((piece) => piece.point.col === col && piece.point.row === row);
    }
    isFieldUnderAttack(row, col, color) {
        return this.pieces
            .filter((piece) => piece.color === color)
            .some((piece) => piece.getCoveredFields().some((field) => field.col === col && field.row === row));
    }
    getPieceByField(row, col) {
        if (this.isFieldEmpty(row, col)) {
            //   throw new Error('Piece not found');
            return undefined;
        }
        return this.pieces.find((piece) => piece.point.col === col && piece.point.row === row);
    }
    isKingInCheck(color, pieces) {
        const king = pieces.find((piece) => piece.color === color && piece instanceof King);
        if (king) {
            return pieces.some((piece) => piece
                .getPossibleCaptures()
                .some((point) => point.col === king.point.col && point.row === king.point.row) &&
                piece.color !== color);
        }
        return false;
    }
    getKingByColor(color) {
        return this.pieces.find((piece) => piece instanceof King && piece.color === color);
    }
    getCastleFENString(color) {
        const king = this.getKingByColor(color);
        if (king.isMovedAlready) {
            return '';
        }
        let fen = '';
        const leftRook = this.getPieceByField(king.point.row, 0);
        const rightRook = this.getPieceByField(king.point.row, 7);
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
    }
    getEnPassantFENString() {
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
    }
    calculateFEN() {
        let fen = '';
        for (let i = 0; i < 8; ++i) {
            let emptyFields = 0;
            for (let j = 0; j < 8; ++j) {
                const foundPiece = this.pieces.find((piece) => piece.point.col === j && piece.point.row === i);
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
            }
            if (emptyFields > 0) {
                fen += emptyFields;
            }
            fen += '/';
        }
        fen = fen.substr(0, fen.length - 1);
        if (this.reverted) {
            fen = fen.split('').reverse().join('');
        }
        fen += ' ' + (this.currentWhitePlayer ? 'w' : 'b');
        const whiteEnPassant = this.getCastleFENString(Color.WHITE);
        const blackEnPassant = this.getCastleFENString(Color.BLACK);
        let concatedEnPassant = whiteEnPassant + blackEnPassant;
        if (!concatedEnPassant) {
            concatedEnPassant = '-';
        }
        fen += ' ' + concatedEnPassant;
        fen += ' ' + this.getEnPassantFENString();
        fen += ' ' + 0;
        fen += ' ' + this.fullMoveCount;
        this.fen = fen;
    }
    isXYInPointSelection(i, j) {
        return false;
    }
    reversePoint(point) {
        if (point) {
            point.row = Math.abs(point.row - 7);
            point.col = Math.abs(point.col - 7);
        }
    }
}

class MoveTranslation {
    constructor(xAxis, yAxis, reverted) {
        this._xAxis = xAxis;
        this._yAxis = yAxis;
        this._reverted = reverted;
    }
    get xAxis() {
        return this._xAxis;
    }
    set xAxis(value) {
        this._xAxis = value;
    }
    get yAxis() {
        return this._yAxis;
    }
    set yAxis(value) {
        this._yAxis = value;
    }
    get reverted() {
        return this._reverted;
    }
    set reverted(value) {
        this._reverted = value;
    }
}

class MoveUtils {
    static willMoveCauseCheck(currentColor, row, col, destRow, destCol, board) {
        const srcPiece = board.getPieceByField(row, col);
        const destPiece = board.getPieceByField(destRow, destCol);
        if (srcPiece) {
            srcPiece.point.row = destRow;
            srcPiece.point.col = destCol;
        }
        if (destPiece) {
            board.pieces = board.pieces.filter((piece) => piece !== destPiece);
        }
        const isBound = board.isKingInCheck(currentColor, board.pieces);
        if (srcPiece) {
            srcPiece.point.col = col;
            srcPiece.point.row = row;
        }
        if (destPiece) {
            board.pieces.push(destPiece);
        }
        return isBound;
    }
    static format(sourcePoint, destPoint, reverted) {
        if (reverted) {
            const sourceX = 104 - sourcePoint.col;
            const destX = 104 - destPoint.col;
            return (String.fromCharCode(sourceX) +
                (sourcePoint.row + 1) +
                String.fromCharCode(destX) +
                (destPoint.row + 1));
        }
        else {
            const incrementX = 97;
            return (String.fromCharCode(sourcePoint.col + incrementX) +
                (Math.abs(sourcePoint.row - 7) + 1) +
                String.fromCharCode(destPoint.col + incrementX) +
                (Math.abs(destPoint.row - 7) + 1));
        }
    }
    static translateCoordsToIndex(coords, reverted) {
        let xAxis;
        let yAxis;
        if (reverted) {
            xAxis = 104 - coords.charCodeAt(0);
            yAxis = +coords.charAt(1) - 1;
        }
        else {
            xAxis = coords.charCodeAt(0) - 97;
            yAxis = Math.abs(+coords.charAt(1) - 8);
        }
        return new MoveTranslation(xAxis, yAxis, reverted);
    }
}

class PieceAbstractDecorator {
    constructor(piece) {
        this.piece = piece;
    }
}

class AvailableMoveDecorator extends PieceAbstractDecorator {
    constructor(piece, pointClicked, color, board) {
        super(piece);
        this.pointClicked = pointClicked;
        this.color = color;
        this.board = board;
    }
    getPossibleCaptures() {
        return this.piece
            .getPossibleCaptures()
            .filter((point) => !MoveUtils.willMoveCauseCheck(this.color, this.pointClicked.row, this.pointClicked.col, point.row, point.col, this.board));
    }
    getPossibleMoves() {
        return this.piece
            .getPossibleMoves()
            .filter((point) => !MoveUtils.willMoveCauseCheck(this.color, this.pointClicked.row, this.pointClicked.col, point.row, point.col, this.board));
    }
}

class NgxChessBoardService {
    constructor() {
        this.componentMethodCallSource = new Subject();
        this.componentMethodCalled$ = this.componentMethodCallSource.asObservable();
    }
    reset() {
        this.componentMethodCallSource.next();
    }
}
NgxChessBoardService.ɵprov = ɵɵdefineInjectable({ factory: function NgxChessBoardService_Factory() { return new NgxChessBoardService(); }, token: NgxChessBoardService, providedIn: "root" });
NgxChessBoardService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];

class Constants {
}
Constants.DEFAULT_DARK_TILE_COLOR = 'rgb(97, 84, 61)';
Constants.DEFAULT_LIGHT_TILE_COLOR = '#BAA378';
Constants.DEFAULT_SIZE = 500;
Constants.MIN_BOARD_SIZE = 100;
Constants.MAX_BOARD_SIZE = 4000;

class PieceIconInputManager {
    constructor() {
        this._defaultIcons = false;
    }
    get pieceIconInput() {
        return this._pieceIconInput;
    }
    set pieceIconInput(value) {
        this._pieceIconInput = value;
    }
    get defaultIcons() {
        return this._defaultIcons;
    }
    set defaultIcons(value) {
        this._defaultIcons = value;
    }
    isDefaultIcons() {
        return this.pieceIconInput === undefined || this.pieceIconInput === null;
    }
    getPieceIcon(piece) {
        let isWhite = (piece.color === Color.WHITE);
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
    }
    loadDefaultData() {
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
    }
}

class NgxChessBoardComponent {
    constructor(ngxChessBoardService) {
        this.ngxChessBoardService = ngxChessBoardService;
        this.darkTileColor = Constants.DEFAULT_DARK_TILE_COLOR;
        this.lightTileColor = Constants.DEFAULT_LIGHT_TILE_COLOR;
        this.showCoords = true;
        this.dragDisabled = false;
        this.drawDisabled = false;
        this.lightDisabled = false;
        this.darkDisabled = false;
        this.moveChange = new EventEmitter();
        this.checkmate = new EventEmitter();
        this.stalemate = new EventEmitter();
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
    set size(size) {
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
    }
    set pieceIcons(pieceIcons) {
        this.pieceIconManager.pieceIconInput = pieceIcons;
    }
    onRightClick(event) {
        event.preventDefault();
    }
    ngOnChanges(changes) {
        if ((changes.lightDisabled &&
            this.lightDisabled &&
            this.board.currentWhitePlayer) ||
            (changes.darkDisabled &&
                this.darkDisabled &&
                !this.board.currentWhitePlayer)) {
            this.board.possibleCaptures = [];
            this.board.possibleMoves = [];
        }
    }
    ngOnInit() {
        this.ngxChessBoardService.componentMethodCalled$.subscribe(() => {
            this.board.reset();
        });
        this.calculatePieceSize();
    }
    onMouseUp(event) {
        if (event.button !== 0 && !this.drawDisabled) {
            this.addDrawPoint(event.x, event.y, event.ctrlKey, event.altKey, event.shiftKey);
            return;
        }
        this.drawProvider.clear();
        if (this.dragDisabled) {
            return;
        }
        const pointClicked = this.getClickPoint(event);
        if (this.board.activePiece &&
            pointClicked.isEqual(this.board.activePiece.point) &&
            this.disabling) {
            this.disableSelection();
            this.disabling = false;
            return;
        }
        const pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
        if (this.isPieceDisabled(pieceClicked)) {
            return;
        }
        if (this.selected) {
            this.handleClickEvent(pointClicked);
            //   this.possibleMoves = activePiece.getPossibleMoves();
        }
        else {
            if (pieceClicked) {
                if ((this.board.currentWhitePlayer &&
                    pieceClicked.color === Color.BLACK) ||
                    (!this.board.currentWhitePlayer &&
                        pieceClicked.color === Color.WHITE)) {
                    return;
                }
                this.prepareActivePiece(pieceClicked, pointClicked);
            }
        }
    }
    afterMoveActions(promotionIndex) {
        this.checkIfPawnFirstMove(this.board.activePiece);
        this.checkIfRookMoved(this.board.activePiece);
        this.checkIfKingMoved(this.board.activePiece);
        this.board.blackKingChecked = this.board.isKingInCheck(Color.BLACK, this.board.pieces);
        this.board.whiteKingChecked = this.board.isKingInCheck(Color.WHITE, this.board.pieces);
        const check = this.board.blackKingChecked || this.board.whiteKingChecked;
        const checkmate = this.checkForPossibleMoves(Color.BLACK) ||
            this.checkForPossibleMoves(Color.WHITE);
        const stalemate = this.checkForPat(Color.BLACK) || this.checkForPat(Color.WHITE);
        this.disabling = false;
        this.board.calculateFEN();
        const lastMove = this.moveHistoryProvider.getLastMove();
        if (lastMove && promotionIndex) {
            lastMove.move += promotionIndex;
        }
        this.moveChange.emit(Object.assign(Object.assign({}, lastMove), { check,
            checkmate,
            stalemate, fen: this.board.fen }));
    }
    disableSelection() {
        this.selected = false;
        this.board.possibleCaptures = [];
        this.board.activePiece = null;
        this.board.possibleMoves = [];
    }
    prepareActivePiece(pieceClicked, pointClicked) {
        this.board.activePiece = pieceClicked;
        this.selected = true;
        this.board.possibleCaptures = new AvailableMoveDecorator(pieceClicked, pointClicked, this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK, this.board).getPossibleCaptures();
        this.board.possibleMoves = new AvailableMoveDecorator(pieceClicked, pointClicked, this.board.currentWhitePlayer ? Color.WHITE : Color.BLACK, this.board).getPossibleMoves();
    }
    getPieceByPoint(row, col) {
        row = Math.floor(row);
        col = Math.floor(col);
        return this.board.pieces.find((piece) => piece.point.col === col && piece.point.row === row);
    }
    isKingChecked(piece) {
        if (piece instanceof King) {
            return piece.color === Color.WHITE
                ? this.board.whiteKingChecked
                : this.board.blackKingChecked;
        }
    }
    getClickPoint(event) {
        return new Point(Math.floor((event.y -
            this.boardRef.nativeElement.getBoundingClientRect().top) /
            (this.boardRef.nativeElement.getBoundingClientRect()
                .height /
                8)), Math.floor((event.x -
            this.boardRef.nativeElement.getBoundingClientRect().left) /
            (this.boardRef.nativeElement.getBoundingClientRect().width /
                8)));
    }
    movePiece(toMovePiece, newPoint, promotionIndex) {
        const destPiece = this.board.pieces.find((piece) => piece.point.col === newPoint.col &&
            piece.point.row === newPoint.row);
        if (destPiece && toMovePiece.color !== destPiece.color) {
            this.board.pieces = this.board.pieces.filter((piece) => piece !== destPiece);
        }
        else {
            if (destPiece && toMovePiece.color === destPiece.color) {
                return;
            }
        }
        const move = new HistoryMove(MoveUtils.format(toMovePiece.point, newPoint, this.board.reverted), toMovePiece.constant.name, toMovePiece.color === Color.WHITE ? 'white' : 'black', !!destPiece);
        this.moveHistoryProvider.addMove(move);
        if (toMovePiece instanceof King) {
            const squaresMoved = Math.abs(newPoint.col - toMovePiece.point.col);
            if (squaresMoved > 1) {
                if (newPoint.col < 3) {
                    const leftRook = this.board.getPieceByField(toMovePiece.point.row, 0);
                    leftRook.point.col = this.board.reverted ? 2 : 3;
                }
                else {
                    const rightRook = this.board.getPieceByField(toMovePiece.point.row, 7);
                    rightRook.point.col = this.board.reverted ? 4 : 5;
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
    }
    checkIfPawnFirstMove(piece) {
        if (piece instanceof Pawn) {
            piece.isMovedAlready = true;
        }
    }
    checkForPawnPromote(toPromotePiece, promotionIndex) {
        if (!(toPromotePiece instanceof Pawn)) {
            return;
        }
        if (toPromotePiece.point.row === 0 || toPromotePiece.point.row === 7) {
            this.board.pieces = this.board.pieces.filter((piece) => piece !== toPromotePiece);
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
    }
    openPromoteDialog(piece) {
        this.modal.open(piece.color, (index) => {
            this.resolvePromotionChoice(piece, index);
            this.afterMoveActions(index);
        });
    }
    resolvePromotionChoice(piece, index) {
        const isWhite = piece.color === Color.WHITE;
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
    }
    reset() {
        this.boardStateProvider.clear();
        this.moveHistoryProvider.clear();
        this.boardLoader.addPieces();
        this.board.reset();
        this.coords.reset();
        this.drawProvider.clear();
    }
    reverse() {
        this.selected = false;
        this.board.reverse();
        this.coords.reverse();
    }
    updateBoard(board) {
        this.board = board;
        this.boardLoader.setBoard(this.board);
        this.board.possibleCaptures = [];
        this.board.possibleMoves = [];
    }
    undo() {
        if (!this.boardStateProvider.isEmpty()) {
            const lastBoard = this.boardStateProvider.pop().board;
            if (this.board.reverted) {
                lastBoard.reverse();
            }
            this.board = lastBoard;
            this.boardLoader.setBoard(this.board);
            this.board.possibleCaptures = [];
            this.board.possibleMoves = [];
            this.moveHistoryProvider.pop();
        }
    }
    getMoveHistory() {
        return this.moveHistoryProvider.getAll();
    }
    setFEN(fen) {
        try {
            this.boardLoader.loadFEN(fen);
            this.board.possibleCaptures = [];
            this.board.possibleMoves = [];
        }
        catch (exception) {
            console.log(exception);
            this.boardLoader.addPieces();
        }
    }
    getFEN() {
        return this.board.fen;
    }
    dragEnded(event) {
        event.source.reset();
        event.source.element.nativeElement.style.zIndex = '0';
        event.source.element.nativeElement.style.pointerEvents = 'auto';
        event.source.element.nativeElement.style.touchAction = 'auto';
    }
    dragStart(event) {
        const style = event.source.element.nativeElement.style;
        style.position = 'relative';
        style.zIndex = '1000';
        style.touchAction = 'none';
        style.pointerEvents = 'none';
    }
    onMouseDown(event) {
        if (event.button !== 0) {
            this.drawPoint = this.getDrawingPoint(event.x, event.y, event.ctrlKey, event.altKey, event.shiftKey);
            return;
        }
        const pointClicked = this.getClickPoint(event);
        this.drawProvider.clear();
        if (this.board.activePiece &&
            pointClicked.isEqual(this.board.activePiece.point)) {
            this.disabling = true;
            return;
        }
        const pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
        if (this.isPieceDisabled(pieceClicked)) {
            return;
        }
        if (this.selected) {
            this.handleClickEvent(pointClicked);
        }
        else {
            if (pieceClicked) {
                if ((this.board.currentWhitePlayer &&
                    pieceClicked.color === Color.BLACK) ||
                    (!this.board.currentWhitePlayer &&
                        pieceClicked.color === Color.WHITE)) {
                    return;
                }
                this.prepareActivePiece(pieceClicked, pointClicked);
            }
        }
    }
    getDrawingPoint(x, y, crtl, alt, shift) {
        const squareSize = this.heightAndWidth / 8;
        const xx = Math.floor((x - this.boardRef.nativeElement.getBoundingClientRect().left) /
            squareSize);
        const yy = Math.floor((y - this.boardRef.nativeElement.getBoundingClientRect().top) /
            squareSize);
        let color = 'green';
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
    }
    checkIfRookMoved(piece) {
        if (piece instanceof Rook) {
            piece.isMovedAlready = true;
        }
    }
    checkIfKingMoved(piece) {
        if (piece instanceof King) {
            piece.isMovedAlready = true;
        }
    }
    checkForPossibleMoves(color) {
        if (!this.board.pieces
            .filter((piece) => piece.color === color)
            .some((piece) => piece
            .getPossibleMoves()
            .some((move) => !MoveUtils.willMoveCauseCheck(color, piece.point.row, piece.point.col, move.row, move.col, this.board)) ||
            piece
                .getPossibleCaptures()
                .some((capture) => !MoveUtils.willMoveCauseCheck(color, piece.point.row, piece.point.col, capture.row, capture.col, this.board)))) {
            return true;
        }
        else {
            return false;
        }
    }
    checkForPat(color) {
        if (color === Color.WHITE && !this.board.whiteKingChecked) {
            return this.checkForPossibleMoves(color);
        }
        else {
            if (color === Color.BLACK && !this.board.blackKingChecked) {
                return this.checkForPossibleMoves(color);
            }
        }
    }
    checkIfPawnEnpassanted(piece, newPoint) {
        if (Math.abs(piece.point.row - newPoint.row) > 1) {
            this.board.enPassantPiece = piece;
            this.board.enPassantPoint = new Point((piece.point.row + newPoint.row) / 2, piece.point.col);
        }
        else {
            this.board.enPassantPoint = null;
            this.board.enPassantPiece = null;
        }
    }
    checkIfPawnTakesEnPassant(newPoint) {
        if (newPoint.isEqual(this.board.enPassantPoint)) {
            this.board.pieces = this.board.pieces.filter((piece) => piece !== this.board.enPassantPiece);
            this.board.enPassantPoint = null;
            this.board.enPassantPiece = null;
        }
    }
    saveClone() {
        const clone = this.board.clone();
        if (this.board.reverted) {
            clone.reverse();
        }
        this.boardStateProvider.addMove(new BoardState(clone));
    }
    saveMoveClone() {
        const clone = this.board.clone();
        if (this.board.reverted) {
            clone.reverse();
        }
        this.moveStateProvider.addMove(new BoardState(clone));
    }
    calculatePieceSize() {
        this.pieceSize = this.heightAndWidth / 10;
    }
    increaseFullMoveCount() {
        if (!this.board.currentWhitePlayer) {
            ++this.board.fullMoveCount;
        }
    }
    handleClickEvent(pointClicked) {
        if (this.board.isPointInPossibleMoves(pointClicked) ||
            this.board.isPointInPossibleCaptures(pointClicked)) {
            this.saveClone();
            this.board.lastMoveSrc = new Point(this.board.activePiece.point.row, this.board.activePiece.point.col);
            this.board.lastMoveDest = pointClicked;
            this.movePiece(this.board.activePiece, pointClicked);
        }
        this.disableSelection();
        const pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
        if (pieceClicked) {
            if ((this.board.currentWhitePlayer &&
                pieceClicked.color === Color.BLACK) ||
                (!this.board.currentWhitePlayer &&
                    pieceClicked.color === Color.WHITE)) {
                return;
            }
            this.prepareActivePiece(pieceClicked, pointClicked);
        }
    }
    addDrawPoint(x, y, crtl, alt, shift) {
        const upPoint = this.getDrawingPoint(x, y, crtl, alt, shift);
        if (this.drawPoint.isEqual(upPoint)) {
            const circle = new Circle();
            circle.drawPoint = upPoint;
            if (!this.drawProvider.containsCircle(circle)) {
                this.drawProvider.addCircle(circle);
            }
            else {
                this.drawProvider.reomveCircle(circle);
            }
        }
        else {
            const arrow = new Arrow();
            arrow.start = this.drawPoint;
            arrow.end = upPoint;
            if (!this.drawProvider.containsArrow(arrow)) {
                this.drawProvider.addArrow(arrow);
            }
            else {
                this.drawProvider.removeArrow(arrow);
            }
        }
    }
    move(coords) {
        if (coords) {
            const sourceIndexes = MoveUtils.translateCoordsToIndex(coords.substring(0, 2), this.board.reverted);
            const destIndexes = MoveUtils.translateCoordsToIndex(coords.substring(2, 4), this.board.reverted);
            const srcPiece = this.getPieceByPoint(sourceIndexes.yAxis, sourceIndexes.xAxis);
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
    }
    getCustomPieceIcons(piece) {
        return JSON.parse(`{ "background-image": "url('${this.pieceIconManager.getPieceIcon(piece)}')"}`);
    }
    isPieceDisabled(pieceClicked) {
        if (pieceClicked && pieceClicked.point) {
            const foundCapture = this.board.possibleCaptures.find((capture) => capture.col === pieceClicked.point.col &&
                capture.row === pieceClicked.point.row);
            if (foundCapture) {
                return false;
            }
        }
        return (pieceClicked &&
            ((this.lightDisabled && pieceClicked.color === Color.WHITE) ||
                (this.darkDisabled && pieceClicked.color === Color.BLACK)));
    }
}
NgxChessBoardComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-chess-board',
                template: "<div\r\n    id=\"board\"\r\n    [style.height.px]=\"heightAndWidth\"\r\n    [style.width.px]=\"heightAndWidth\"\r\n    (pointerdown)=\"!modal.opened && onMouseDown($event)\"\r\n    (pointerup)=\"!modal.opened && onMouseUp($event)\"\r\n    #boardRef\r\n>\r\n    <div id=\"drag\">\r\n        <div\r\n            class=\"board-row\"\r\n            *ngFor=\"let row of board.board; let i = index\"\r\n        >\r\n            <div\r\n                class=\"board-col\"\r\n                [class.current-selection]=\"board.isXYInActiveMove(i,j)\"\r\n                [class.dest-move]=\"board.isXYInDestMove(i,j)\"\r\n                [class.king-check]=\" isKingChecked(getPieceByPoint(i,j))\"\r\n                [class.point-circle]=\"board.isXYInPointSelection(i, j)\"\r\n                [class.possible-capture]=\"board.isXYInPossibleCaptures(i, j)\"\r\n                [class.possible-point]=\"board.isXYInPossibleMoves(i, j)\"\r\n                [class.source-move]=\"board.isXYInSourceMove(i, j)\"\r\n                [style.background-color]=\"((i + j) % 2 === 0 ) ? lightTileColor : darkTileColor\"\r\n                *ngFor=\"let col of row; let j = index\"\r\n            >\r\n                <span\r\n                    class=\"yCoord\"\r\n                    [style.color]=\"(i % 2 === 0) ? lightTileColor : darkTileColor\"\r\n                    [style.font-size.px]=\"pieceSize / 4\"\r\n                    *ngIf=\"showCoords && j === 7\"\r\n                >\r\n                    {{coords.yCoords[i]}}\r\n                </span>\r\n                <span\r\n                    class=\"xCoord\"\r\n                    [style.color]=\"(j % 2 === 0) ? lightTileColor : darkTileColor\"\r\n                    [style.font-size.px]=\"pieceSize / 4\"\r\n                    *ngIf=\"showCoords && i === 7\"\r\n                >\r\n                    {{coords.xCoords[j]}}\r\n                </span>\r\n                <div\r\n                    *ngIf=\"getPieceByPoint(i, j) as piece\"\r\n                    style=\"height:100%; width:100%\"\r\n                >\r\n                    <div\r\n                        [cdkDragDisabled]=\"dragDisabled\"\r\n                        [innerHTML]=\"pieceIconManager.isDefaultIcons() ? getPieceByPoint(i,j).constant.icon : ''\"\r\n                        [ngClass]=\"'piece'\"\r\n                        [style.font-size]=\"pieceSize + 'px'\"\r\n                        [ngStyle]=\"pieceIconManager.isDefaultIcons() ? '' : getCustomPieceIcons(getPieceByPoint(i,j))\"\r\n                        (cdkDragEnded)=\"dragEnded($event)\"\r\n                        (cdkDragStarted)=\"dragStart($event)\"\r\n                        cdkDrag\r\n                    >\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <svg\r\n        [attr.height]=\"heightAndWidth\"\r\n        [attr.width]=\"heightAndWidth\"\r\n        style=\"position:absolute; top:0; pointer-events: none\"\r\n    >\r\n        <defs *ngFor=\"let color of ['red', 'green', 'blue', 'orange']\">\r\n            <marker\r\n                [id]=\"color + 'Arrow'\"\r\n                markerHeight=\"13\"\r\n                markerWidth=\"13\"\r\n                orient=\"auto\"\r\n                refX=\"9\"\r\n                refY=\"6\"\r\n            >\r\n                <path\r\n                    [style.fill]=\"color\"\r\n                    d=\"M2,2 L2,11 L10,6 L2,2\"\r\n                ></path>\r\n            </marker>\r\n        </defs>\r\n        <line\r\n            class=\"arrow\"\r\n            [attr.marker-end]=\"'url(#' + arrow.end.color + 'Arrow)'\"\r\n            [attr.stroke]=\"arrow.end.color\"\r\n            [attr.x1]=\"arrow.start.x\"\r\n            [attr.x2]=\"arrow.end.x\"\r\n            [attr.y1]=\"arrow.start.y\"\r\n            [attr.y2]=\"arrow.end.y\"\r\n            *ngFor=\"let arrow of drawProvider.arrows$ | async\"\r\n        ></line>\r\n        <circle\r\n            [attr.cx]=\"circle.drawPoint.x\"\r\n            [attr.cy]=\"circle.drawPoint.y\"\r\n            [attr.r]=\"heightAndWidth / 18\"\r\n            [attr.stroke]=\"circle.drawPoint.color\"\r\n            *ngFor=\"let circle of drawProvider.circles$ | async\"\r\n            fill-opacity=\"0.0\"\r\n            stroke-width=\"2\"\r\n        ></circle>\r\n    </svg>\r\n    <app-piece-promotion-modal #modal></app-piece-promotion-modal>\r\n</div>\r\n",
                styles: ["@charset \"UTF-8\";#board{font-family:Courier New,serif;position:relative}.board-row{display:block;height:12.5%;position:relative;width:100%}.board-col{cursor:default;display:inline-block;height:100%;position:relative;vertical-align:top;width:12.5%}.piece{-moz-user-select:none;-webkit-user-select:none;background-size:cover;color:#000!important;cursor:-webkit-grab;cursor:grab;height:100%;justify-content:center;text-align:center;user-select:none;width:100%}.piece,.piece:after{box-sizing:border-box}.piece:after{content:\"\u200B\"}#drag{height:100%;width:100%}.possible-point{background:radial-gradient(#13262f 15%,transparent 20%)}.possible-capture:hover,.possible-point:hover{opacity:.4}.possible-capture{background:radial-gradient(transparent 0,transparent 80%,#13262f 0);box-sizing:border-box;margin:0;opacity:.5;padding:0}.king-check{background:radial-gradient(ellipse at center,red 0,#e70000 25%,rgba(169,0,0,0) 89%,rgba(158,0,0,0) 100%)}.source-move{background-color:rgba(146,111,26,.79)!important}.dest-move{background-color:#b28e1a!important}.current-selection{background-color:hsla(0,0%,100%,.5)!important}.yCoord{right:.2em}.xCoord,.yCoord{-moz-user-select:none;-webkit-user-select:none;box-sizing:border-box;cursor:pointer;font-family:Lucida Console,Courier,monospace;position:absolute;user-select:none}.xCoord{bottom:0;left:.2em}.hovering{background-color:red!important}.arrow{stroke-width:2}svg{filter:drop-shadow(1px 1px 0 #111) drop-shadow(-1px 1px 0 #111) drop-shadow(1px -1px 0 #111) drop-shadow(-1px -1px 0 #111)}"]
            },] }
];
NgxChessBoardComponent.ctorParameters = () => [
    { type: NgxChessBoardService }
];
NgxChessBoardComponent.propDecorators = {
    darkTileColor: [{ type: Input }],
    lightTileColor: [{ type: Input }],
    showCoords: [{ type: Input }],
    dragDisabled: [{ type: Input }],
    drawDisabled: [{ type: Input }],
    lightDisabled: [{ type: Input }],
    darkDisabled: [{ type: Input }],
    moveChange: [{ type: Output }],
    checkmate: [{ type: Output }],
    stalemate: [{ type: Output }],
    boardRef: [{ type: ViewChild, args: ['boardRef',] }],
    modal: [{ type: ViewChild, args: ['modal',] }],
    size: [{ type: Input, args: ['size',] }],
    pieceIcons: [{ type: Input, args: ['pieceIcons',] }],
    onRightClick: [{ type: HostListener, args: ['contextmenu', ['$event'],] }]
};

class PiecePromotionModalComponent {
    constructor() {
        this.selectedIndex = 0;
        this.Color = Color;
        this.opened = false;
    }
    open(color, closeCallback) {
        this.opened = true;
        this.color = color;
        this.onCloseCallback = closeCallback;
        this.modal.nativeElement.style.display = 'block';
    }
    changeSelection(index) {
        this.modal.nativeElement.style.display = 'none';
        this.opened = false;
        this.onCloseCallback(index);
    }
}
PiecePromotionModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-piece-promotion-modal',
                template: "<div\r\n    class=\"container\"\r\n    #modal\r\n>\r\n    <div class=\"wrapper\">\r\n        <div\r\n            class=\"piece\"\r\n            [class.black-bishop]=\"piece === 'bishop' && color === Color.BLACK\"\r\n            [class.black-knight]=\"piece === 'knight' && color === Color.BLACK\"\r\n            [class.black-queen]=\"piece === 'queen' && color === Color.BLACK\"\r\n            [class.black-rook]=\"piece === 'rook' && color === Color.BLACK\"\r\n            [class.selected]=\"selectedIndex === index + 1\"\r\n            [class.white-bishop]=\"piece === 'bishop' && color === Color.WHITE\"\r\n            [class.white-knight]=\"piece === 'knight' && color === Color.WHITE\"\r\n            [class.white-queen]=\"piece === 'queen' && color === Color.WHITE\"\r\n            [class.white-rook]=\"piece === 'rook' && color === Color.WHITE\"\r\n            (click)=\"changeSelection(index + 1)\"\r\n            *ngFor=\"let piece of ['queen', 'rook', 'bishop', 'knight']; let index = index\"\r\n        >\r\n        </div>\r\n    </div>\r\n</div>\r\n",
                styles: [".container{background-color:rgba(0,0,0,.4);color:#000;display:none;height:100%;overflow:auto;position:absolute;top:0;width:100%;z-index:1}.wrapper{background-color:#fff;display:flex}.content{height:100%}.piece{background-repeat:no-repeat;background-size:100%;border:2px solid grey;border-radius:4px;box-sizing:border-box;cursor:pointer;height:100px;margin:10px;width:25%}.piece:hover{background-color:rgba(0,0,0,.2)}#close-button{background-color:#4caf50;border:none;border-radius:4px;color:#fff;display:inline-block;padding-left:5px;padding-right:5px;text-align:center;text-decoration:none}.selected{border:2px solid #00b919}"]
            },] }
];
PiecePromotionModalComponent.propDecorators = {
    modal: [{ type: ViewChild, args: ['modal',] }]
};

class NgxChessBoardModule {
    static forRoot() {
        return {
            ngModule: NgxChessBoardModule,
            providers: [NgxChessBoardService],
        };
    }
}
NgxChessBoardModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgxChessBoardComponent, PiecePromotionModalComponent],
                imports: [CommonModule, DragDropModule],
                exports: [NgxChessBoardComponent],
            },] }
];

/*
 * Public API Surface of ngx-chess-board
 */
/*
 * Public API Surface of im-grid
 */

/**
 * Generated bundle index. Do not edit.
 */

export { HistoryMove, NgxChessBoardComponent, NgxChessBoardModule, NgxChessBoardService, PiecePromotionModalComponent };
//# sourceMappingURL=ngx-chess-board.js.map
