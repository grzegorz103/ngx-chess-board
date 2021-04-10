import { Board } from '../models/board';
import { Color } from '../models/pieces/color';
import { Piece } from '../models/pieces/piece';
import { Point } from '../models/pieces/point';
import { MoveTranslation } from '../models/move-translation';
export declare class MoveUtils {
    static willMoveCauseCheck(currentColor: Color, row: number, col: number, destRow: number, destCol: number, board: Board): boolean;
    static format(sourcePoint: Point, destPoint: Point, reverted: boolean): string;
    static translateCoordsToIndex(coords: string, reverted: boolean): MoveTranslation;
    static findPieceByPossibleMovesContaining(coords: string, board: Board, color: Color): Piece[];
    static findPieceByPossibleCapturesContaining(coords: string, board: Board, color: Color): Piece[];
    static formatSingle(point: Point, reverted: boolean): string;
    static getFirstLetterPiece(piece: Piece): string;
    static reverse(board: Board, row: number): number;
    static formatCol(board: Board, col: number): string;
}
