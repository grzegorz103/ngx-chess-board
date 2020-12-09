import { Piece } from '../../models/pieces/piece';
import { PieceIconInput } from './piece-icon-input';
export declare class PieceIconInputManager {
    private _defaultIcons;
    private _pieceIconInput;
    get pieceIconInput(): PieceIconInput;
    set pieceIconInput(value: PieceIconInput);
    get defaultIcons(): boolean;
    set defaultIcons(value: boolean);
    isDefaultIcons(): boolean;
    getPieceIcon(piece: Piece): string;
    loadDefaultData(): void;
}
