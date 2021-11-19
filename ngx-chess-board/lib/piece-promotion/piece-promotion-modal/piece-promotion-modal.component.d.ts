import { ElementRef } from '@angular/core';
import { PieceIconInput } from '../../utils/inputs/piece-icon-input';
export declare class PiecePromotionModalComponent {
    modal: ElementRef;
    pieceIconInput: PieceIconInput;
    color: string;
    opened: boolean;
    private onCloseCallback;
    open(closeCallback: (index: number) => void): void;
    changeSelection(index: number): void;
    getPieceIcon(piece: string): string;
}
