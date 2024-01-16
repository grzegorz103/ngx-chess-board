import { Color } from "../models/pieces/color";
import { Piece } from "../models/pieces/piece";

export class HistoryMove {
    move: string;
    piece: Piece;
    color: Color;
    x: boolean;
    check: boolean;
    stalemate: boolean;
    premove: boolean;
    checkmate: boolean;

    constructor(move: string, piece: Piece, color: Color, captured: boolean, premove: boolean) {
        this.move = move;
        this.piece = piece;
        this.color = color;
        this.x = captured;
        this.premove = premove
    }

    setGameStates(check: boolean, stalemate: boolean, checkmate: boolean): void {
        this.check = check;
        this.stalemate = stalemate;
        this.checkmate = checkmate;
    }

}
