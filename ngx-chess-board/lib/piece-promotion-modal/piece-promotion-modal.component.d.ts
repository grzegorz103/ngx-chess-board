import { ElementRef } from '@angular/core';
import { Color } from '../models/pieces/color';
export declare class PiecePromotionModalComponent {
    modal: ElementRef;
    selectedIndex: number;
    color: Color;
    Color: typeof Color;
    opened: boolean;
    private onCloseCallback;
    open(color: Color, closeCallback: (index: number) => void): void;
    changeSelection(index: number): void;
}
