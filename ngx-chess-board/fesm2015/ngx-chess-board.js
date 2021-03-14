import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { NgForOf, NgIf, NgClass, NgStyle, AsyncPipe, CommonModule } from '@angular/common';
import { ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, ɵɵdefineComponent, ɵɵviewQuery, ɵɵqueryRefresh, ɵɵloadQuery, ɵɵelementStart, ɵɵlistener, ɵɵtext, ɵɵelementEnd, Component, ViewChild, ɵɵnextContext, ɵɵstyleProp, ɵɵadvance, ɵɵtextInterpolate1, ɵɵgetCurrentView, ɵɵrestoreView, ɵɵproperty, ɵɵsanitizeHtml, ɵɵtemplate, ɵɵclassProp, ɵɵnamespaceSVG, ɵɵelement, ɵɵattribute, EventEmitter, ɵɵdirectiveInject, ɵɵNgOnChangesFeature, ɵɵreference, ɵɵpipe, ɵɵnamespaceHTML, ɵɵpureFunction0, ɵɵpipeBind1, Input, Output, HostListener, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
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
        this.defaultYCoords = [8, 7, 6, 5, 4, 3, 2, 1];
        this.currentXCoords = [...this.defaultXCoords];
        this.currentYCoords = [...this.defaultYCoords];
    }
    get xCoords() {
        return this.currentXCoords;
    }
    get yCoords() {
        return this.currentYCoords;
    }
    reverse() {
        this.currentXCoords = this.currentXCoords.reverse();
        this.currentYCoords = this.currentYCoords.reverse();
    }
    reset() {
        this.init();
    }
    init() {
        this.currentXCoords = [...this.defaultXCoords];
        this.currentYCoords = [...this.defaultYCoords];
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

class NgxChessBoardService {
    constructor() {
        this.componentMethodCallSource = new Subject();
        this.componentMethodCalled$ = this.componentMethodCallSource.asObservable();
    }
    reset() {
        this.componentMethodCallSource.next();
    }
}
NgxChessBoardService.ɵfac = function NgxChessBoardService_Factory(t) { return new (t || NgxChessBoardService)(); };
NgxChessBoardService.ɵprov = ɵɵdefineInjectable({ token: NgxChessBoardService, factory: NgxChessBoardService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(NgxChessBoardService, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], null, null); })();

