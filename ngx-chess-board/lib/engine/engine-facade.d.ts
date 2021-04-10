import { EventEmitter } from '@angular/core';
import { ColorInput, PieceTypeInput } from '../utils/inputs/piece-type-input';
import { AbstractEngineFacade } from './abstract-engine-facade';
import { BoardStateProvider } from './board-state-provider/board-state/board-state-provider';
import { MoveStateProvider } from './board-state-provider/board-state/move-state-provider';
import { DrawPoint } from './drawing-tools/draw-point';
import { DrawProvider } from './drawing-tools/draw-provider';
import { Board } from '../models/board';
import { Color } from '../models/pieces/color';
import { Piece } from '../models/pieces/piece';
import { Point } from '../models/pieces/point';
import { MoveChange } from './outputs/move-change/move-change';
export declare class EngineFacade extends AbstractEngineFacade {
    _selected: boolean;
    drawPoint: DrawPoint;
    drawProvider: DrawProvider;
    disabling: boolean;
    boardStateProvider: BoardStateProvider;
    moveStateProvider: MoveStateProvider;
    moveChange: EventEmitter<MoveChange>;
    constructor(board: Board, moveChange: EventEmitter<MoveChange>);
    reset(): void;
    undo(): void;
    saveMoveClone(): void;
    move(coords: string): void;
    prepareActivePiece(pieceClicked: Piece, pointClicked: Point): void;
    onPieceClicked(pieceClicked: any, pointClicked: any): void;
    handleClickEvent(pointClicked: Point, isMouseDown: boolean): void;
    onMouseDown(event: MouseEvent, pointClicked: Point, left?: number, top?: number): void;
    onMouseUp(event: MouseEvent, pointClicked: Point, left: number, top: number): void;
    saveClone(): void;
    movePiece(toMovePiece: Piece, newPoint: Point, promotionIndex?: number): void;
    checkForPawnPromote(toPromotePiece: Piece, promotionIndex?: number): boolean;
    afterMoveActions(promotionIndex?: number): void;
    checkForPat(color: Color): boolean;
    openPromoteDialog(piece: Piece): void;
    checkForPossibleMoves(color: Color): boolean;
    disableSelection(): void;
    /**
     * Processes logic to allow freeMode based logic processing
     */
    onFreeMode(pieceClicked: any): void;
    isPieceDisabled(pieceClicked: Piece): boolean;
    addDrawPoint(x: number, y: number, crtl: boolean, alt: boolean, shift: boolean, left: number, top: number): void;
    increaseFullMoveCount(): void;
    addPiece(pieceTypeInput: PieceTypeInput, colorInput: ColorInput, coords: string): void;
}
