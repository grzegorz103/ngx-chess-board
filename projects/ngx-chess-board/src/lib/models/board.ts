import { cloneDeep } from 'lodash';
import { Bishop } from './pieces/bishop';
import { Color } from './pieces/color';
import { King } from './pieces/king';
import { Knight } from './pieces/knight';
import { Pawn } from './pieces/pawn';
import { Piece } from './pieces/piece';
import { Point } from './pieces/point';
import { Queen } from './pieces/queen';
import { Rook } from './pieces/rook';

export class Board {
    board: number[][] = [];
    pieces: Piece[] = [];

    enPassantPoint: Point = null;
    enPassantPiece: Piece = null;
    lastMoveSrc: Point = null;
    lastMoveDest: Point = null;
    activePiece: Piece;

    blackKingChecked: boolean;
    possibleCaptures: any[] = [];
    possibleMoves: Point[] = [];
    whiteKingChecked: boolean;

    currentWhitePlayer = true;
    reverted = false;
    fullMoveCount = 1;
    fen: string;

    constructor() {
        for (let i = 0; i < 8; ++i) {
            this.board[i] = [];
            for (let j = 0; j < 8; ++j) {
                this.board[i][j] = 0;
            }
        }
    }

    isXYInPossibleMoves(row: number, col: number): boolean {
        return this.possibleMoves.some((move) => move.row === row && move.col === col);
    }

    isXYInPossibleCaptures(row: number, col: number): boolean {
        return this.possibleCaptures.some((capture) => capture.row === row && capture.col === col);
    }

    isXYInSourceMove(i: number, j: number) {
        return this.lastMoveSrc && this.lastMoveSrc.row === i && this.lastMoveSrc.col === j;
    }

    isXYInDestMove(i: number, j: number) {
        return this.lastMoveDest && this.lastMoveDest.row === i && this.lastMoveDest.col === j;
    }

    isXYInActiveMove(i: number, j: number) {
        return this.activePiece && this.activePiece.point.row === i && this.activePiece.point.col === j;
    }

    isPointInPossibleMoves(point: Point): boolean {
        return this.possibleMoves.some((move) => move.row === point.row && move.col === point.col);
    }

    isPointInPossibleCaptures(point: Point): boolean {
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

        this.pieces.forEach((piece: Piece) => this.reversePoint(piece.point));

        this.reversePoint(this.lastMoveSrc);
        this.reversePoint(this.lastMoveDest);

        if (this.enPassantPoint && this.enPassantPiece) {
            this.reversePoint(this.enPassantPoint);
        }
    }

    clone(): Board {
        return cloneDeep(this);
    }

    isFieldTakenByEnemy(row: number, col: number, enemyColor: Color): boolean {
        if (row > 7 || row < 0 || col > 7 || col < 0) {
            return false;
        }
        return this.pieces.some(
            (piece) => piece.point.col === col && piece.point.row === row && piece.color === enemyColor
        );
    }

    isFieldEmpty(row: number, col: number): boolean {
        if (row > 7 || row < 0 || col > 7 || col < 0) {
            return false;
        }
        return !this.pieces.some((piece) => piece.point.col === col && piece.point.row === row);
    }

    isFieldUnderAttack(row: number, col: number, color: Color) {
        return this.pieces
            .filter((piece) => piece.color === color)
            .some((piece) => piece.getCoveredFields().some((field) => field.col === col && field.row === row));
    }

    getPieceByField(row: number, col: number): Piece {
        if (this.isFieldEmpty(row, col)) {
            //   throw new Error('Piece not found');
            return undefined;
        }

        return this.pieces.find((piece) => piece.point.col === col && piece.point.row === row);
    }

    isKingInCheck(color: Color, pieces: Piece[]): boolean {
        const king = pieces.find((piece) => piece.color === color && piece instanceof King);

        if (king) {
            return pieces.some(
                (piece) =>
                    piece
                        .getPossibleCaptures()
                        .some((point) => point.col === king.point.col && point.row === king.point.row) &&
                    piece.color !== color
            );
        }
        return false;
    }

    getKingByColor(color: Color): King {
        return this.pieces.find((piece) => piece instanceof King && piece.color === color) as King;
    }

    getCastleFENString(color: Color) {
        const king = this.getKingByColor(color);

        if (!king || king.isMovedAlready) {
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
            } else {
                return String.fromCharCode(97 + this.enPassantPoint.col) + (Math.abs(this.enPassantPoint.row - 7) + 1);
            }
        } else {
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
                    } else {
                        if (foundPiece instanceof Knight) {
                            fen += foundPiece.color === Color.BLACK ? 'n' : 'N';
                        } else {
                            if (foundPiece instanceof Bishop) {
                                fen += foundPiece.color === Color.BLACK ? 'b' : 'B';
                            } else {
                                if (foundPiece instanceof Queen) {
                                    fen += foundPiece.color === Color.BLACK ? 'q' : 'Q';
                                } else {
                                    if (foundPiece instanceof King) {
                                        fen += foundPiece.color === Color.BLACK ? 'k' : 'K';
                                    } else {
                                        if (foundPiece instanceof Pawn) {
                                            fen += foundPiece.color === Color.BLACK ? 'p' : 'P';
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
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

    isXYInPointSelection(i: number, j: number) {
        return false;
    }

    private reversePoint(point: Point) {
        if (point) {
            point.row = Math.abs(point.row - 7);
            point.col = Math.abs(point.col - 7);
        }
    }

    public getPieceByPoint(row: number, col: number): Piece {
        row = Math.floor(row);
        col = Math.floor(col);
        return this.pieces.find(
            (piece) => piece.point.col === col && piece.point.row === row
        );
    }

    public checkIfPawnTakesEnPassant(newPoint: Point) {
        if (newPoint.isEqual(this.enPassantPoint)) {
            this.pieces = this.pieces.filter(
                (piece) => piece !== this.enPassantPiece
            );
            this.enPassantPoint = null;
            this.enPassantPiece = null;
        }
    }

    public checkIfPawnEnpassanted(piece: Pawn, newPoint: Point) {
        if (Math.abs(piece.point.row - newPoint.row) > 1) {
            this.enPassantPiece = piece;
            this.enPassantPoint = new Point(
                (piece.point.row + newPoint.row) / 2,
                piece.point.col
            );
        } else {
            this.enPassantPoint = null;
            this.enPassantPiece = null;
        }
    }

    isKingChecked(piece: Piece) {
        if (piece instanceof King) {
            return piece.color === Color.WHITE
                ? this.whiteKingChecked
                : this.blackKingChecked;
        }
    }

    getCurrentPlayerColor(): number {
        return this.currentWhitePlayer ? Color.WHITE : Color.BLACK;
    }
}
