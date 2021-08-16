import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PieceIconInput } from '../../utils/inputs/piece-icon-input';

@Component({
    selector: 'app-piece-promotion-modal',
    templateUrl: './piece-promotion-modal.component.html',
    styleUrls: ['./piece-promotion-modal.component.scss']
})
export class PiecePromotionModalComponent {

    @ViewChild('myModal', {static: false}) modal: ElementRef;

    @Input()
    pieceIconInput: PieceIconInput;

    @Input()
    color = 'white';

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

    getPieceIcon(piece: string): string {
        let coloredPiece = '';
        switch (piece.toLowerCase()) {
            case 'queen':
                coloredPiece = this.color === 'white' ? this.pieceIconInput.whiteQueenUrl : this.pieceIconInput.blackQueenUrl;
                break;
            case 'rook':
                coloredPiece = this.color === 'white' ? this.pieceIconInput.whiteRookUrl : this.pieceIconInput.blackRookUrl;
                break;
            case 'bishop':
                coloredPiece = this.color === 'white' ? this.pieceIconInput.whiteBishopUrl : this.pieceIconInput.blackBishopUrl;
                break;
            case 'knight':
                coloredPiece = this.color === 'white' ? this.pieceIconInput.whiteKnightUrl : this.pieceIconInput.blackKnightUrl;
                break;
        }

        return coloredPiece;
    }
}