const _c0 = ["myModal"];
class PiecePromotionModalComponent {
    constructor() {
        this.opened = false;
    }
    open(closeCallback) {
        this.opened = true;
        this.onCloseCallback = closeCallback;
        this.modal.nativeElement.style.display = 'block';
    }
    changeSelection(index) {
        this.modal.nativeElement.style.display = 'none';
        this.opened = false;
        this.onCloseCallback(index);
    }
}
PiecePromotionModalComponent.ɵfac = function PiecePromotionModalComponent_Factory(t) { return new (t || PiecePromotionModalComponent)(); };
PiecePromotionModalComponent.ɵcmp = ɵɵdefineComponent({ type: PiecePromotionModalComponent, selectors: [["app-piece-promotion-modal"]], viewQuery: function PiecePromotionModalComponent_Query(rf, ctx) { if (rf & 1) {
        ɵɵviewQuery(_c0, true);
    } if (rf & 2) {
        var _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.modal = _t.first);
    } }, decls: 13, vars: 0, consts: [[1, "container"], ["myModal", ""], [1, "wrapper"], [1, "content"], [1, "piece-wrapper"], [1, "piece", 3, "click"]], template: function PiecePromotionModalComponent_Template(rf, ctx) { if (rf & 1) {
        ɵɵelementStart(0, "div", 0, 1);
        ɵɵelementStart(2, "div", 2);
        ɵɵelementStart(3, "div", 3);
        ɵɵelementStart(4, "div", 4);
        ɵɵelementStart(5, "div", 5);
        ɵɵlistener("click", function PiecePromotionModalComponent_Template_div_click_5_listener() { return ctx.changeSelection(1); });
        ɵɵtext(6, "\u265B");
        ɵɵelementEnd();
        ɵɵelementStart(7, "div", 5);
        ɵɵlistener("click", function PiecePromotionModalComponent_Template_div_click_7_listener() { return ctx.changeSelection(2); });
        ɵɵtext(8, "\u265C");
        ɵɵelementEnd();
        ɵɵelementStart(9, "div", 5);
        ɵɵlistener("click", function PiecePromotionModalComponent_Template_div_click_9_listener() { return ctx.changeSelection(3); });
        ɵɵtext(10, "\u265D");
        ɵɵelementEnd();
        ɵɵelementStart(11, "div", 5);
        ɵɵlistener("click", function PiecePromotionModalComponent_Template_div_click_11_listener() { return ctx.changeSelection(4); });
        ɵɵtext(12, "\u265E");
        ɵɵelementEnd();
        ɵɵelementEnd();
        ɵɵelementEnd();
        ɵɵelementEnd();
        ɵɵelementEnd();
    } }, styles: [".container[_ngcontent-%COMP%]{background-color:rgba(0,0,0,.4);color:#000;display:none;overflow:auto;position:absolute;top:0;z-index:1}.container[_ngcontent-%COMP%], .wrapper[_ngcontent-%COMP%]{height:100%;width:100%}.content[_ngcontent-%COMP%], .wrapper[_ngcontent-%COMP%]{position:relative}.content[_ngcontent-%COMP%]{background-color:#fefefe;border:1px solid #888;font-size:100%;height:40%;margin:auto;padding:10px;top:30%;width:90%}.piece[_ngcontent-%COMP%]{cursor:pointer;display:inline-block;font-size:5rem;height:100%;width:25%}.piece[_ngcontent-%COMP%]:hover{background-color:#ccc;border-radius:5px}.piece-wrapper[_ngcontent-%COMP%]{height:80%;width:100%}#close-button[_ngcontent-%COMP%]{background-color:#4caf50;border:none;border-radius:4px;color:#fff;display:inline-block;padding-left:5px;padding-right:5px;text-align:center;text-decoration:none}.selected[_ngcontent-%COMP%]{border:2px solid #00b919;border-radius:4px;box-sizing:border-box}"] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(PiecePromotionModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-piece-promotion-modal',
                templateUrl: './piece-promotion-modal.component.html',
                styleUrls: ['./piece-promotion-modal.component.scss']
            }]
    }], null, { modal: [{
            type: ViewChild,
            args: ['myModal', { static: false }]
        }] }); })();

