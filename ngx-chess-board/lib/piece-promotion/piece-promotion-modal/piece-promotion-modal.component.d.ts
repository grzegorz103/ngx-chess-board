import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PiecePromotionModalComponent {
    modal: ElementRef;
    opened: boolean;
    private onCloseCallback;
    open(closeCallback: (index: number) => void): void;
    changeSelection(index: number): void;
    static ɵfac: i0.ɵɵFactoryDef<PiecePromotionModalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<PiecePromotionModalComponent, "app-piece-promotion-modal", never, {}, {}, never, never>;
}
