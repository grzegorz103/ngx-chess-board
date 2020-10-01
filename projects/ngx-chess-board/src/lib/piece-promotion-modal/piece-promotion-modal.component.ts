import { Component, ElementRef, ViewChild } from '@angular/core';
import { Color } from '../models/pieces/color';

@Component({
    selector: 'app-piece-promotion-modal',
    templateUrl: './piece-promotion-modal.component.html',
    styleUrls: ['./piece-promotion-modal.component.scss'],
})
export class PiecePromotionModalComponent {
    @ViewChild('modal', { static: false }) modal: ElementRef;

    selectedIndex = 1;
    color: Color;
    Color = Color;
    opened = false;
    private onCloseCallback: (index: number) => void;

    open(color: Color, closeCallback: (index: number) => void) {
        this.opened = true;
        this.color = color;
        this.onCloseCallback = closeCallback;
        this.modal.nativeElement.style.display = 'block';
    }

    changeSelection(index: number) {
        this.modal.nativeElement.style.display = 'none';
        this.opened = false;
        this.onCloseCallback(index);
    }
}
