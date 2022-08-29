import { ElementRef } from '@angular/core';
import { PieceIconInput } from '../../utils/inputs/piece-icon-input';
import * as i0 from "@angular/core";
export declare class PiecePromotionModalComponent {
    modal: ElementRef;
    pieceIconInput: PieceIconInput;
    color: string;
    opened: boolean;
    private onCloseCallback;
    open(closeCallback: (index: number) => void): void;
    changeSelection(index: number): void;
    getPieceIcon(piece: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<PiecePromotionModalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PiecePromotionModalComponent, "app-piece-promotion-modal", never, { "pieceIconInput": "pieceIconInput"; "color": "color"; }, {}, never, never>;
}
