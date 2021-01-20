import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Piece} from '../models/pieces/piece';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-piece-promotion-modal',
    templateUrl: './piece-promotion-modal.component.html',
    styleUrls: ['./piece-promotion-modal.component.scss']
})
export class PiecePromotionModalComponent {

    @ViewChild('myModal', {static: false}) modal: ElementRef;

    opened = false;
    private onCloseCallback: (index: number) => void;

    open(closeCallback: (index: number) => void) {
        this.opened = true;
        this.onCloseCallback = closeCallback;
        this.modal.nativeElement.style.display = 'block';
    }

    changeSelection(index: number){
        this.modal.nativeElement.style.display = 'none';
        this.opened = false;
        this.onCloseCallback(index);
    }

}