const _c0$1 = ["boardRef"];
const _c1 = ["modal"];
function NgxChessBoardComponent_div_3_div_1_span_1_Template(rf, ctx) { if (rf & 1) {
    ɵɵelementStart(0, "span", 15);
    ɵɵtext(1);
    ɵɵelementEnd();
} if (rf & 2) {
    const i_r7 = ɵɵnextContext(2).index;
    const ctx_r11 = ɵɵnextContext();
    ɵɵstyleProp("color", i_r7 % 2 === 0 ? ctx_r11.lightTileColor : ctx_r11.darkTileColor)("font-size", ctx_r11.pieceSize / 4, "px");
    ɵɵadvance(1);
    ɵɵtextInterpolate1(" ", ctx_r11.coords.yCoords[i_r7], " ");
} }
function NgxChessBoardComponent_div_3_div_1_span_2_Template(rf, ctx) { if (rf & 1) {
    ɵɵelementStart(0, "span", 16);
    ɵɵtext(1);
    ɵɵelementEnd();
} if (rf & 2) {
    const j_r10 = ɵɵnextContext().index;
    const ctx_r12 = ɵɵnextContext(2);
    ɵɵstyleProp("color", j_r10 % 2 === 0 ? ctx_r12.lightTileColor : ctx_r12.darkTileColor)("font-size", ctx_r12.pieceSize / 4, "px");
    ɵɵadvance(1);
    ɵɵtextInterpolate1(" ", ctx_r12.coords.xCoords[j_r10], " ");
} }
function NgxChessBoardComponent_div_3_div_1_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r18 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 17);
    ɵɵelementStart(1, "div", 18);
    ɵɵlistener("cdkDragEnded", function NgxChessBoardComponent_div_3_div_1_div_3_Template_div_cdkDragEnded_1_listener($event) { ɵɵrestoreView(_r18); const ctx_r17 = ɵɵnextContext(3); return ctx_r17.dragEnded($event); })("cdkDragStarted", function NgxChessBoardComponent_div_3_div_1_div_3_Template_div_cdkDragStarted_1_listener($event) { ɵɵrestoreView(_r18); const ctx_r19 = ɵɵnextContext(3); return ctx_r19.dragStart($event); });
    ɵɵelementEnd();
    ɵɵelementEnd();
} if (rf & 2) {
    const j_r10 = ɵɵnextContext().index;
    const i_r7 = ɵɵnextContext().index;
    const ctx_r13 = ɵɵnextContext();
    ɵɵadvance(1);
    ɵɵstyleProp("font-size", ctx_r13.pieceSize + "px");
    ɵɵproperty("cdkDragDisabled", ctx_r13.dragDisabled)("innerHTML", ctx_r13.pieceIconManager.isDefaultIcons() ? ctx_r13.getPieceByPoint(i_r7, j_r10).constant.icon : "", ɵɵsanitizeHtml)("ngClass", "piece")("ngStyle", ctx_r13.pieceIconManager.isDefaultIcons() ? "" : ctx_r13.getCustomPieceIcons(ctx_r13.getPieceByPoint(i_r7, j_r10)));
} }
function NgxChessBoardComponent_div_3_div_1_Template(rf, ctx) { if (rf & 1) {
    ɵɵelementStart(0, "div", 11);
    ɵɵtemplate(1, NgxChessBoardComponent_div_3_div_1_span_1_Template, 2, 5, "span", 12);
    ɵɵtemplate(2, NgxChessBoardComponent_div_3_div_1_span_2_Template, 2, 5, "span", 13);
    ɵɵtemplate(3, NgxChessBoardComponent_div_3_div_1_div_3_Template, 2, 6, "div", 14);
    ɵɵelementEnd();
} if (rf & 2) {
    const j_r10 = ctx.index;
    const i_r7 = ɵɵnextContext().index;
    const ctx_r8 = ɵɵnextContext();
    ɵɵstyleProp("background-color", (i_r7 + j_r10) % 2 === 0 ? ctx_r8.lightTileColor : ctx_r8.darkTileColor);
    ɵɵclassProp("current-selection", ctx_r8.board.isXYInActiveMove(i_r7, j_r10))("dest-move", ctx_r8.board.isXYInDestMove(i_r7, j_r10))("king-check", ctx_r8.isKingChecked(ctx_r8.getPieceByPoint(i_r7, j_r10)))("point-circle", ctx_r8.board.isXYInPointSelection(i_r7, j_r10))("possible-capture", ctx_r8.board.isXYInPossibleCaptures(i_r7, j_r10))("possible-point", ctx_r8.board.isXYInPossibleMoves(i_r7, j_r10))("source-move", ctx_r8.board.isXYInSourceMove(i_r7, j_r10));
    ɵɵadvance(1);
    ɵɵproperty("ngIf", ctx_r8.showCoords && j_r10 === 7);
    ɵɵadvance(1);
    ɵɵproperty("ngIf", ctx_r8.showCoords && i_r7 === 7);
    ɵɵadvance(1);
    ɵɵproperty("ngIf", ctx_r8.getPieceByPoint(i_r7, j_r10));
} }
function NgxChessBoardComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    ɵɵelementStart(0, "div", 9);
    ɵɵtemplate(1, NgxChessBoardComponent_div_3_div_1_Template, 4, 19, "div", 10);
    ɵɵelementEnd();
} if (rf & 2) {
    const row_r6 = ctx.$implicit;
    ɵɵadvance(1);
    ɵɵproperty("ngForOf", row_r6);
} }
function NgxChessBoardComponent__svg_defs_5_Template(rf, ctx) { if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelementStart(0, "defs");
    ɵɵelementStart(1, "marker", 19);
    ɵɵelement(2, "path", 20);
    ɵɵelementEnd();
    ɵɵelementEnd();
} if (rf & 2) {
    const color_r23 = ctx.$implicit;
    ɵɵadvance(1);
    ɵɵproperty("id", color_r23 + "Arrow");
    ɵɵadvance(1);
    ɵɵstyleProp("fill", color_r23);
} }
function NgxChessBoardComponent__svg_line_6_Template(rf, ctx) { if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "line", 21);
} if (rf & 2) {
    const arrow_r24 = ctx.$implicit;
    ɵɵattribute("marker-end", "url(#" + arrow_r24.end.color + "Arrow)")("stroke", arrow_r24.end.color)("x1", arrow_r24.start.x)("x2", arrow_r24.end.x)("y1", arrow_r24.start.y)("y2", arrow_r24.end.y);
} }
function NgxChessBoardComponent__svg_circle_8_Template(rf, ctx) { if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "circle", 22);
} if (rf & 2) {
    const circle_r25 = ctx.$implicit;
    const ctx_r4 = ɵɵnextContext();
    ɵɵattribute("cx", circle_r25.drawPoint.x)("cy", circle_r25.drawPoint.y)("r", ctx_r4.heightAndWidth / 18)("stroke", circle_r25.drawPoint.color);
} }
const _c2 = function () { return ["red", "green", "blue", "orange"]; };
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
        /**
         * Enabling free mode removes turn-based restriction and allows to move any piece freely!
         */
        this.freeMode = false;
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
            this.handleClickEvent(pointClicked, false);
            //   this.possibleMoves = activePiece.getPossibleMoves();
        }
    }
    onPieceClicked(pieceClicked, pointClicked) {
        if ((this.board.currentWhitePlayer && pieceClicked.color === Color.BLACK) ||
            (!this.board.currentWhitePlayer && pieceClicked.color === Color.WHITE)) {
            return;
        }
        this.prepareActivePiece(pieceClicked, pointClicked);
    }
    /**
     * Validates whether freemode is turned on!
     */
    isFreeMode() {
        return this.freeMode;
    }
    /**
     * Processes logic to allow freeMode based logic processing
     */
    onFreeMode(pieceClicked) {
        if (!this.isFreeMode() ||
            pieceClicked === undefined ||
            pieceClicked === null) {
            return;
        }
        // sets player as white in-case white pieces are selected, and vice-versa when black is selected
        this.board.currentWhitePlayer = pieceClicked.color === Color.WHITE;
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
            stalemate, fen: this.board.fen, freeMode: this.freeMode }));
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
                    if (!this.freeMode) {
                        leftRook.point.col = this.board.reverted ? 2 : 3;
                    }
                }
                else {
                    const rightRook = this.board.getPieceByField(toMovePiece.point.row, 7);
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
        this.modal.open((index) => {
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
        this.freeMode = false;
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
            this.coords.reset();
        }
        catch (exception) {
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
    handleClickEvent(pointClicked, isMouseDown) {
        let moving = false;
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
        const pieceClicked = this.getPieceByPoint(pointClicked.row, pointClicked.col);
        if (pieceClicked && !moving) {
            this.onFreeMode(pieceClicked);
            this.onPieceClicked(pieceClicked, pointClicked);
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
NgxChessBoardComponent.ɵfac = function NgxChessBoardComponent_Factory(t) { return new (t || NgxChessBoardComponent)(ɵɵdirectiveInject(NgxChessBoardService)); };
NgxChessBoardComponent.ɵcmp = ɵɵdefineComponent({ type: NgxChessBoardComponent, selectors: [["ngx-chess-board"]], viewQuery: function NgxChessBoardComponent_Query(rf, ctx) { if (rf & 1) {
        ɵɵviewQuery(_c0$1, true);
        ɵɵviewQuery(_c1, true);
    } if (rf & 2) {
        var _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.boardRef = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.modal = _t.first);
    } }, hostBindings: function NgxChessBoardComponent_HostBindings(rf, ctx) { if (rf & 1) {
        ɵɵlistener("contextmenu", function NgxChessBoardComponent_contextmenu_HostBindingHandler($event) { return ctx.onRightClick($event); });
    } }, inputs: { darkTileColor: "darkTileColor", lightTileColor: "lightTileColor", showCoords: "showCoords", dragDisabled: "dragDisabled", drawDisabled: "drawDisabled", lightDisabled: "lightDisabled", darkDisabled: "darkDisabled", freeMode: "freeMode", size: "size", pieceIcons: "pieceIcons" }, outputs: { moveChange: "moveChange", checkmate: "checkmate", stalemate: "stalemate" }, features: [ɵɵNgOnChangesFeature], decls: 12, vars: 15, consts: [["id", "board", 3, "pointerdown", "pointerup"], ["boardRef", ""], ["id", "drag"], ["class", "board-row", 4, "ngFor", "ngForOf"], [2, "position", "absolute", "top", "0", "pointer-events", "none"], [4, "ngFor", "ngForOf"], ["class", "arrow", 4, "ngFor", "ngForOf"], ["fill-opacity", "0.0", "stroke-width", "2", 4, "ngFor", "ngForOf"], ["modal", ""], [1, "board-row"], ["class", "board-col", 3, "current-selection", "dest-move", "king-check", "point-circle", "possible-capture", "possible-point", "source-move", "background-color", 4, "ngFor", "ngForOf"], [1, "board-col"], ["class", "yCoord", 3, "color", "font-size", 4, "ngIf"], ["class", "xCoord", 3, "color", "font-size", 4, "ngIf"], ["style", "height:100%; width:100%", 4, "ngIf"], [1, "yCoord"], [1, "xCoord"], [2, "height", "100%", "width", "100%"], ["cdkDrag", "", 3, "cdkDragDisabled", "innerHTML", "ngClass", "ngStyle", "cdkDragEnded", "cdkDragStarted"], ["markerHeight", "13", "markerWidth", "13", "orient", "auto", "refX", "9", "refY", "6", 3, "id"], ["d", "M2,2 L2,11 L10,6 L2,2"], [1, "arrow"], ["fill-opacity", "0.0", "stroke-width", "2"]], template: function NgxChessBoardComponent_Template(rf, ctx) { if (rf & 1) {
        const _r26 = ɵɵgetCurrentView();
        ɵɵelementStart(0, "div", 0, 1);
        ɵɵlistener("pointerdown", function NgxChessBoardComponent_Template_div_pointerdown_0_listener($event) { ɵɵrestoreView(_r26); const _r5 = ɵɵreference(11); return !_r5.opened && ctx.onMouseDown($event); })("pointerup", function NgxChessBoardComponent_Template_div_pointerup_0_listener($event) { ɵɵrestoreView(_r26); const _r5 = ɵɵreference(11); return !_r5.opened && ctx.onMouseUp($event); });
        ɵɵelementStart(2, "div", 2);
        ɵɵtemplate(3, NgxChessBoardComponent_div_3_Template, 2, 1, "div", 3);
        ɵɵelementEnd();
        ɵɵnamespaceSVG();
        ɵɵelementStart(4, "svg", 4);
        ɵɵtemplate(5, NgxChessBoardComponent__svg_defs_5_Template, 3, 3, "defs", 5);
        ɵɵtemplate(6, NgxChessBoardComponent__svg_line_6_Template, 1, 6, "line", 6);
        ɵɵpipe(7, "async");
        ɵɵtemplate(8, NgxChessBoardComponent__svg_circle_8_Template, 1, 4, "circle", 7);
        ɵɵpipe(9, "async");
        ɵɵelementEnd();
        ɵɵnamespaceHTML();
        ɵɵelement(10, "app-piece-promotion-modal", null, 8);
        ɵɵelementEnd();
    } if (rf & 2) {
        ɵɵstyleProp("height", ctx.heightAndWidth, "px")("width", ctx.heightAndWidth, "px");
        ɵɵadvance(3);
        ɵɵproperty("ngForOf", ctx.board.board);
        ɵɵadvance(1);
        ɵɵattribute("height", ctx.heightAndWidth)("width", ctx.heightAndWidth);
        ɵɵadvance(1);
        ɵɵproperty("ngForOf", ɵɵpureFunction0(14, _c2));
        ɵɵadvance(1);
        ɵɵproperty("ngForOf", ɵɵpipeBind1(7, 10, ctx.drawProvider.arrows$));
        ɵɵadvance(2);
        ɵɵproperty("ngForOf", ɵɵpipeBind1(9, 12, ctx.drawProvider.circles$));
    } }, directives: [NgForOf, PiecePromotionModalComponent, NgIf, CdkDrag, NgClass, NgStyle], pipes: [AsyncPipe], styles: ["@charset \"UTF-8\";#board[_ngcontent-%COMP%]{font-family:Courier New,serif;position:relative}.board-row[_ngcontent-%COMP%]{display:block;height:12.5%;position:relative;width:100%}.board-col[_ngcontent-%COMP%]{cursor:default;display:inline-block;height:100%;position:relative;vertical-align:top;width:12.5%}.piece[_ngcontent-%COMP%]{-moz-user-select:none;-webkit-user-select:none;background-size:cover;color:#000!important;cursor:-webkit-grab;cursor:grab;height:100%;justify-content:center;text-align:center;user-select:none;width:100%}.piece[_ngcontent-%COMP%], .piece[_ngcontent-%COMP%]:after{box-sizing:border-box}.piece[_ngcontent-%COMP%]:after{content:\"\u200B\"}#drag[_ngcontent-%COMP%]{height:100%;width:100%}.possible-point[_ngcontent-%COMP%]{background:radial-gradient(#13262f 15%,transparent 20%)}.possible-capture[_ngcontent-%COMP%]:hover, .possible-point[_ngcontent-%COMP%]:hover{opacity:.4}.possible-capture[_ngcontent-%COMP%]{background:radial-gradient(transparent 0,transparent 80%,#13262f 0);box-sizing:border-box;margin:0;opacity:.5;padding:0}.king-check[_ngcontent-%COMP%]{background:radial-gradient(ellipse at center,red 0,#e70000 25%,rgba(169,0,0,0) 89%,rgba(158,0,0,0) 100%)}.source-move[_ngcontent-%COMP%]{background-color:rgba(146,111,26,.79)!important}.dest-move[_ngcontent-%COMP%]{background-color:#b28e1a!important}.current-selection[_ngcontent-%COMP%]{background-color:#72620b!important}.yCoord[_ngcontent-%COMP%]{right:.2em}.xCoord[_ngcontent-%COMP%], .yCoord[_ngcontent-%COMP%]{-moz-user-select:none;-webkit-user-select:none;box-sizing:border-box;cursor:pointer;font-family:Lucida Console,Courier,monospace;position:absolute;user-select:none}.xCoord[_ngcontent-%COMP%]{bottom:0;left:.2em}.hovering[_ngcontent-%COMP%]{background-color:red!important}.arrow[_ngcontent-%COMP%]{stroke-width:2}svg[_ngcontent-%COMP%]{filter:drop-shadow(1px 1px 0 #111) drop-shadow(-1px 1px 0 #111) drop-shadow(1px -1px 0 #111) drop-shadow(-1px -1px 0 #111)}[_nghost-%COMP%]{display:inline-block!important}"] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(NgxChessBoardComponent, [{
        type: Component,
        args: [{
                selector: 'ngx-chess-board',
                templateUrl: './ngx-chess-board.component.html',
                styleUrls: ['./ngx-chess-board.component.scss'],
            }]
    }], function () { return [{ type: NgxChessBoardService }]; }, { darkTileColor: [{
            type: Input
        }], lightTileColor: [{
            type: Input
        }], showCoords: [{
            type: Input
        }], dragDisabled: [{
            type: Input
        }], drawDisabled: [{
            type: Input
        }], lightDisabled: [{
            type: Input
        }], darkDisabled: [{
            type: Input
        }], freeMode: [{
            type: Input
        }], moveChange: [{
            type: Output
        }], checkmate: [{
            type: Output
        }], stalemate: [{
            type: Output
        }], boardRef: [{
            type: ViewChild,
            args: ['boardRef']
        }], modal: [{
            type: ViewChild,
            args: ['modal']
        }], size: [{
            type: Input,
            args: ['size']
        }], pieceIcons: [{
            type: Input,
            args: ['pieceIcons']
        }], onRightClick: [{
            type: HostListener,
            args: ['contextmenu', ['$event']]
        }] }); })();

class NgxChessBoardModule {
    static forRoot() {
        return {
            ngModule: NgxChessBoardModule,
            providers: [NgxChessBoardService],
        };
    }
}
NgxChessBoardModule.ɵmod = ɵɵdefineNgModule({ type: NgxChessBoardModule });
NgxChessBoardModule.ɵinj = ɵɵdefineInjector({ factory: function NgxChessBoardModule_Factory(t) { return new (t || NgxChessBoardModule)(); }, imports: [[CommonModule, DragDropModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(NgxChessBoardModule, { declarations: [NgxChessBoardComponent, PiecePromotionModalComponent], imports: [CommonModule, DragDropModule], exports: [NgxChessBoardComponent] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(NgxChessBoardModule, [{
        type: NgModule,
        args: [{
                declarations: [NgxChessBoardComponent, PiecePromotionModalComponent],
                imports: [CommonModule, DragDropModule],
                exports: [NgxChessBoardComponent],
            }]
    }], null, null); })();

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
