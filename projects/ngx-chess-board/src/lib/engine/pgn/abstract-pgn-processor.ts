import { Board } from '../../models/board';
import { Piece } from '../../models/pieces/piece';
import { Point } from '../../models/pieces/point';

export abstract class AbstractPgnProcessor {

    protected pgn = '';
    protected currentIndex = 0.5;

    public abstract process(
        board: Board,
        sourcePiece: Piece,
        destPoint: Point,
        destPiece?: Piece
    ): void;

    public getPGN() {
        return this.pgn;
    }

    processChecks(checkmate: boolean, check: boolean, stalemate: boolean) {
        if (checkmate) {
            this.pgn += '#';
        } else {
            if (check) {
                this.pgn += '+';
            }
        }
    }

    reset() {
        this.pgn = '';
        this.currentIndex = 0.5;
    }

    addPromotionChoice(promotion) {
        switch (promotion) {
            case 1:
                this.pgn += '=Q';
                break;
            case 2:
                this.pgn += '=R';
                break;
            case 3:
                this.pgn += '=B';
                break;
            case 4:
                this.pgn += '=N';
                break;
        }
    }

    removeLast() {
        if(this.currentIndex >= 0.5) {
            this.currentIndex -= 0.5;
            const regex1 = new RegExp( /\d+\./g );
            regex1.test(this.pgn);
            this.pgn = this.pgn.substring(0, regex1.lastIndex).trim();
        }
    }

}
