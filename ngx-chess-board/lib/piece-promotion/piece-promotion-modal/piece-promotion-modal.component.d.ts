import { ElementRef } from '@angular/core';
export declare class PiecePromotionModalComponent {
    modal: ElementRef;
    opened: boolean;
    private onCloseCallback;
    open(closeCallback: (index: number) => void): void;
    changeSelection(index: number): void;
}
