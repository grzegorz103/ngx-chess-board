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

  selectedIndex: number = 1;
  private onCloseCallback: (index: number) => void;

  open(closeCallback: (index: number) => void) {
    this.onCloseCallback = closeCallback;
    this.modal.nativeElement.style.display = 'block';
  }

  async close() {
    this.onCloseCallback(this.selectedIndex);
    this.modal.nativeElement.style.display = 'none';
  }

  changeSelection(index: number){
    this.selectedIndex = index;
  }

}
