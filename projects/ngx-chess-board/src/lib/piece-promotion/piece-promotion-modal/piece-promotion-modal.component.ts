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
    private onCloseCallback: (letter: string) => void;

    open(closeCallback: (letter: string) => void) {
        this.opened = true;
        this.onCloseCallback = closeCallback;
        this.modal.nativeElement.style.display = 'block';
    }

    close(): void {
        this.changeSelection(undefined);
    }

    changeSelection(letter: string) {
        if (this.opened) {
            this.modal.nativeElement.style.display = 'none';
            this.onCloseCallback(letter);
            this.opened = false;
        }
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
